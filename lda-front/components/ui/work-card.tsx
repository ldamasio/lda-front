import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { StatusPill, type StatusPillProps } from "./status-pill"

export interface WorkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  client: string
  role: string
  years: string
  description: string
  stack: string[]
  status: StatusPillProps["status"]
  href?: string
}

function CardInner({
  client,
  role,
  years,
  description,
  stack,
  status,
  className,
  grouped = false,
}: Omit<WorkCardProps, "href"> & { grouped?: boolean }) {
  const hoverBg = grouped
    ? "group-hover:bg-surface-footer group-focus-visible:bg-surface-footer"
    : "hover:bg-surface-footer"
  const hoverBorder = grouped
    ? "group-hover:border-personal group-focus-visible:border-personal"
    : "hover:border-personal"

  return (
    <div
      className={cn(
        "w-full rounded-ds-md px-5 py-4",
        "bg-surface-card border border-surface-hairline shadow-ds-card",
        "transition-colors duration-[160ms]",
        hoverBg,
        hoverBorder,
        className
      )}
    >
      {/* Client */}
      <p
        className="mb-1 font-mono font-medium uppercase text-ink-label"
        style={{ fontSize: "10px", letterSpacing: "0.1em" }}
      >
        {client}
      </p>

      {/* Role + Status pill */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <p
          className="text-ink-primary leading-snug"
          style={{ fontSize: "15px", fontWeight: 400 }}
        >
          {role}
        </p>
        <StatusPill status={status} className="shrink-0 mt-0.5" />
      </div>

      {/* Years */}
      <p className="mb-3 font-mono text-ink-label" style={{ fontSize: "10px" }}>
        {years}
      </p>

      {/* Divider */}
      <div className="mb-3 h-px bg-surface-hairline" aria-hidden />

      {/* Description */}
      <p
        className="mb-4 text-ink-secondary"
        style={{ fontSize: "13px", lineHeight: 1.55 }}
      >
        {description}
      </p>

      {/* Stack */}
      <p
        className="font-mono text-ink-disabled uppercase tracking-[0.04em]"
        style={{ fontSize: "9px" }}
      >
        {stack.join(" · ")}
      </p>
    </div>
  )
}

const WorkCard = React.forwardRef<HTMLDivElement, WorkCardProps>(
  ({ href, className, ...rest }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          className="group block rounded-ds-md outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          <CardInner {...rest} className={className} grouped />
        </Link>
      )
    }

    return (
      <div ref={ref}>
        <CardInner {...rest} className={className} />
      </div>
    )
  }
)
WorkCard.displayName = "WorkCard"

export { WorkCard }
