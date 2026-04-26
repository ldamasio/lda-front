import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* shadcn compatibility — HSL-based, required by Radix UI components */
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        /* DS Surface tokens */
        surface: {
          page:     "var(--surface-page)",
          primary:  "var(--surface-primary)",
          raised:   "var(--surface-raised)",
          card:     "var(--surface-card)",
          footer:   "var(--surface-footer)",
          hairline: "var(--surface-hairline)",
          divider:  "var(--surface-divider)",
        },

        /* DS Text tokens — 'ink' namespace avoids 'text-text-*' collision */
        ink: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          label:     "var(--text-label)",
          disabled:  "var(--text-disabled)",
        },

        /* DS Accent tokens */
        brass:    "var(--accent-brass)",
        personal: "var(--accent-personal)",

        /* DS Status tokens */
        status: {
          ok:   "var(--status-ok)",
          info: "var(--status-info)",
          warn: "var(--status-warn)",
          err:  "var(--status-err)",
        },
      },

      borderRadius: {
        /* shadcn compatibility */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        /* DS radius tokens */
        "ds-xs":   "var(--radius-xs)",
        "ds-sm":   "var(--radius-sm)",
        "ds-btn":  "var(--radius-btn)",
        "ds-md":   "var(--radius-md)",
        "ds-pill": "var(--radius-pill)",
      },

      fontSize: {
        "ds-xs":      [
          "var(--text-xs)",
          { lineHeight: "var(--lh-normal)", letterSpacing: "0em" },
        ],
        "ds-sm":      [
          "var(--text-sm)",
          { lineHeight: "var(--lh-normal)", letterSpacing: "0em" },
        ],
        "ds-base":    [
          "var(--text-base)",
          { lineHeight: "var(--lh-relaxed)", letterSpacing: "0em" },
        ],
        "ds-lg":      [
          "var(--text-lg)",
          { lineHeight: "var(--lh-relaxed)", letterSpacing: "0em" },
        ],
        "ds-2xl":     [
          "var(--text-2xl)",
          { lineHeight: "var(--lh-snug)", letterSpacing: "-0.02em" },
        ],
        "ds-3xl":     [
          "var(--text-3xl)",
          { lineHeight: "var(--lh-snug)", letterSpacing: "-0.02em" },
        ],
        "ds-4xl":     [
          "var(--text-4xl)",
          { lineHeight: "var(--lh-tight)", letterSpacing: "-0.02em" },
        ],
        "ds-display": [
          "var(--text-display)",
          { lineHeight: "var(--lh-tight)", letterSpacing: "-0.02em" },
        ],
      },

      maxWidth: {
        prose:   "var(--prose-width)",
        content: "var(--content-width)",
        nav:     "var(--nav-width)",
      },

      boxShadow: {
        "ds-card": "var(--shadow-card)",
        "ds-nav":  "var(--shadow-nav)",
      },

      transitionTimingFunction: {
        "ds-out": "var(--ease-out)",
      },

      transitionDuration: {
        "ds-enter": "var(--duration-enter)",
        "ds-hover": "var(--duration-hover)",
      },

      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
