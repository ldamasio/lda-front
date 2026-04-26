import { getDictionary } from "../dictionaries-server";
import { EyebrowSection } from "@/components/ui/eyebrow-section";
import { StatusPill } from "@/components/ui/status-pill";
import { Experience, Education, Achievement } from "../types";
import common from "../common.json";

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang);
  return {
    title: `Curriculum Vitae · ${t.curriculum.name}`,
    description: t.curriculum.headline,
  };
}

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  languages:           "Languages",
  fullStackDevelopment: "Full Stack",
  devOps:              "DevOps",
  cloud:               "Cloud",
  data:                "Data",
  AIML:                "AI / ML",
  softwareArchitecture: "Architecture",
  observability:       "Observability",
};

export default async function CVPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang);
  const experiences: Experience[] =
    t.curriculum.professionalExperience ?? t.curriculum.ProfessionalExperience ?? [];
  const educations: Education[] =
    t.curriculum.education ?? t.curriculum.Education ?? [];
  const achievements: Achievement[] =
    t.curriculum.keyAchievements ?? t.curriculum.KeyAchievements ?? [];

  return (
    <div
      className="w-full mx-auto px-8"
      style={{
        maxWidth: "var(--content-width)",
        paddingTop: "120px",
        paddingBottom: "var(--space-32)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className="pb-8 mb-12"
        style={{ borderBottom: "1px solid var(--surface-hairline)" }}
      >
        <p className="t-eyebrow mb-2">{t.curriculum.location}</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="t-h1 mb-2" style={{ color: "var(--text-primary)" }}>
              {t.curriculum.name}
            </h1>
            <p className="t-lead" style={{ color: "var(--text-secondary)" }}>
              {t.curriculum.headline}
            </p>
          </div>
          {t.meta.links?.cvPdfLink && (
            <a
              href={t.meta.links.cvPdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="t-mono shrink-0"
              style={{
                color: "var(--text-label)",
                textDecoration: "none",
                borderBottom: "1px solid var(--surface-divider)",
                paddingBottom: "1px",
                marginTop: "4px",
              }}
            >
              Download PDF
            </a>
          )}
        </div>
        <p
          className="t-body mt-6"
          style={{
            color: "var(--text-secondary)",
            maxWidth: "var(--prose-width)",
          }}
        >
          {t.curriculum.resume}
        </p>
      </div>

      <div className="flex gap-16 flex-col lg:flex-row">
        {/* ── Main column ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Professional Experience */}
          <EyebrowSection
            eyebrow={t.meta.cv.professionalExperience}
            heading=""
            className="mb-6"
          />
          <div className="space-y-6 mb-14">
            {experiences.map((exp, i) => {
              const company = exp.company ?? exp.Company ?? "";
              const title   = exp.title   ?? exp.Title   ?? "";
              const dates   = exp.dates   ?? exp.Dates   ?? "";
              const desc    = exp.description ?? exp.Description ?? [];
              return (
                <div
                  key={i}
                  className="p-5 rounded-ds-md"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--surface-hairline)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <div>
                      <p
                        className="t-mono uppercase mb-1"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                          color: "var(--text-label)",
                        }}
                      >
                        {company}
                      </p>
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: 400,
                          color: "var(--text-primary)",
                        }}
                      >
                        {title}
                      </p>
                    </div>
                    <StatusPill
                      status={i === 0 ? "active" : "shipped"}
                      className="shrink-0 mt-0.5"
                    />
                  </div>
                  <p
                    className="t-mono mb-4"
                    style={{ fontSize: "10px", color: "var(--text-label)" }}
                  >
                    {dates}
                  </p>
                  <ul className="space-y-2">
                    {desc.map((line, j) => (
                      <li
                        key={j}
                        className="t-caption"
                        style={{
                          color: "var(--text-secondary)",
                          paddingLeft: "1em",
                          textIndent: "-0.8em",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--text-disabled)",
                            marginRight: "0.3em",
                          }}
                        >
                          ·
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Education */}
          <EyebrowSection
            eyebrow={t.meta.cv.education}
            heading=""
            className="mb-6"
          />
          <div className="space-y-4 mb-14">
            {educations.map((edu, i) => {
              const degree      = edu.degree      ?? edu.Degree      ?? "";
              const institution = edu.institution ?? edu.Institution ?? "";
              const dates       = edu.dates       ?? edu.Dates       ?? "";
              return (
                <div
                  key={i}
                  className="px-5 py-4 rounded-ds-md"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--surface-hairline)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "var(--text-primary)",
                      marginBottom: "2px",
                    }}
                  >
                    {degree}
                  </p>
                  <p className="t-mono" style={{ color: "var(--text-label)", fontSize: "11px" }}>
                    {institution} · {dates}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Key Achievements */}
          {achievements.length > 0 && (
            <>
              <EyebrowSection
                eyebrow={t.meta.cv.keyAchievements}
                heading=""
                className="mb-6"
              />
              <div className="space-y-4 mb-14">
                {achievements.map((ach, i) => {
                  const area = ach.area ?? ach.Area ?? "";
                  const desc = ach.description ?? ach.Description ?? "";
                  return (
                    <div
                      key={i}
                      className="px-5 py-4 rounded-ds-md"
                      style={{
                        background: "var(--surface-card)",
                        border: "1px solid var(--surface-hairline)",
                      }}
                    >
                      <p
                        className="t-mono uppercase mb-2"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                          color: "var(--accent-brass)",
                        }}
                      >
                        {area}
                      </p>
                      <p className="t-caption" style={{ color: "var(--text-secondary)" }}>
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside style={{ width: 280, flexShrink: 0 }}>

          {/* Languages */}
          {t.curriculum.languages?.length > 0 && (
            <div className="mb-10">
              <p className="t-eyebrow mb-4">{t.meta.cv.languages}</p>
              <div className="flex flex-wrap gap-2">
                {t.curriculum.languages.map((lang: string, i: number) => (
                  <span
                    key={i}
                    className="t-mono px-3 py-1 rounded-ds-sm"
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      background: "var(--surface-raised)",
                      border: "1px solid var(--surface-hairline)",
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skill overview */}
          {t.curriculum.skills?.length > 0 && (
            <div className="mb-10">
              <p className="t-eyebrow mb-4">{t.meta.cv.detailedSkills}</p>
              <div className="flex flex-wrap gap-2">
                {t.curriculum.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="t-mono px-3 py-1 rounded-ds-sm"
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      background: "var(--surface-raised)",
                      border: "1px solid var(--surface-hairline)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed skills by category */}
          <div className="space-y-6">
            {Object.entries(common.skills).map(([category, skills]) => (
              <div key={category}>
                <p
                  className="t-eyebrow mb-3"
                  style={{ color: "var(--text-disabled)", fontSize: "9px" }}
                >
                  {SKILL_CATEGORY_LABELS[category] ?? category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(skills as string[]).map((skill, i) => (
                    <span
                      key={i}
                      className="t-mono"
                      style={{
                        fontSize: "10px",
                        color: "var(--text-label)",
                        background: "var(--surface-raised)",
                        border: "1px solid var(--surface-hairline)",
                        borderRadius: "var(--radius-xs)",
                        padding: "2px 6px",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
