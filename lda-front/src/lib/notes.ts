import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { readContaboObject } from '$lib/s3';

export type Locale = 'pt-BR' | 'en';
export type NoteLocale = 'pt' | 'en';

export type NoteBlock =
  | { type: 'heading'; html: string }
  | { type: 'paragraph'; html: string }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'code'; code: string }
  | { type: 'rule' };

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  description: string;
};

export type Note = NoteMeta & {
  content: string;
  blocks: NoteBlock[];
};

const NOTE_DIR = path.join(process.cwd(), 'notes');
const NOTES_PREFIX = 'lda/notes/';

export const NOTE_SLUGS = [
  'prompt-governance-regulated-environments',
  'agentic-runtimes-orchestration-to-control',
  'vector-search-compliance',
  'ai-governance-financial-systems',
  'mlops-pipelines-high-reliability',
] as const;

function toNoteLocale(locale: Locale): NoteLocale {
  return locale === 'pt-BR' ? 'pt' : 'en';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function inlineToHtml(value: string): string {
  const escaped = escapeHtml(value);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, string | string[]>; body: string } {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: normalized };
  }

  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) {
    return { frontmatter: {}, body: normalized };
  }

  const block = normalized.slice(4, end);
  const body = normalized.slice(end + 5);
  const frontmatter: Record<string, string | string[]> = {};

  for (const line of block.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;

    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        frontmatter[key] = JSON.parse(value.replaceAll("'", '"')) as string[];
        continue;
      } catch {
        // fall through to scalar parsing
      }
    }

    frontmatter[key] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }

  return { frontmatter, body };
}

function parseBlocks(body: string): NoteBlock[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: NoteBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed === '---') {
      blocks.push({ type: 'rule' });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: 'code', code: code.join('\n') });
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', html: inlineToHtml(trimmed.slice(3)) });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      blocks.push({ type: 'heading', html: inlineToHtml(trimmed.slice(2, -2)) });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(inlineToHtml(lines[i].trim().slice(2).trim()));
        i += 1;
      }
      blocks.push({ type: 'bullet-list', items });
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('---') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('## ') &&
      !(lines[i].trim().startsWith('**') && lines[i].trim().endsWith('**')) &&
      !lines[i].trim().startsWith('- ')
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }

    blocks.push({ type: 'paragraph', html: inlineToHtml(paragraph.join(' ')) });
  }

  return blocks;
}

async function readLocalNote(fileName: string): Promise<string | null> {
  try {
    return await readFile(path.join(NOTE_DIR, fileName), 'utf8');
  } catch {
    return null;
  }
}

async function readRemoteNote(fileName: string): Promise<string | null> {
  return await readContaboObject(`${NOTES_PREFIX}${fileName}`);
}

async function readNoteSource(slug: string, locale: Locale): Promise<string | null> {
  const suffix = toNoteLocale(locale);
  const fileName = `${slug}.${suffix}.mdx`;
  return (await readRemoteNote(fileName)) ?? (await readLocalNote(fileName));
}

function parseNote(raw: string, slug: string): Note {
  const { frontmatter, body } = parseFrontmatter(raw);
  const title = String(frontmatter.title ?? slug);
  const date = String(frontmatter.date ?? '');
  const readTime = String(frontmatter.readTime ?? '');
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [];
  const description = String(frontmatter.description ?? '');

  return {
    slug,
    title,
    date,
    readTime,
    tags,
    description,
    content: body,
    blocks: parseBlocks(body),
  };
}

export async function getAllNotes(locale: Locale): Promise<NoteMeta[]> {
  const notes = await Promise.all(
    NOTE_SLUGS.map(async (slug) => {
      const raw = await readNoteSource(slug, locale);
      if (!raw) return null;
      const note = parseNote(raw, slug);
      return {
        slug: note.slug,
        title: note.title,
        date: note.date,
        readTime: note.readTime,
        tags: note.tags,
        description: note.description,
      } satisfies NoteMeta;
    })
  );

  return notes.filter((note): note is NoteMeta => note !== null).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNote(slug: string, locale: Locale): Promise<Note | null> {
  const raw = await readNoteSource(slug, locale);
  if (!raw) return null;

  return parseNote(raw, slug);
}

export function formatNoteDate(iso: string): string {
  return iso.slice(0, 7);
}
