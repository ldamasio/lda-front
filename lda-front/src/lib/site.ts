export type Locale = 'pt' | 'en';

export type LinkItem = {
  label: string;
  href: string;
};

export type SectionCard = {
  eyebrow: string;
  title: string;
  body: string;
};

export type WorkItem = {
  title: string;
  body: string;
  meta: string;
};

export type SiteCopy = {
  locale: Locale;
  htmlLang: string;
  nav: {
    work: string;
    practice: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    status: string;
    location: string;
    availability: string;
  };
  highlights: string[];
  sections: SectionCard[];
  work: WorkItem[];
  contactTitle: string;
  contactBody: string;
  links: LinkItem[];
  footer: string;
};

const COMMON_LINKS: LinkItem[] = [
  { label: 'Email', href: 'mailto:leandro@rbxsystems.ch' },
  { label: 'GitHub', href: 'https://github.com/ldamasio' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ldamasio/' },
];

const COPY: Record<Locale, SiteCopy> = {
  pt: {
    locale: 'pt',
    htmlLang: 'pt-BR',
    nav: {
      work: 'Trabalho',
      practice: 'Prática',
      contact: 'Contato',
    },
    hero: {
      eyebrow: '',
      title: 'Leandro Damasio',
      lead: 'Engenheiro de Computação. Sistemas de IA e interfaces para ambientes de alta confiabilidade.',
      body: 'Constrói produtos digitais, plataformas de automação e sistemas operacionais com rigor institucional. O foco é confiabilidade, observabilidade e clareza operacional.',
      status: 'Disponível para projetos selecionados',
      location: 'Brasil · São Paulo / Zürich',
      availability: 'PT-BR primeiro no domínio .rbx.ia.br. EN primeiro no .rbxsystems.ch.',
    },
    highlights: [
      'AI/LLM systems · agentic runtimes · prompt governance',
      'Distributed systems · cloud-native platforms · observability',
      'Kubernetes · k3s · ArgoCD · GitOps',
      'Rust · TypeScript · Python · Go',
    ],
    sections: [
      {
        eyebrow: 'Campo',
        title: 'Sistemas de produto e controle',
        body: 'Projetos com interface, infraestrutura e lógica de operação conectadas. O objetivo é reduzir incerteza sem perder velocidade de entrega.',
      },
      {
        eyebrow: 'Método',
        title: 'Pequenas superfícies, alta densidade',
        body: 'Layouts enxutos, tipografia forte, estados claros e dependências explícitas. Cada bloco existe para ser lido, operado ou auditado.',
      },
      {
        eyebrow: 'Atuação',
        title: 'Frontend, AI engineering e entrega',
        body: 'Da experiência do usuário ao runtime e à observabilidade. O trabalho cobre do ajuste fino da interface à disciplina de deployment.',
      },
    ],
    work: [
      {
        title: 'RBX Systems',
        body: 'Monorepo open-source de agentes de IA, agentes de código e ferramentas de nível de sistema.',
        meta: 'Open source · arquitetura · maintainability',
      },
      {
        title: 'Strategos',
        body: 'Runtime estratégico para análise multicenário, decisão e rastreabilidade de premissas.',
        meta: 'Decision support · situation room · governance',
      },
      {
        title: 'x.sh',
        body: 'Runtime de execução governada que transforma comandos reais em evidência causal durável.',
        meta: 'Shell runtime · evidence · boundary control',
      },
    ],
    contactTitle: 'Contato e presença pública',
    contactBody: 'Canais oficiais para colaboração, referência técnica e acompanhamento do trabalho público.',
    links: COMMON_LINKS,
    footer: 'Leandro Damasio · Sistemas digitais com rigor institucional.',
  },
  en: {
    locale: 'en',
    htmlLang: 'en',
    nav: {
      work: 'Work',
      practice: 'Practice',
      contact: 'Contact',
    },
    hero: {
      eyebrow: '',
      title: 'Leandro Damasio',
      lead: 'Computer Engineer. AI systems and interfaces for high-reliability environments.',
      body: 'Builds digital products, automation platforms and operational systems with institutional rigor. The emphasis is reliability, observability and operational clarity.',
      status: 'Available for selected engagements',
      location: 'Brazil · São Paulo / Zürich',
      availability: 'PT-BR leads on .rbx.ia.br. EN leads on .rbxsystems.ch.',
    },
    highlights: [
      'AI/LLM systems · agentic runtimes · prompt governance',
      'Distributed systems · cloud-native platforms · observability',
      'Kubernetes · k3s · ArgoCD · GitOps',
      'Rust · TypeScript · Python · Go',
    ],
    sections: [
      {
        eyebrow: 'Scope',
        title: 'Product systems and control',
        body: 'Interfaces, infrastructure and operating logic stay connected. The goal is lower uncertainty without losing delivery speed.',
      },
      {
        eyebrow: 'Method',
        title: 'Small surfaces, high density',
        body: 'Lean layouts, strong typography, clear states and explicit dependencies. Every block exists to be read, operated or audited.',
      },
      {
        eyebrow: 'Practice',
        title: 'Frontend, AI engineering and delivery',
        body: 'From user experience to runtime and observability. The work spans interface tuning through deployment discipline.',
      },
    ],
    work: [
      {
        title: 'RBX Systems',
        body: 'Open-source monorepo of AI agents, code agents and system-level tooling.',
        meta: 'Open source · architecture · maintainability',
      },
      {
        title: 'Strategos',
        body: 'Strategic runtime for multi-scenario analysis, decision support and assumption traceability.',
        meta: 'Decision support · situation room · governance',
      },
      {
        title: 'x.sh',
        body: 'Governed exec runtime that turns real commands into durable causal evidence.',
        meta: 'Shell runtime · evidence · boundary control',
      },
    ],
    contactTitle: 'Contact and public presence',
    contactBody: 'Official channels for collaboration, technical reference and public work tracking.',
    links: COMMON_LINKS,
    footer: 'Leandro Damasio · Digital systems with institutional rigor.',
  },
};

export function resolveLocale(hostname: string): Locale {
  return hostname.endsWith('.ch') ? 'en' : 'pt';
}

export function getCopy(locale: Locale): SiteCopy {
  return COPY[locale];
}
