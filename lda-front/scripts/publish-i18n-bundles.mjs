#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CMS_API_URL = (process.env.CMS_API_URL ?? 'https://cms.rbxsystems.ch').replace(/\/$/, '');
const CMS_SERVICE_KEY = process.env.CMS_SERVICE_KEY;
const LEGACY_SOURCE_COMMIT = process.env.LEGACY_SOURCE_COMMIT ?? '84fd945';
const REPO_ROOT = process.cwd();

function extractLiteral(source, marker, opening, closing) {
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`marker not found: ${marker}`);
  }

  const literalStart = source.indexOf(opening, start + marker.length);
  if (literalStart === -1) {
    throw new Error(`opening ${opening} not found for: ${marker}`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = literalStart; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === opening) {
      depth += 1;
      continue;
    }

    if (ch === closing) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(literalStart, i + 1);
      }
    }
  }

  throw new Error(`unterminated ${opening} literal for: ${marker}`);
}

function parseJsLiteral(source, marker, opening, closing, context = {}) {
  const literal = extractLiteral(source, marker, opening, closing);
  const keys = Object.keys(context);
  const values = Object.values(context);
  return Function(...keys, `return (${literal});`)(...values);
}

function parseJsObject(source, marker, context = {}) {
  return parseJsLiteral(source, marker, '{', '}', context);
}

function parseJsArray(source, marker, context = {}) {
  return parseJsLiteral(source, marker, '[', ']', context);
}

function getCurrentHomeBundles() {
  const source = readFileSync(resolve(REPO_ROOT, 'src/lib/content.ts'), 'utf8');
  const commonLinks = parseJsArray(source, 'const COMMON_LINKS: LinkItem[] = ');
  return {
    en: parseJsObject(source, "const EN: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    ptBR: parseJsObject(source, "const PT: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    de: parseJsObject(source, "const DE: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    es: parseJsObject(source, "const ES: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    fr: parseJsObject(source, "const FR: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    it: parseJsObject(source, "const IT: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    zh: parseJsObject(source, "const ZH: HomeCopy = ", { COMMON_LINKS: commonLinks }),
  };
}

function validateHomeBundles(bundles) {
  const locales = Object.entries(bundles);
  const referenceLinks = locales[0]?.[1]?.contact?.links;
  if (!Array.isArray(referenceLinks) || referenceLinks.length < 2 ||
      referenceLinks.some((link) => typeof link?.label !== 'string' || typeof link?.href !== 'string')) {
    throw new Error('COMMON_LINKS must parse as a non-empty LinkItem array');
  }

  for (const [locale, bundle] of locales) {
    if (!Array.isArray(bundle.contact?.links) ||
        JSON.stringify(bundle.contact.links) !== JSON.stringify(referenceLinks)) {
      throw new Error(`${locale}: contact.links must contain the complete COMMON_LINKS array`);
    }
  }
  return { locales: locales.length, linksPerLocale: referenceLinks.length };
}

function getLegacyArchive() {
  const locales = ['de', 'en', 'es', 'fr', 'it', 'pt', 'zh'];
  const archive = {};

  for (const locale of locales) {
    const treeLine = execFileSync('git', ['ls-tree', LEGACY_SOURCE_COMMIT, `app/[lang]/dictionaries/${locale}.json`], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
    if (!treeLine) {
      throw new Error(`legacy bundle missing: ${locale}`);
    }

    const parts = treeLine.split(/\s+/);
    const blob = parts[2];
    const raw = execFileSync('git', ['cat-file', '-p', blob], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    archive[locale] = JSON.parse(raw);
  }

  return {
    sourceCommit: LEGACY_SOURCE_COMMIT,
    locales: archive,
  };
}

async function cmsFetch(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${CMS_API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${CMS_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${method} ${path} failed: ${response.status} ${await response.text()}`);
  }

  return response;
}

async function saveAndPublishPage(key, locale, frontmatter, bundle) {
  const body = {
    frontmatter,
    body: JSON.stringify(bundle, null, 2) + '\n',
  };

  await cmsFetch(`/api/v1/pages/${encodeURIComponent(key)}/${locale}`, { method: 'PUT', body });
  const publish = await cmsFetch(`/api/v1/pages/${encodeURIComponent(key)}/${locale}/publish`, { method: 'POST' });
  return publish.json();
}

async function main() {
  const bundles = getCurrentHomeBundles();
  const validation = validateHomeBundles(bundles);
  if (process.argv.includes('--validate-only')) {
    console.log(JSON.stringify(validation));
    return;
  }
  if (!CMS_SERVICE_KEY) {
    throw new Error('CMS_SERVICE_KEY is required');
  }

  const { en, ptBR, de, es, fr, it, zh } = bundles;
  const legacyArchive = getLegacyArchive();

  const homeBundles = {
    'pt-BR': ptBR,
    en,
    de,
    es,
    fr,
    it,
    zh,
  };

  const results = [];
  for (const [locale, bundle] of Object.entries(homeBundles)) {
    try {
      results.push(await saveAndPublishPage('translations-home', locale, {
        title: 'Home translation bundle',
        description: `Home content bundle (${locale}) stored as JSON in S3.`,
      }, bundle));
    } catch (error) {
      // CMS only allows pt-BR/en locales today; keep going so the supported
      // locales still publish. Extras fall back to app-local literals at runtime.
      console.warn(`skipped ${locale}: ${error.message}`);
    }
  }
  results.push(await saveAndPublishPage('translations-legacy', 'pt-BR', {
    title: 'Legacy translation archive',
    description: `Archive of legacy Next translation bundles from ${LEGACY_SOURCE_COMMIT}.`,
  }, legacyArchive));
  results.push(await saveAndPublishPage('translations-legacy', 'en', {
    title: 'Legacy translation archive',
    description: `Archive of legacy Next translation bundles from ${LEGACY_SOURCE_COMMIT}.`,
  }, legacyArchive));

  console.log(JSON.stringify(results, null, 2));
}

await main();
