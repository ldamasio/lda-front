import * as React from "react"
import { cn } from "@/lib/utils"

interface EyebrowSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow: string
  heading: string
  subheading?: string
}

const EyebrowSection = React.forwardRef<HTMLDivElement, EyebrowSectionProps>(
  ({ eyebrow, heading, subheading, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div
          className="mb-6 pt-5"
          style={{ borderTop: "1px solid var(--surface-hairline)" }}
        >
          <p className="t-eyebrow mb-2">{eyebrow}</p>
          <h2 className="t-h2" style={{ color: "var(--text-primary)" }}>
            {heading}
          </h2>
          {subheading && (
            <p
              className="t-mono mt-1"
              style={{ color: "var(--text-label)" }}
            >
              {subheading}
            </p>
          )}
        </div>
        {children}
      </div>
    )
  }
)
EyebrowSection.displayName = "EyebrowSection"

export { EyebrowSection }
