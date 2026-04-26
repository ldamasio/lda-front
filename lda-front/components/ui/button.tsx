import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[6px] whitespace-nowrap rounded-ds-btn text-[13px] font-medium ring-offset-background transition-colors duration-[160ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:opacity-90",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-surface-divider bg-transparent text-ink-primary hover:bg-surface-card hover:border-personal",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent border border-transparent text-ink-secondary hover:bg-surface-card hover:border-surface-hairline hover:text-ink-primary",
        link: "text-ink-secondary underline-offset-4 hover:underline",
        /* DS-specific variants */
        brass:
          "bg-brass border border-brass text-surface-primary hover:bg-[#C8BA92] hover:border-[#C8BA92]",
        personal:
          "bg-transparent border border-personal text-personal hover:bg-[rgba(92,112,128,0.08)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-ds-btn px-[18px]",
        lg:      "h-10 rounded-ds-btn px-6",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 