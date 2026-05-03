import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unstable_noStore as noStore } from "next/cache";
import { getNoteContent, listNoteKeys, NOTES_PREFIX } from "./s3";

export const NOTE_LANGS = ["en", "de", "es", "fr", "it", "pt", "zh"] as const;
export type NoteLang = (typeof NOTE_LANGS)[number];

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  description: string;
}

export interface Note extends NoteMeta {
  content: string;
}

type NoteDescriptor = {
  key: string;
  slug: string;
  lang?: NoteLang;
  source: "s3" | "local";
};

const NOTE_KEY_RE = /^(.+?)(?:\.(en|de|es|fr|it|pt|zh))?\.mdx$/;
const LOCAL_NOTES_DIR = path.join(process.cwd(), "notes");

export function normalizeNoteLang(lang: string): NoteLang {
  return NOTE_LANGS.includes(lang as NoteLang) ? (lang as NoteLang) : "en";
}

function parseNoteKey(key: string, source: NoteDescriptor["source"]): NoteDescriptor | null {
  const filename = key.replace(NOTES_PREFIX, "");
  const match = filename.match(NOTE_KEY_RE);
  if (!match) return null;

  const slug = match[1];
  const lang = match[2] as NoteLang | undefined;
  if (!slug) return null;

  return { key, slug, lang, source };
}

function selectNoteDescriptor(
  descriptors: NoteDescriptor[],
  lang: NoteLang
): NoteDescriptor | null {
  const exact = descriptors.find((descriptor) => descriptor.lang === lang);
  if (exact) return exact;

  const english = descriptors.find((descriptor) => descriptor.lang === "en");
  if (english) return english;

  const legacy = descriptors.find((descriptor) => !descriptor.lang);
  return legacy ?? descriptors[0] ?? null;
}

async function listLocalNoteKeys(): Promise<string[]> {
  try {
    const files = await readdir(LOCAL_NOTES_DIR);
    return files.filter((file) => file.endsWith(".mdx"));
  } catch {
    return [];
  }
}

async function listDescriptors(): Promise<NoteDescriptor[]> {
  const localKeys = (await listLocalNoteKeys())
    .map((key) => parseNoteKey(key, "local"))
    .filter((descriptor): descriptor is NoteDescriptor => descriptor !== null);

  try {
    const s3Keys = (await listNoteKeys())
      .map((key) => parseNoteKey(key, "s3"))
      .filter((descriptor): descriptor is NoteDescriptor => descriptor !== null);
    return [...s3Keys, ...localKeys];
  } catch (error) {
    console.error("[notes] failed to list notes from S3, using local fallback:", error);
    return localKeys;
  }
}

async function readDescriptor(descriptor: NoteDescriptor): Promise<string> {
  if (descriptor.source === "s3") {
    return getNoteContent(descriptor.key);
  }

  return readFile(path.join(LOCAL_NOTES_DIR, descriptor.key), "utf8");
}

async function getNoteByDescriptor(descriptor: NoteDescriptor): Promise<Note> {
  const raw = await readDescriptor(descriptor);
  const { data, content } = matter(raw);

  return {
    slug: descriptor.slug,
    title: data.title ?? descriptor.slug,
    date: data.date ?? "",
    readTime: data.readTime ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description ?? data.excerpt ?? "",
    content,
  };
}

export async function getAllNotes(lang: string): Promise<NoteMeta[]> {
  noStore();
  const noteLang = normalizeNoteLang(lang);
  const descriptors = await listDescriptors();

  const grouped = descriptors.reduce<Map<string, NoteDescriptor[]>>((acc, descriptor) => {
    const current = acc.get(descriptor.slug) ?? [];
    current.push(descriptor);
    acc.set(descriptor.slug, current);
    return acc;
  }, new Map());

  const selected = Array.from(grouped.values())
    .map((group) => selectNoteDescriptor(group, noteLang))
    .filter((descriptor): descriptor is NoteDescriptor => descriptor !== null);

  const notes = await Promise.all(
    selected.map(async (descriptor) => {
      const note = await getNoteByDescriptor(descriptor);
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

  return notes.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNote(slug: string, lang: string): Promise<Note | null> {
  noStore();
  const noteLang = normalizeNoteLang(lang);
  const descriptors = (await listDescriptors()).filter((descriptor) => descriptor.slug === slug);
  const descriptor = selectNoteDescriptor(descriptors, noteLang);
  if (!descriptor) return null;

  try {
    return await getNoteByDescriptor(descriptor);
  } catch (error) {
    console.error(`[notes] failed to load note ${slug}:`, error);
    return null;
  }
}

export function formatNoteDate(iso: string, lang: string): string {
  const localeByLang: Record<NoteLang, string> = {
    en: "en-US",
    de: "de-DE",
    es: "es-ES",
    fr: "fr-FR",
    it: "it-IT",
    pt: "pt-BR",
    zh: "zh-CN",
  };

  return new Date(iso).toLocaleDateString(localeByLang[normalizeNoteLang(lang)], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
