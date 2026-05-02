import Image from "next/image";
import Link from "next/link";
import { EyebrowSection } from "@/components/ui/eyebrow-section";
import { WorkCard } from "@/components/ui/work-card";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { PROFESSIONAL_WORK, PERSONAL_WORK } from "@/app/data/work";
import { NOTES } from "@/app/data/notes";
import { getDictionary } from "./dictionaries-server";
import { getUiText } from "./ui-text";

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang);
  return {
    title: t.meta.title,
    description: t.meta.desc[0],
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

interface DictionaryExperience {
  company?: string;
  Company?: string;
  title?: string;
  Title?: string;
  dates?: string;
  Dates?: string;
  description?: string[];
  Description?: string[];
}

interface DictionaryProject {
  name?: string;
  description?: string;
  repositories?: string[];
  technologies?: string;
}

interface HomeDictionary {
  curriculum?: {
    professionalExperience?: DictionaryExperience[];
    ProfessionalExperience?: DictionaryExperience[];
  };
  portfolio?: {
    highlights?: DictionaryProject[];
  };
}

function firstParagraph(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return String(value ?? "");
}

function localizedProfessionalWork(t: HomeDictionary) {
  const experiences = t.curriculum?.professionalExperience ?? t.curriculum?.ProfessionalExperience ?? [];

  return PROFESSIONAL_WORK.map((item) => {
    const match = experiences.find((exp) => {
      const company = String(exp.company ?? exp.Company ?? "").toLowerCase();
      return (
        item.client.toLowerCase().includes(company.split(" ")[0]) ||
        company.includes(item.client.toLowerCase().split(" ")[0])
      );
    });

    if (!match) return item;

    return {
      ...item,
      role: match.title ?? match.Title ?? item.role,
      years: match.dates ?? match.Dates ?? item.years,
      description: firstParagraph(match.description ?? match.Description) || item.description,
    };
  });
}

function localizedPersonalWork(t: HomeDictionary) {
  const highlights = t.portfolio?.highlights ?? [];

  return PERSONAL_WORK.map((item) => {
    const match = highlights.find((project) => {
      const repo = project.repositories?.[0] ?? "";
      return (
        repo === item.repo ||
        String(project.name ?? "").toLowerCase().includes(item.slug.replaceAll("-", " "))
      );
    });

    if (!match) return item;

    return {
      ...item,
      role: match.name ?? item.role,
      description: match.description ?? item.description,
      stack: typeof match.technologies === "string"
        ? match.technologies.split(",").map((tech: string) => tech.trim()).filter(Boolean)
        : item.stack,
    };
  });
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang);
  const ui = getUiText(lang);
  const professionalWork = localizedProfessionalWork(t);
  const personalWork = localizedPersonalWork(t);
  const heroDescription = Array.isArray(t.meta.desc) ? t.meta.desc : [t.meta.desc];

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
              {t.curriculum.location}
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
              {heroDescription[0]}
            </p>
            <p className="t-body mb-10" style={{ color: "var(--text-label)" }}>
              {heroDescription[heroDescription.length - 1] ?? ui.based}
            </p>
            <div className="flex items-center gap-3">
              <Button variant="brass" asChild>
                <a href="#work">{ui.selectedWork}</a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/${lang}/notes`}>{ui.notes}</Link>
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
          eyebrow={ui.selectedProjects}
          heading={ui.work}
          subheading="2017–2026"
          className="mb-8"
        />

        {/* Professional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {professionalWork.map((item) => (
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
            {ui.personalTools}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalWork.map((item) => (
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
          eyebrow={ui.capabilities}
          heading={ui.technicalExpertise}
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
          eyebrow={ui.writing}
          heading={ui.notes}
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

      {/* ── Speaking & Writing ───────────────────────────────── */}
      <FadeIn>
      <section className="mb-24">
        <EyebrowSection
          eyebrow="Speaking & Writing"
          heading={ui.publications}
          className="mb-8"
        />
        <div style={{ maxWidth: "var(--prose-width)" }}>
          <a
            href="/how-ai-coding-agents-read-code.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group/pub flex items-baseline justify-between gap-6 py-4 border-b border-surface-hairline"
            style={{ textDecoration: "none" }}
          >
            <div className="flex-1 min-w-0">
              <p className="t-mono mb-1" style={{ color: "var(--text-label)" }}>
                Paper · PDF
              </p>
              <p
                className="text-ink-secondary group-hover/pub:text-ink-primary transition-colors"
                style={{ fontSize: "15px", lineHeight: 1.45 }}
              >
                How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control
              </p>
            </div>
            <p className="t-mono shrink-0" style={{ color: "var(--text-disabled)" }}>
              2025
            </p>
          </a>
          <a
            href="/ai-agents-montreal.pptx"
            target="_blank"
            rel="noopener noreferrer"
            className="group/pub flex items-baseline justify-between gap-6 py-4 border-b border-surface-hairline"
            style={{ textDecoration: "none" }}
          >
            <div className="flex-1 min-w-0">
              <p className="t-mono mb-1" style={{ color: "var(--text-label)" }}>
                Talk · Slides · AI Agents Meetup, Montréal
              </p>
              <p
                className="text-ink-secondary group-hover/pub:text-ink-primary transition-colors"
                style={{ fontSize: "15px", lineHeight: 1.45 }}
              >
                AI Agents: Practical Architectures
              </p>
            </div>
            <p className="t-mono shrink-0" style={{ color: "var(--text-disabled)" }}>
              2024
            </p>
          </a>
        </div>
      </section>
      </FadeIn>

      {/* ── Contact ──────────────────────────────────────────── */}
      <FadeIn>
      <section id="contact">
        <EyebrowSection
          eyebrow={ui.contact}
          heading={ui.available}
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
