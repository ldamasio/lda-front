import { getDictionary } from "../dictionaries-server";
import { EyebrowSection } from "@/components/ui/eyebrow-section";
import { getUiText } from "../ui-text";

const CONTACT_LINKS = [
  { label: "leandro@rbxsystems.ch", href: "mailto:leandro@rbxsystems.ch" },
  { label: "github.com/ldamasio",      href: "https://github.com/ldamasio" },
  { label: "linkedin.com/in/ldamasio", href: "https://www.linkedin.com/in/ldamasio/" },
];

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang);
  return {
    title: `Contact · ${t.meta.title}`,
    description: "Available for selected engagements.",
  };
}

export default function ContactPage({
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
        eyebrow={ui.contact}
        heading={ui.available}
        className="mb-10"
        style={{ maxWidth: "var(--prose-width)" }}
      />

      <div style={{ maxWidth: "var(--prose-width)" }}>
        {CONTACT_LINKS.map(({ label, href }) => (
          <p key={href} className="mb-4">
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
    </div>
  );
}
