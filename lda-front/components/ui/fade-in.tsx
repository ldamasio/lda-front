"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "var(--duration-enter)",
        transitionTimingFunction: "var(--ease-out)",
        transitionDelay: delay ? `${delay}ms` : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  )
}
