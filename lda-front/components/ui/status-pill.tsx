import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusPillVariants = cva(
  [
    "inline-flex items-center gap-[5px]",
    "font-mono font-medium uppercase tracking-[0.04em]",
    "rounded-[999px] border px-[10px] py-[3px]",
    "whitespace-nowrap select-none",
  ].join(" "),
  {
    variants: {
      status: {
        shipped: [
          "text-[var(--status-ok)] border-[var(--status-ok)]",
          "bg-[rgba(127,183,126,0.08)]",
        ],
        active: [
          "text-[var(--status-info)] border-[var(--status-info)]",
          "bg-[rgba(122,147,176,0.08)]",
        ],
        "in-progress": [
          "text-[var(--status-warn)] border-[var(--status-warn)]",
          "bg-[rgba(217,181,90,0.08)]",
        ],
        deprecated: [
          "text-[var(--status-err)] border-[var(--status-err)]",
          "bg-[rgba(197,106,106,0.08)]",
        ],
        "in-production": [
          "text-[var(--text-secondary)] border-[var(--surface-divider)]",
          "bg-transparent",
        ],
        archived: [
          "text-[var(--text-disabled)] border-[var(--text-disabled)]",
          "bg-transparent opacity-60",
        ],
      },
    },
    defaultVariants: {
      status: "shipped",
    },
  }
)

const STATUS_LABELS: Record<string, string> = {
  shipped:       "SHIPPED",
  active:        "ACTIVE",
  "in-progress": "IN PROGRESS",
  deprecated:    "DEPRECATED",
  "in-production": "IN PRODUCTION",
  archived:      "ARCHIVED",
}

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  label?: string
}

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, status, label, ...props }, ref) => {
    const displayLabel = label ?? STATUS_LABELS[status ?? "shipped"]
    return (
      <span
        ref={ref}
        className={cn(statusPillVariants({ status }), className)}
        style={{ fontSize: "9px" }}
        {...props}
      >
        <span aria-hidden style={{ fontSize: "7px" }}>●</span>
        {displayLabel}
      </span>
    )
  }
)
StatusPill.displayName = "StatusPill"

export { StatusPill, statusPillVariants }
