#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CMS_API_URL = (process.env.CMS_API_URL ?? 'https://cms.rbxsystems.ch').replace(/\/$/, '');
const CMS_SERVICE_KEY = process.env.CMS_SERVICE_KEY;
const LEGACY_SOURCE_COMMIT = process.env.LEGACY_SOURCE_COMMIT ?? '84fd945';
const REPO_ROOT = process.cwd();

if (!CMS_SERVICE_KEY) {
  throw new Error('CMS_SERVICE_KEY is required');
}

function extractObjectLiteral(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`marker not found: ${marker}`);
  }

  const braceStart = source.indexOf('{', start);
  if (braceStart === -1) {
    throw new Error(`opening brace not found for: ${marker}`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = braceStart; i < source.length; i += 1) {
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

    if (ch === '{') {
      depth += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(braceStart, i + 1);
      }
    }
  }

  throw new Error(`unterminated object for: ${marker}`);
}

function parseJsObject(source, marker, context = {}) {
  const literal = extractObjectLiteral(source, marker);
  const keys = Object.keys(context);
  const values = Object.values(context);
  return Function(...keys, `return (${literal});`)(...values);
}

function getCurrentHomeBundles() {
  const source = readFileSync(resolve(REPO_ROOT, 'src/lib/content.ts'), 'utf8');
  const commonLinks = parseJsObject(source, "const COMMON_LINKS: LinkItem[] = " );
  return {
    en: parseJsObject(source, "const EN: HomeCopy = ", { COMMON_LINKS: commonLinks }),
    ptBR: parseJsObject(source, "const PT: HomeCopy = ", { COMMON_LINKS: commonLinks }),
  };
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
  const { en, ptBR } = getCurrentHomeBundles();
  const legacyArchive = getLegacyArchive();

  const results = [];
  results.push(await saveAndPublishPage('translations-home', 'pt-BR', {
    title: 'Home translation bundle',
    description: 'Portuguese home content bundle stored as JSON in S3.',
  }, ptBR));
  results.push(await saveAndPublishPage('translations-home', 'en', {
    title: 'Home translation bundle',
    description: 'English home content bundle stored as JSON in S3.',
  }, en));
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
