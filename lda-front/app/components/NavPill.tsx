"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
  { code: "es", label: "ES" },
  { code: "zh", label: "ZH" },
]

const NAV_ITEMS = [
  { label: "Work",    anchor: "#work"    },
  { label: "Notes",   path: "/notes"     },
  { label: "Contact", anchor: "#contact" },
]

interface NavPillProps {
  lang: string
}

export function NavPill({ lang }: NavPillProps) {
  const pathname = usePathname()
  const homePath = `/${lang}`

  const hrefFor = (item: (typeof NAV_ITEMS)[number]) => {
    if ("anchor" in item) return `${homePath}/${item.anchor}`
    return `${homePath}${item.path}`
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if ("anchor" in item) return pathname === homePath || pathname === `${homePath}/`
    return pathname.startsWith(`${homePath}${item.path}`)
  }

  const localePath = (code: string) => {
    const rest = pathname.slice(lang.length + 1)
    return `/${code}${rest || ""}`
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center px-[10px] py-[6px]"
        aria-label="Main navigation"
        style={{
          background: "rgba(15,16,18,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(38,39,44,0.6)",
          borderRadius: "var(--radius-pill)",
          boxShadow: "var(--shadow-nav)",
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <Divider />}
            <Link
              href={hrefFor(item)}
              className={cn(
                "px-[14px] py-[5px] rounded-[var(--radius-pill)]",
                "text-[13px] font-medium",
                "transition-colors duration-[160ms]",
                "outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-brass)]",
                isActive(item)
                  ? "bg-[var(--surface-footer)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.label}
            </Link>
          </React.Fragment>
        ))}

        <Divider />

        {/* Locale toggle — CSS-only via focus-within */}
        <div className="group/locale relative">
          <button
            className={cn(
              "px-[10px] py-[5px] cursor-default select-none",
              "font-mono text-[10px] font-medium uppercase tracking-[0.04em]",
              "text-[var(--text-label)] hover:text-[var(--text-secondary)]",
              "outline-none transition-colors duration-[160ms]",
            )}
            aria-haspopup="listbox"
            aria-label="Language selector"
          >
            {lang.toUpperCase()}
          </button>

          <div
            className={cn(
              "absolute top-[calc(100%+8px)] right-0 py-1 min-w-[68px]",
              "invisible opacity-0 group-focus-within/locale:visible group-focus-within/locale:opacity-100",
              "transition-opacity duration-[160ms]",
            )}
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--surface-hairline)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-nav)",
            }}
            role="listbox"
          >
            {LANGUAGES.map((l) => (
              <Link
                key={l.code}
                href={localePath(l.code)}
                role="option"
                aria-selected={l.code === lang}
                className={cn(
                  "block w-full px-3 py-1.5",
                  "font-mono text-[10px] font-medium uppercase tracking-[0.04em]",
                  "transition-colors duration-[160ms]",
                  "outline-none focus-visible:bg-[var(--surface-card)]",
                  l.code === lang
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-label)] hover:text-[var(--text-secondary)]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

function Divider() {
  return (
    <span
      className="shrink-0 mx-1"
      aria-hidden
      style={{
        display: "inline-block",
        width: "1px",
        height: "16px",
        background: "var(--surface-hairline)",
      }}
    />
  )
}
