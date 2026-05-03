import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { formatNoteDate, getAllNotes, getNote, NOTE_LANGS } from "@/lib/notes";
import { getUiText } from "../../ui-text";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const englishNotes = await getAllNotes("en");
  return NOTE_LANGS.flatMap((lang) =>
    englishNotes.map((note) => ({ lang, slug: note.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const note = await getNote(params.slug, params.lang);
  if (!note) return {};
  return {
    title: `${note.title} · Leandro Damasio`,
    description: note.description,
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const note = await getNote(params.slug, params.lang);
  if (!note) notFound();
  const ui = getUiText(params.lang);

  return (
    <div
      className="w-full mx-auto px-8"
      style={{
        maxWidth: "var(--content-width)",
        paddingTop: "120px",
        paddingBottom: "var(--space-32)",
      }}
    >
      {/* Back */}
      <Link
        href={`/${params.lang}/notes`}
        className="t-mono inline-flex items-center gap-2 mb-10"
        style={{
          color: "var(--text-label)",
          textDecoration: "none",
          letterSpacing: "var(--ls-eyebrow)",
          textTransform: "uppercase",
          fontSize: "var(--text-xs)",
        }}
      >
        ← {ui.notes}
      </Link>

      {/* Note header */}
      <div style={{ maxWidth: "var(--prose-width)" }}>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <p className="t-mono" style={{ color: "var(--text-label)" }}>
            {formatNoteDate(note.date, params.lang)}
          </p>
          <span style={{ color: "var(--surface-divider)" }}>·</span>
          <p className="t-mono" style={{ color: "var(--accent-personal)" }}>
            {note.tags.join(" · ")}
          </p>
          <span style={{ color: "var(--surface-divider)" }}>·</span>
          <p className="t-mono" style={{ color: "var(--text-disabled)" }}>
            {note.readTime}
          </p>
        </div>

        <h1
          className="t-h2 mb-6 text-balance"
          style={{
            color: "var(--text-primary)",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 300,
          }}
        >
          {note.title}
        </h1>

        <p
          className="t-lead mb-10"
          style={{
            color: "var(--text-secondary)",
            borderBottom: "1px solid var(--surface-hairline)",
            paddingBottom: "2.5rem",
          }}
        >
          {note.description}
        </p>

        {/* Body */}
        <article className="note-prose">
          <MDXRemote
            source={note.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </article>
      </div>
    </div>
  );
}
