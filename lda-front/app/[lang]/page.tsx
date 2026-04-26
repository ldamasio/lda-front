import Image from "next/image";
import Link from "next/link";
import { EyebrowSection } from "@/components/ui/eyebrow-section";
import { WorkCard } from "@/components/ui/work-card";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { PROFESSIONAL_WORK, PERSONAL_WORK } from "@/app/data/work";
import { NOTES } from "@/app/data/notes";

export async function generateMetadata() {
  return {
    title: "Leandro Damasio",
    description:
      "Computer Engineer. AI systems for finance and high-reliability environments.",
  };
}

const CAPABILITIES = [
  "AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance",
  "Distributed systems · trading infrastructure · event-driven architecture",
  "Languages: Rust, TypeScript, Python, Go, Bash",
  "Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker",
  "Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis",
  "Frameworks: FastAPI, Next.js, React, Svelte, Nest.js",
  "Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation",
];

const CONTACT_LINKS = [
  { label: "leandro@rbxsystems.ch", href: "mailto:leandro@rbxsystems.ch" },
  { label: "github.com/ldamasio",   href: "https://github.com/ldamasio" },
  { label: "linkedin.com/in/ldamasio", href: "https://www.linkedin.com/in/ldamasio/" },
];

export default function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  return (
    <div
      className="w-full mx-auto px-8"
      style={{ maxWidth: "var(--content-width)", paddingTop: "120px", paddingBottom: "var(--space-32)" }}
    >

      {/* ── Hero ─────────────────────────────────────────────── */}
      <FadeIn>
      <section className="mb-24">
        <div className="flex items-start justify-between gap-12">
          <div style={{ maxWidth: "var(--prose-width)" }}>
            <p
              className="t-eyebrow mb-4"
              style={{ color: "var(--text-label)" }}
            >
              Brazil · Zürich
            </p>
            <h1
              className="t-display mb-6 text-balance"
              style={{ color: "var(--text-primary)" }}
            >
              Leandro Damasio
            </h1>
            <p
              className="t-lead mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Computer Engineer. AI systems for finance and high-reliability
              environments.
            </p>
            <p className="t-body mb-10" style={{ color: "var(--text-label)" }}>
              Based in Brazil, working across Zürich and São Paulo.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="brass" asChild>
                <a href="#work">Selected work</a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/${lang}/notes`}>Notes</Link>
              </Button>
            </div>
          </div>

          {/* Portrait */}
          <div
            className="shrink-0 hidden md:block"
            style={{
              width: 96,
              height: 96,
              border: "1px solid var(--surface-hairline)",
              overflow: "hidden",
            }}
          >
            <Image
              src="/ldamasio-portrait.jpeg"
              alt="Leandro Damasio"
              width={96}
              height={96}
              className="w-full h-full object-cover grayscale"
              priority
            />
          </div>
        </div>
      </section>
      </FadeIn>

      {/* ── Selected Work ─────────────────────────────────────── */}
      <FadeIn delay={80}>
      <section id="work" className="mb-24">
        <EyebrowSection
          eyebrow="Selected Projects"
          heading="Work"
          subheading="2017–2026"
          className="mb-8"
        />

        {/* Professional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {PROFESSIONAL_WORK.map((item) => (
            <WorkCard
              key={item.slug}
              client={item.client}
              role={item.role}
              years={item.years}
              description={item.description}
              stack={item.stack}
              status={item.status}
              href={`/${lang}/work/${item.slug}`}
            />
          ))}
        </div>

        {/* Personal tools */}
        <div
          className="pt-4 mt-4"
          style={{ borderTop: "1px solid var(--surface-hairline)" }}
        >
          <p
            className="t-eyebrow mb-4"
            style={{ color: "var(--text-disabled)" }}
          >
            Personal tools
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONAL_WORK.map((item) => (
              <WorkCard
                key={item.slug}
                client={item.client}
                role={item.role}
                years={item.years}
                description={item.description}
                stack={item.stack}
                status={item.status}
                href={item.repo ?? `/${lang}/work/${item.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* ── Capabilities ─────────────────────────────────────── */}
      <FadeIn>
      <section className="mb-24">
        <EyebrowSection
          eyebrow="Capabilities"
          heading="Technical expertise"
          className="mb-8"
        />
        <div style={{ maxWidth: "var(--prose-width)" }}>
          {CAPABILITIES.map((line, i) => (
            <p
              key={i}
              className="t-mono mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {line}
            </p>
          ))}
        </div>
      </section>
      </FadeIn>

      {/* ── Writing ──────────────────────────────────────────── */}
      <FadeIn>
      <section className="mb-24">
        <EyebrowSection
          eyebrow="Writing"
          heading="Notes"
          className="mb-8"
        />
        <div style={{ maxWidth: "var(--prose-width)" }}>
          {NOTES.map((note) => (
            <Link
              key={note.slug}
              href={`/${lang}/notes/${note.slug}`}
              className="group/note flex items-baseline justify-between gap-6 py-4 border-b border-surface-hairline"
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
                  className="text-ink-secondary group-hover/note:text-ink-primary transition-colors"
                  style={{ fontSize: "15px", lineHeight: 1.45 }}
                >
                  {note.title}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="t-mono" style={{ color: "var(--text-label)" }}>
                  {new Date(note.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="t-mono" style={{ color: "var(--text-disabled)" }}>
                  {note.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </FadeIn>

      {/* ── Contact ──────────────────────────────────────────── */}
      <FadeIn>
      <section id="contact">
        <EyebrowSection
          eyebrow="Contact"
          heading="Available for selected engagements."
          className="mb-6"
        />
        <div style={{ maxWidth: "var(--prose-width)" }}>
          {CONTACT_LINKS.map(({ label, href }) => (
            <p key={href} className="mb-3">
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="t-body"
                style={{
                  color: "var(--text-secondary)",
                  borderBottom: "1px solid var(--surface-divider)",
                  paddingBottom: "1px",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            </p>
          ))}
        </div>
      </section>
      </FadeIn>
    </div>
  );
}
