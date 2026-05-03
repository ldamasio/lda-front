import type { StatusPillProps } from "@/components/ui/status-pill"

export type WorkKind = "professional" | "personal"

export interface WorkMetric {
  label: string
  value: string
}

export interface WorkItem {
  slug: string
  kind: WorkKind
  client: string
  role: string
  years: string
  description: string
  stack: string[]
  status: StatusPillProps["status"]
  metrics?: WorkMetric[]
  repo?: string
}

export const WORK: WorkItem[] = [
  /* ── Professional ────────────────────────────────────────── */
  {
    slug: "enforce",
    kind: "professional",
    client: "Enforce · BTG Pactual Group",
    role: "AI Engineer",
    years: "2025–present",
    description:
      "Built Forja, an internal LLM governance platform with RAG pipelines, vector databases, and prompt versioning. Reduced time to test AI workflows from days to hours. Built Prompt-Maker for centralized prompt governance across multiple systems. Structured Kubernetes (k3s) + ArgoCD + GitOps environment for AI service isolation and monitoring.",
    stack: [
      "Python",
      "FastAPI",
      "Kubernetes",
      "ArgoCD",
      "pgvector",
      "ParadeDB",
      "LLMs",
      "embeddings",
      "CI/CD",
    ],
    status: "active",
    metrics: [
      { label: "Time to test AI workflows", value: "days → hours" },
      { label: "Uptime target",             value: "99.97%" },
      { label: "Vector search latency p99", value: "48ms" },
      { label: "Systems governed",          value: "4 internal" },
    ],
  },
  {
    slug: "arte-arena",
    kind: "professional",
    client: "Arte Arena",
    role: "Principal Software Engineer",
    years: "2024–2025",
    description:
      "Led modernization of legacy systems into a cloud-native SaaS platform. Migrated critical Laravel API to Go, achieving 42% faster deployment cycles and 39% lower compute costs. Architected event-driven workflows with Kubernetes, Istio, and ArgoCD. Developed AI-enhanced features using Generative AI APIs and FastMCP.",
    stack: [
      "Go",
      "Python",
      "FastAPI",
      "React",
      "Kubernetes",
      "Istio",
      "ArgoCD",
      "AWS",
    ],
    status: "shipped",
    metrics: [
      { label: "Deployment cycle",    value: "42% faster" },
      { label: "Compute cost",        value: "39% reduction" },
      { label: "Feature delivery",    value: "85% faster" },
      { label: "Infrastructure cost", value: "30% reduction" },
    ],
  },
  {
    slug: "stefanini-fapesp",
    kind: "professional",
    client: "Stefanini · FAPESP",
    role: "Senior Software Engineer",
    years: "2024–2025",
    description:
      "Revamped FAPESP Virtual Library search engine (Apache Solr): 37% faster query response through data indexing optimizations. Led global full-stack team delivering Laravel-based platform for academic research funding. Resolved critical bugs in Django systems, improving stability for 500k+ monthly users.",
    stack: ["Python", "Django", "Laravel", "Apache Solr", "PHP"],
    status: "shipped",
    metrics: [
      { label: "Search query response", value: "37% faster" },
      { label: "Monthly users",         value: "500k+" },
    ],
  },
  {
    slug: "rbx-systems",
    kind: "professional",
    client: "RBX Systems",
    role: "Founder",
    years: "2020–present",
    description:
      "AI-first infrastructure and tooling for regulated and high-reliability environments. Open-source monorepo covering AI agents, code agents, and system-level tooling. Architecture focus: long-term maintainability, observability, and minimal external dependencies.",
    stack: ["Rust", "TypeScript", "Python", "Go", "Bash"],
    status: "active",
  },
  {
    slug: "npl-brasil",
    kind: "professional",
    client: "NPL Brasil",
    role: "Software Engineer",
    years: "2019–2022",
    description:
      "Automated data pipelines with Node.js and AWS, cutting manual processing time by 50%. Integrated Google Cloud Document AI for automated document analysis. Developed and deployed smart contracts on Ethereum for cryptocurrency transaction integrity.",
    stack: ["Node.js", "AWS", "Google Cloud", "Ethereum", "Solidity"],
    status: "shipped",
    metrics: [
      { label: "Manual processing time", value: "50% reduction" },
    ],
  },
  {
    slug: "global-hitss",
    kind: "professional",
    client: "Global Hitss",
    role: "Software Engineer",
    years: "2017–2019",
    description:
      "Designed a scalable data lake with Hadoop and Spark enabling real-time analytics for enterprise clients. Reduced deployment cycles by 23% through CI/CD pipeline automation. Delivered full-stack applications with React and Nest.js for financial sector clients.",
    stack: ["React", "Nest.js", "Hadoop", "Spark", "ArgoCD", "Docker"],
    status: "shipped",
    metrics: [
      { label: "Deployment cycle", value: "23% reduction" },
    ],
  },

  /* ── Personal tools ──────────────────────────────────────── */
  {
    slug: "playlist-fs",
    kind: "personal",
    client: "RBX Systems",
    role: "playlist-fs",
    years: "2025–present",
    description:
      "Playlists as filesystem projections over a canonical music library. A local-first, file-based toolkit where playlists are symlinked filesystem views. No daemon, no cloud, no login. Just files, symlinks, and shell.",
    stack: ["Shell", "Bash", "Filesystem", "Symlinks"],
    status: "in-production",
    repo: "https://github.com/ldamasio/playlist-fs",
  },
  {
    slug: "xsh",
    kind: "personal",
    client: "RBX Systems",
    role: "x.sh — Governed Execution Runtime",
    years: "2024–present",
    description:
      "Local-first shell wrapper that turns real commands into durable, causal, machine-readable evidence. Creates a hard trust boundary between actual execution and AI interpretation. Output is structured JSON: timestamped, attributed, immutable.",
    stack: ["Bash", "Shell", "JSON"],
    status: "in-production",
    repo: "https://github.com/ldamasio/x.sh",
  },
  {
    slug: "wt",
    kind: "personal",
    client: "RBX Systems",
    role: "wt — Worktree Manager",
    years: "2024–present",
    description:
      "CLI tool for Git worktree management with environment profiles. Enables rapid switching between isolated development contexts, each with its own environment variables and configurations. Designed for multi-branch, multi-agent workflows.",
    stack: ["Bash", "Shell", "Git"],
    status: "shipped",
    repo: "https://github.com/ldamasio/wt",
  },
  {
    slug: "strategos",
    kind: "personal",
    client: "RBX Systems",
    role: "Strategos — Strategic Runtime",
    years: "2025–present",
    description:
      "Agentic runtime for long-horizon planning and multi-scenario analysis. Structured decision support with explicit assumption tracking, risk registers, and outcome attribution. Built for personal and organizational use in low-certainty environments.",
    stack: ["Python", "TypeScript", "LLMs"],
    status: "in-progress",
  },
]

export const PROFESSIONAL_WORK = WORK.filter((w) => w.kind === "professional")
export const PERSONAL_WORK     = WORK.filter((w) => w.kind === "personal")
