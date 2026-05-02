import * as React from "react"
import { getUiText } from "../[lang]/ui-text"

export function SiteFooter({ lang }: { lang: string }) {
  const year = new Date().getFullYear()
  const ui = getUiText(lang)

  return (
    <footer
      className="w-full"
      style={{
        background: "var(--surface-footer)",
        borderTop: "1px solid var(--surface-hairline)",
      }}
    >
      <div
        className="flex items-center justify-between flex-wrap gap-3"
        style={{
          maxWidth: "var(--content-width)",
          margin: "0 auto",
          padding: "16px 32px",
        }}
      >
        {/* Brand mark */}
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "9px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            color: "var(--text-disabled)",
          }}
        >
          RBX Systems
        </p>

        {/* Legal */}
        <p
          style={{
            fontSize: "10px",
            color: "var(--text-disabled)",
          }}
        >
          &copy; {year} Leandro Damasio. {ui.allRightsReserved}
        </p>
      </div>
    </footer>
  )
}
