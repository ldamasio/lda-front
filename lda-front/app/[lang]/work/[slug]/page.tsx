import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/ui/status-pill";
import { WORK } from "@/app/data/work";

const LANGS = ["en", "de", "es", "fr", "it", "pt", "zh"];

export async function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    WORK.map((item) => ({ lang, slug: item.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const item = WORK.find((w) => w.slug === params.slug);
  if (!item) return {};
  return {
    title: `${item.role} — ${item.client} · Leandro Damasio`,
    description: item.description,
  };
}

export default function WorkDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const item = WORK.find((w) => w.slug === params.slug);
  if (!item) notFound();

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
        href={`/${params.lang}/#work`}
        className="t-mono inline-flex items-center gap-2 mb-10"
        style={{
          color: "var(--text-label)",
          textDecoration: "none",
          letterSpacing: "var(--ls-eyebrow)",
          textTransform: "uppercase",
          fontSize: "var(--text-xs)",
        }}
      >
        ← Back
      </Link>

      {/* Header */}
      <div
        className="pb-6 mb-10"
        style={{ borderBottom: "1px solid var(--surface-hairline)" }}
      >
        <p className="t-eyebrow mb-2">{item.client}</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="t-h1" style={{ color: "var(--text-primary)" }}>
            {item.role}
          </h1>
          <StatusPill status={item.status} />
        </div>
        <p className="t-mono mt-3" style={{ color: "var(--text-label)" }}>
          {item.years}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-16 flex-col md:flex-row">

        {/* Prose column */}
        <div className="flex-1" style={{ maxWidth: "var(--prose-width)" }}>
          <p
            className="t-lead mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            {item.description}
          </p>

          <div
            className="pt-6 mt-6"
            style={{ borderTop: "1px solid var(--surface-hairline)" }}
          >
            <p className="t-eyebrow mb-4">Stack</p>
            <p className="t-mono" style={{ color: "var(--text-secondary)" }}>
              {item.stack.join(" · ")}
            </p>
          </div>

          {item.repo && (
            <div
              className="pt-6 mt-6"
              style={{ borderTop: "1px solid var(--surface-hairline)" }}
            >
              <a
                href={item.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="t-mono"
                style={{
                  color: "var(--accent-personal)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--surface-divider)",
                  paddingBottom: "1px",
                }}
              >
                {item.repo.replace("https://", "")}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {item.metrics && item.metrics.length > 0 && (
          <aside style={{ width: 280, flexShrink: 0 }}>
            <div
              className="p-5 rounded-ds-md"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--surface-hairline)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <p className="t-eyebrow mb-6">Metrics</p>
              <dl className="space-y-5">
                {item.metrics.map((m) => (
                  <div key={m.label}>
                    <dt
                      className="t-mono mb-1"
                      style={{ color: "var(--text-label)", fontSize: "10px" }}
                    >
                      {m.label}
                    </dt>
                    <dd
                      className="font-mono font-medium"
                      style={{
                        color: "var(--accent-brass)",
                        fontSize: "15px",
                      }}
                    >
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
