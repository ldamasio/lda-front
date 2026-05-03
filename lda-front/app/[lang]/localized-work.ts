import type { WorkItem } from "@/app/data/work";
import { PERSONAL_WORK, PROFESSIONAL_WORK } from "@/app/data/work";

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

export interface DictionaryWorkOverride {
  client?: string;
  role?: string;
  years?: string;
  description?: string;
  stack?: string[];
  repo?: string;
}

export interface WorkDictionary {
  curriculum?: {
    professionalExperience?: DictionaryExperience[];
    ProfessionalExperience?: DictionaryExperience[];
  };
  portfolio?: {
    highlights?: DictionaryProject[];
  };
  workOverrides?: Record<string, DictionaryWorkOverride>;
}

function firstParagraph(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return String(value ?? "");
}

export function applyWorkOverride(
  item: WorkItem,
  t: WorkDictionary,
): WorkItem {
  const override = t.workOverrides?.[item.slug];
  if (!override) return item;

  return {
    ...item,
    ...override,
    stack: override.stack ?? item.stack,
    status: item.status,
    metrics: item.metrics,
  };
}

export function localizedProfessionalWork(t: WorkDictionary): WorkItem[] {
  const experiences =
    t.curriculum?.professionalExperience ??
    t.curriculum?.ProfessionalExperience ??
    [];

  return PROFESSIONAL_WORK.map((item) => {
    const match = experiences.find((exp) => {
      const company = String(exp.company ?? exp.Company ?? "").toLowerCase();
      return (
        item.client.toLowerCase().includes(company.split(" ")[0]) ||
        company.includes(item.client.toLowerCase().split(" ")[0])
      );
    });

    const localized = match
      ? {
          ...item,
          role: match.title ?? match.Title ?? item.role,
          years: match.dates ?? match.Dates ?? item.years,
          description:
            firstParagraph(match.description ?? match.Description) ||
            item.description,
        }
      : item;

    return applyWorkOverride(localized, t);
  });
}

export function localizedPersonalWork(t: WorkDictionary): WorkItem[] {
  const highlights = t.portfolio?.highlights ?? [];

  return PERSONAL_WORK.map((item) => {
    const match = highlights.find((project) => {
      const repo = project.repositories?.[0] ?? "";
      return (
        repo === item.repo ||
        String(project.name ?? "")
          .toLowerCase()
          .includes(item.slug.replaceAll("-", " "))
      );
    });

    const localized = match
      ? {
          ...item,
          role: match.name ?? item.role,
          description: match.description ?? item.description,
          stack:
            typeof match.technologies === "string"
              ? match.technologies
                  .split(",")
                  .map((tech: string) => tech.trim())
                  .filter(Boolean)
              : item.stack,
        }
      : item;

    return applyWorkOverride(localized, t);
  });
}

export function localizedWorkItem(item: WorkItem, t: WorkDictionary): WorkItem {
  const localizedItems =
    item.kind === "professional"
      ? localizedProfessionalWork(t)
      : localizedPersonalWork(t);

  return localizedItems.find((localized) => localized.slug === item.slug) ?? item;
}
