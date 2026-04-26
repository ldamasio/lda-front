import Link from "next/link";
import { notFound } from "next/navigation";
import { NOTES, getNoteBySlug } from "@/app/data/notes";

const LANGS = ["en", "de", "es", "fr", "it", "pt", "zh"];

export async function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    NOTES.map((note) => ({ lang, slug: note.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const note = getNoteBySlug(params.slug);
  if (!note) return {};
  return {
    title: `${note.title} · Leandro Damasio`,
    description: note.description,
  };
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);

  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Horizontal rule
    if (trimmed === "---") {
      return (
        <hr
          key={i}
          style={{
            borderColor: "var(--surface-divider)",
            margin: "2.5rem 0",
          }}
        />
      );
    }

    // Standalone bold line → subheading
    if (/^\*\*.+\*\*$/.test(trimmed)) {
      return (
        <h3
          key={i}
          className="t-h3 mb-3"
          style={{ color: "var(--text-primary)", marginTop: "2rem" }}
        >
          {trimmed.slice(2, -2)}
        </h3>
      );
    }

    // Bullet list
    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2));
      return (
        <ul
          key={i}
          className="mb-4 pl-4 space-y-1"
          style={{ listStyleType: "none" }}
        >
          {items.map((item, j) => (
            <li
              key={j}
              className="t-body"
              style={{
                color: "var(--text-secondary)",
                paddingLeft: "1em",
                textIndent: "-1em",
              }}
            >
              <span style={{ color: "var(--text-disabled)", marginRight: "0.5em" }}>·</span>
              {item.replace(/\*\*(.+?)\*\*/g, "$1")}
            </li>
          ))}
        </ul>
      );
    }

    // Code block
    if (trimmed.startsWith("```")) {
      const code = trimmed.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      return (
        <pre
          key={i}
          className="mb-4 p-4 overflow-x-auto rounded-ds-sm"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--surface-hairline)",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: "var(--lh-relaxed)",
          }}
        >
          <code>{code}</code>
        </pre>
      );
    }

    // Default paragraph (inline bold → strong)
    const withBold = trimmed.replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="color:var(--text-primary);font-weight:500">$1</strong>'
    );
    return (
      <p
        key={i}
        className="t-body mb-5"
        style={{ color: "var(--text-secondary)" }}
        dangerouslySetInnerHTML={{ __html: withBold }}
      />
    );
  });
}

export default function NoteDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const note = getNoteBySlug(params.slug);
  if (!note) notFound();

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
        ← Notes
      </Link>

      {/* Note header */}
      <div style={{ maxWidth: "var(--prose-width)" }}>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <p className="t-mono" style={{ color: "var(--text-label)" }}>
            {new Date(note.date).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
        <div>{renderBody(note.body)}</div>
      </div>
    </div>
  );
}
