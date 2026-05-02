import Link from "next/link";
import { EyebrowSection } from "@/components/ui/eyebrow-section";
import { NOTES } from "@/app/data/notes";
import { getUiText } from "../ui-text";

export const metadata = {
  title: "Notes · Leandro Damasio",
  description: "Writing on AI systems, governance, and infrastructure.",
};

export default function NotesPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const ui = getUiText(lang);

  return (
    <div
      className="w-full mx-auto px-8"
      style={{
        maxWidth: "var(--content-width)",
        paddingTop: "120px",
        paddingBottom: "var(--space-32)",
      }}
    >
      <EyebrowSection
        eyebrow={ui.writing}
        heading={ui.notes}
        className="mb-10"
        style={{ maxWidth: "var(--prose-width)" }}
      />

      <div style={{ maxWidth: "var(--prose-width)" }}>
        {NOTES.map((note) => (
          <Link
            key={note.slug}
            href={`/${lang}/notes/${note.slug}`}
            className="group/note flex items-baseline justify-between gap-6 py-5 border-b border-surface-hairline"
            style={{ textDecoration: "none" }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="t-mono mb-1"
                style={{ color: "var(--accent-personal)" }}
              >
                {note.tags.join(" · ")}
              </p>
              <p
                className="text-ink-secondary group-hover/note:text-ink-primary transition-colors mb-1"
                style={{ fontSize: "15px", lineHeight: 1.45 }}
              >
                {note.title}
              </p>
              <p
                className="t-mono"
                style={{ color: "var(--text-disabled)", fontSize: "11px" }}
              >
                {note.description}
              </p>
            </div>
            <div className="shrink-0 text-right min-w-[80px]">
              <p className="t-mono" style={{ color: "var(--text-label)" }}>
                {new Date(note.date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                })}
              </p>
              <p className="t-mono" style={{ color: "var(--text-disabled)" }}>
                {note.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
