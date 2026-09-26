import { readContaboObject } from '$lib/s3';
import { resolveLocale as resolveRouteLocale, type Locale } from './locale';

export type WorkStatus = 'active' | 'shipped' | 'production' | 'in-progress';

export type WorkItem = {
  client: string;
  role: string;
  years: string;
  tech: string;
  line: string;
  status: WorkStatus;
  statusLabel: string;
  href?: string;
};

export type PublicationItem = {
  meta: string;
  title: string;
  href: string;
  year: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type HomeCopy = {
  locale: Locale;
  htmlLang: string;
  nav: {
    work: string;
    writing: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string[];
    location: string;
    status: string;
  };
  team: {
    eyebrow: string;
    title: string;
    body: string;
  };
  work: {
    eyebrow: string;
    title: string;
    selectedProjects: string;
    selectedWork: string;
    professional: WorkItem[];
    personalTitle: string;
    personal: WorkItem[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    lines: string[];
  };
  writing: {
    eyebrow: string;
    title: string;
  };
  publications: {
    eyebrow: string;
    title: string;
    items: PublicationItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
    links: LinkItem[];
    form: {
      name: string;
      email: string;
      phone: string;
      message: string;
      whatsappOptIn: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      messagePlaceholder: string;
    };
  };
  ui: {
    home: string;
    notes: string;
    back: string;
    switchLocale: string;
    readArticle: string;
    viewFullArchive: string;
    sendAnother: string;
    altchaIdle: string;
    altchaLoading: string;
    altchaVerified: string;
    altchaError: string;
    altchaPrompt: string;
    altchaAria: string;
    allRightsReserved: string;
  };
  footer: string;
};

const COMMON_LINKS: LinkItem[] = [
  { label: 'leandro@rbxsystems.ch', href: 'mailto:leandro@rbxsystems.ch' },
  { label: 'github.com/ldamasio', href: 'https://github.com/ldamasio' },
  { label: 'linkedin.com/in/ldamasio', href: 'https://www.linkedin.com/in/ldamasio/' },
  { label: 'ORCID 0009-0009-1690-6783', href: 'https://orcid.org/0009-0009-1690-6783' },
];

const HOME_BUNDLE_KEY = 'translations-home';
const LEGACY_TRANSLATION_BUNDLE_KEY = 'translations-legacy';
const HOME_BUNDLE_TTL_MS = 5 * 60 * 1000;
const LEGACY_BUNDLE_TTL_MS = 15 * 60 * 1000;

type CachedCopy = {
  loadedAt: number;
  copy: HomeCopy;
};

type LegacyTranslationArchive = {
  sourceCommit: string;
  locales: Record<string, unknown>;
};

type CachedLegacyCopy = {
  loadedAt: number;
  archive: LegacyTranslationArchive;
};

const HOME_COPY_CACHE = new Map<Locale, CachedCopy>();
const LEGACY_COPY_CACHE = new Map<Locale, CachedLegacyCopy>();

function homeBundleKey(locale: Locale): string {
  return `site/${locale}/${HOME_BUNDLE_KEY}/index.md`;
}

function legacyBundleKey(locale: Locale): string {
  return `site/${locale}/${LEGACY_TRANSLATION_BUNDLE_KEY}/index.md`;
}

function stripFrontmatter(raw: string): string {
  const normalized = raw.replace(/\r?\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return normalized;
  }

  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) {
    return normalized;
  }

  return normalized.slice(end + 5);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base;
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = (base as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      result[key] = value;
      continue;
    }

    if (isPlainObject(current) && isPlainObject(value)) {
      result[key] = mergeDeep(current, value);
      continue;
    }

    result[key] = value;
  }

  return result as T;
}

async function readRemoteHomeCopy(locale: Locale): Promise<HomeCopy | null> {
  try {
    const bodyText = await readContaboObject(homeBundleKey(locale));
    if (!bodyText) {
      return null;
    }

    const body = stripFrontmatter(bodyText).trim();
    if (!body) {
      return null;
    }

    return JSON.parse(body) as HomeCopy;
  } catch {
    return null;
  }
}

async function loadHomeCopy(locale: Locale): Promise<HomeCopy> {
  const cached = HOME_COPY_CACHE.get(locale);
  if (cached && Date.now() - cached.loadedAt < HOME_BUNDLE_TTL_MS) {
    return cached.copy;
  }

  const remote = await readRemoteHomeCopy(locale);
  const base = COPY[locale] ?? EN;
  if (!remote) {
    // Bundle not published yet: fall back to the local literal so the page
    // renders in the requested locale instead of erroring.
    return { ...base, locale, htmlLang: locale };
  }

  const copy: HomeCopy = { ...mergeDeep(base, remote), locale, htmlLang: locale };
  HOME_COPY_CACHE.set(locale, { loadedAt: Date.now(), copy });
  return copy;
}

async function readRemoteLegacyArchive(locale: Locale): Promise<LegacyTranslationArchive | null> {
  try {
    const bodyText = await readContaboObject(legacyBundleKey(locale));
    if (!bodyText) {
      return null;
    }

    const body = stripFrontmatter(bodyText).trim();
    if (!body) {
      return null;
    }

    return JSON.parse(body) as LegacyTranslationArchive;
  } catch {
    return null;
  }
}

async function loadLegacyArchive(locale: Locale): Promise<LegacyTranslationArchive | null> {
  const cached = LEGACY_COPY_CACHE.get(locale);
  if (cached && Date.now() - cached.loadedAt < LEGACY_BUNDLE_TTL_MS) {
    return cached.archive;
  }

  const archive = await readRemoteLegacyArchive(locale);
  if (!archive) {
    return null;
  }

  LEGACY_COPY_CACHE.set(locale, { loadedAt: Date.now(), archive });
  return archive;
}

const EN: HomeCopy = {
  locale: 'en',
  htmlLang: 'en',
  nav: {
    work: 'Work',
    writing: 'Notes',
    contact: 'Contact',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: 'AI Engineer. AI systems for finance and high-reliability environments.',
    body: [
      'AI Engineer at Enforce (BTG Pactual Group), based in São Paulo. Builds production-grade AI systems for financial and legal domains where reliability, observability, and governance are not optional.',
      'Undergraduate student in Computer Engineering at Universidade Virtual do Estado de São Paulo (UNIVESP), with graduation expected in 2027.',
      'Work spans AI, software architecture, and infrastructure: agentic architectures, runtime control loops, evaluation and monitoring pipelines for LLM-based systems. Hands-on with vector search using pgvector and ParadeDB, prompt governance, and secure integration with internal and external data sources.',
      'Founder and maintainer of RBX Systems, an open-source monorepo of AI agents, code agents, and system-level tooling focused on architecture and long-term maintainability.',
    ],
    location: 'São Paulo',
    status: 'Available for selected engagements.',
  },
  team: {
    eyebrow: 'Team',
    title: 'Collaboration and multidisciplinary work',
    body: 'On a personal level, I am a strong problem solver with a passion for innovation. I thrive in collaborative environments and enjoy working with multidisciplinary teams. I am highly organized and able to prioritize tasks to deliver high-quality results on time.',
  },
  work: {
    eyebrow: 'Selected Projects',
    title: 'Work, 2018–2026',
    selectedProjects: 'Selected Projects',
    selectedWork: 'Selected work',
    professional: [
      {
        client: 'Enforce / BTG Pactual Group',
        role: 'AI Engineer',
        years: '2025–present',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: 'Production-grade AI systems for financial and legal domains. RAG pipelines, prompt governance, agentic architectures.',
        status: 'active',
        statusLabel: 'Active',
      },
      {
        client: 'RBX Systems',
        role: 'Founder',
        years: '2020–present',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'AI agents, trading systems, decision infrastructure, and internal developer platform.',
        status: 'active',
        statusLabel: 'Active',
      },
      {
        client: 'Arte Arena',
        role: 'Principal Software Engineer',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: 'Modernized legacy Laravel platform to cloud-native SaaS. 42% faster deploys, 39% compute cost reduction.',
        status: 'shipped',
        statusLabel: 'Shipped',
      },
      {
        client: 'Stefanini / FAPESP',
        role: 'Senior Software Engineer',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'Search engine overhaul for FAPESP Virtual Library. 37% query response improvement.',
        status: 'shipped',
        statusLabel: 'Shipped',
      },
      {
        client: 'Tier-1 Brazilian financial group',
        role: 'Software Engineer',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: 'Automated data pipelines and smart contract infrastructure for distressed credit operations.',
        status: 'shipped',
        statusLabel: 'Shipped',
      },
      {
        client: 'Global Hitss',
        role: 'Software Engineer',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: 'Scalable data lake and full-stack delivery for enterprise financial sector clients.',
        status: 'shipped',
        statusLabel: 'Shipped',
      },
    ],
    personalTitle: 'Personal tools',
    personal: [
      {
        client: 'Robson',
        role: 'Author',
        years: '2019–present',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: 'Execution and risk management engine for crypto futures at fixed 1x leverage. The operator decides the entry; Robson governs the exit.',
        status: 'production',
        statusLabel: 'In production',
      },
      {
        client: 'x.sh',
        role: 'Author',
        years: '2023–present',
        tech: 'Bash · JSON',
        line: 'Governed execution runtime: turns shell commands into durable, machine-readable traces for LLMs.',
        status: 'active',
        statusLabel: 'Active',
      },
      {
        client: 'wt',
        role: 'Author',
        years: '2023–present',
        tech: 'Bash · Git',
        line: 'CLI for Git worktree management with environment profiles. Rapid context switching.',
        status: 'active',
        statusLabel: 'Active',
      },
      {
        client: 'Strategos',
        role: 'Author',
        years: '2022–present',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: 'Situation room interface for human-AI strategic deliberation and governed decision review.',
        status: 'active',
        statusLabel: 'Active',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Capabilities',
    title: 'Technical expertise',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: 'Writing',
    title: 'Notes',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: 'Publications',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: "Master's dissertation · FGV EAESP",
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Available for selected engagements.',
    body: '',
    note: 'Contact can be routed through the RBX comms form below.',
    links: COMMON_LINKS,
    form: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      whatsappOptIn: 'Allow contact by WhatsApp when relevant',
      submit: 'Send',
      submitting: 'Sending…',
      success: 'Message sent.',
      error: 'Submission failed. Try again.',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@example.com',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: 'What do you need?',
    },
  },
  ui: {
    home: 'Home',
    notes: 'Notes',
    back: 'Back',
    switchLocale: 'Language',
    readArticle: 'Read article',
    viewFullArchive: 'View full archive',
    sendAnother: 'Send another',
    altchaIdle: 'Verify anti-abuse challenge',
    altchaLoading: 'Loading challenge…',
    altchaVerified: 'Verified',
    altchaError: 'Challenge failed',
    altchaPrompt: 'Anti-abuse challenge required before sending.',
    altchaAria: 'Verify anti-abuse challenge',
    allRightsReserved: 'All rights reserved.',
  },
  footer: '© 2026 Leandro Damasio. All rights reserved.',
};

const PT: HomeCopy = {
  locale: 'pt-BR',
  htmlLang: 'pt-BR',
  nav: {
    work: 'Trabalho',
    writing: 'Notas',
    contact: 'Contato',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: 'Engenheiro de IA. Sistemas de IA para finanças e ambientes de alta confiabilidade.',
    body: [
      'Engenheiro de IA na Enforce (Grupo BTG Pactual), baseado em São Paulo. Constrói sistemas de IA prontos para produção para os domínios financeiro e jurídico onde confiabilidade, observabilidade e governança são requisitos de base.',
      'Cursa Engenharia de Computação na Universidade Virtual do Estado de São Paulo (UNIVESP), com conclusão prevista para 2027.',
      'Trabalho abrange IA, arquitetura de software e infraestrutura: arquiteturas de agentes, loops de controle de runtime, pipelines de avaliação e monitoramento para sistemas baseados em LLM. Experiência prática com busca vetorial usando pgvector e ParadeDB, governança de prompts e integração segura com fontes de dados internas e externas.',
      'Fundador e mantenedor da RBX Systems, monorepo open-source de agentes de IA, agentes de código e ferramentas de nível de sistema com foco em arquitetura e manutenibilidade de longo prazo.',
    ],
    location: 'São Paulo',
    status: 'Disponível para projetos selecionados.',
  },
  team: {
    eyebrow: 'Equipe',
    title: 'Colaboração e trabalho multidisciplinar',
    body: 'Em um nível pessoal, sou um forte solucionador de problemas com paixão por inovação. Eu prospero em ambientes colaborativos e gosto de trabalhar com equipes multidisciplinares. Sou altamente organizado e capaz de priorizar tarefas para entregar resultados de alta qualidade a tempo.',
  },
  work: {
    eyebrow: 'Projetos selecionados',
    title: 'Trabalho, 2018–2026',
    selectedProjects: 'Projetos selecionados',
    selectedWork: 'Trabalhos selecionados',
    professional: [
      {
        client: 'Enforce / BTG Pactual Group',
        role: 'Engenheiro de IA',
        years: '2025–presente',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: 'Sistemas de IA prontos para produção para domínios financeiros e jurídicos. Pipelines RAG, governança de prompts e arquiteturas agênticas.',
        status: 'active',
        statusLabel: 'Ativo',
      },
      {
        client: 'RBX Systems',
        role: 'Fundador',
        years: '2020–presente',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'Agentes de IA, sistemas de negociação, infraestrutura de decisão e plataforma interna para desenvolvedores.',
        status: 'active',
        statusLabel: 'Ativo',
      },
      {
        client: 'Arte Arena',
        role: 'Engenheiro de Software Principal',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: 'Modernização de plataforma Laravel legada para SaaS cloud-native. Deploys 42% mais rápidos, 39% menos custo de computação.',
        status: 'shipped',
        statusLabel: 'Entregue',
      },
      {
        client: 'Stefanini / FAPESP',
        role: 'Engenheiro de Software Sênior',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'Reformulação do mecanismo de busca da Biblioteca Virtual da FAPESP. 37% de melhoria na resposta das consultas.',
        status: 'shipped',
        statusLabel: 'Entregue',
      },
      {
        client: 'Grupo financeiro brasileiro de primeira linha',
        role: 'Engenheiro de Software',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: 'Automação de pipelines de dados e infraestrutura de smart contracts para operações de crédito distressed.',
        status: 'shipped',
        statusLabel: 'Entregue',
      },
      {
        client: 'Global Hitss',
        role: 'Engenheiro de Software',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: 'Data lake escalável e entrega full-stack para clientes do setor financeiro.',
        status: 'shipped',
        statusLabel: 'Entregue',
      },
    ],
    personalTitle: 'Ferramentas pessoais',
    personal: [
      {
        client: 'Robson',
        role: 'Autor',
        years: '2019–presente',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: 'Motor de execução e gestão de risco para futuros de cripto com alavancagem fixa 1x. O operador decide a entrada; o Robson governa a saída.',
        status: 'production',
        statusLabel: 'Em produção',
      },
      {
        client: 'x.sh',
        role: 'Autor',
        years: '2023–presente',
        tech: 'Bash · JSON',
        line: 'Runtime de execução governada: transforma comandos de shell em rastros duráveis e legíveis por máquina para LLMs.',
        status: 'active',
        statusLabel: 'Ativo',
      },
      {
        client: 'wt',
        role: 'Autor',
        years: '2023–presente',
        tech: 'Bash · Git',
        line: 'CLI para gerenciamento de worktrees Git com perfis de ambiente. Mudança rápida de contexto.',
        status: 'active',
        statusLabel: 'Ativo',
      },
      {
        client: 'Strategos',
        role: 'Autor',
        years: '2022–presente',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: 'Interface de sala de situação para deliberação estratégica humano-IA e revisão governada de decisões.',
        status: 'active',
        statusLabel: 'Ativo',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Capacidades',
    title: 'Especialidade técnica',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: 'Escrita',
    title: 'Notas',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: 'Publicações',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: 'Dissertação de mestrado · FGV EAESP',
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: 'Contato',
    title: 'Disponível para projetos selecionados.',
    body: '',
    note: 'O contato pode seguir pelo formulário RBX abaixo.',
    links: COMMON_LINKS,
    form: {
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      message: 'Mensagem',
      whatsappOptIn: 'Permitir contato via WhatsApp quando relevante',
      submit: 'Enviar',
      submitting: 'Enviando…',
      success: 'Mensagem enviada.',
      error: 'Falha no envio. Tente novamente.',
      namePlaceholder: 'Seu nome',
      emailPlaceholder: 'voce@exemplo.com',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: 'O que você precisa?',
    },
  },
  ui: {
    home: 'Início',
    notes: 'Notas',
    back: 'Voltar',
    switchLocale: 'Idioma',
    readArticle: 'Ler artigo',
    viewFullArchive: 'Ver arquivo completo',
    sendAnother: 'Enviar outra',
    altchaIdle: 'Verificar proteção antiabuso',
    altchaLoading: 'Carregando verificação…',
    altchaVerified: 'Verificado',
    altchaError: 'Falha na verificação',
    altchaPrompt: 'Verificação antiabuso obrigatória antes do envio.',
    altchaAria: 'Verificar proteção antiabuso',
    allRightsReserved: 'Todos os direitos reservados.',
  },
  footer: '© 2026 Leandro Damasio. Todos os direitos reservados.',
};

const DE: HomeCopy = {
  locale: 'de',
  htmlLang: 'de',
  nav: {
    work: 'Arbeiten',
    writing: 'Notizen',
    contact: 'Kontakt',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: 'KI-Ingenieur. KI-Systeme für Finanzen und Umgebungen mit hohen Zuverlässigkeitsanforderungen.',
    body: [
      'KI-Ingenieur bei Enforce (BTG Pactual Group), mit Standort in São Paulo. Entwickelt produktionsreife KI-Systeme für Finanz- und Rechtsdomänen, in denen Zuverlässigkeit, Observability und Governance keine optionalen Extras sind.',
      'Er studiert Computer Engineering an der Universidade Virtual do Estado de São Paulo (UNIVESP); der Abschluss ist für 2027 vorgesehen.',
      'Das Arbeitsfeld umfasst KI, Softwarearchitektur und Infrastruktur: agentische Architekturen, Runtime-Kontrollschleifen sowie Evaluierungs- und Monitoring-Pipelines für LLM-basierte Systeme. Praxiserfahrung mit Vektorsuche mittels pgvector und ParadeDB, Prompt-Governance und sicherer Integration interner wie externer Datenquellen.',
      'Gründer und Maintainer von RBX Systems, einem Open-Source-Monorepo mit KI-Agenten, Code-Agenten und System-Tooling mit Fokus auf Architektur und langfristige Wartbarkeit.',
    ],
    location: 'São Paulo',
    status: 'Verfügbar für ausgewählte Projekte.',
  },
  team: {
    eyebrow: 'Team',
    title: 'Zusammenarbeit und interdisziplinäre Arbeit',
    body: 'Persönlich bin ich ein starker Problemlöser mit einer Leidenschaft für Innovation. Ich gedeihe in kollaborativen Umgebungen und arbeite gerne mit interdisziplinären Teams. Ich bin hochgradig organisiert und kann Aufgaben priorisieren, um rechtzeitig Ergebnisse hoher Qualität zu liefern.',
  },
  work: {
    eyebrow: 'Ausgewählte Projekte',
    title: 'Arbeiten, 2018–2026',
    selectedProjects: 'Ausgewählte Projekte',
    selectedWork: 'Ausgewählte Arbeiten',
    professional: [
      {
        client: 'Enforce / BTG Pactual Group',
        role: 'KI-Ingenieur',
        years: '2025–heute',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: 'Produktionsreife KI-Systeme für Finanz- und Rechtsdomänen. RAG-Pipelines, Prompt-Governance und agentische Architekturen.',
        status: 'active',
        statusLabel: 'Aktiv',
      },
      {
        client: 'RBX Systems',
        role: 'Gründer',
        years: '2020–heute',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'KI-Agenten, Handelssysteme, Entscheidungsinfrastruktur und interne Entwicklerplattform.',
        status: 'active',
        statusLabel: 'Aktiv',
      },
      {
        client: 'Arte Arena',
        role: 'Principal Software Engineer',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: 'Modernisierung einer Legacy-Laravel-Plattform zu cloud-nativem SaaS. 42 % schnellere Deploys, 39 % geringere Compute-Kosten.',
        status: 'shipped',
        statusLabel: 'Ausgeliefert',
      },
      {
        client: 'Stefanini / FAPESP',
        role: 'Senior Software Engineer',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'Überarbeitung der Suchmaschine der FAPESP-Virtuellen Bibliothek. 37 % schnellere Abfrageantworten.',
        status: 'shipped',
        statusLabel: 'Ausgeliefert',
      },
      {
        client: 'Brasilianische Tier-1-Finanzgruppe',
        role: 'Software Engineer',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: 'Automatisierte Datenpipelines und Smart-Contract-Infrastruktur für Distressed-Credit-Operationen.',
        status: 'shipped',
        statusLabel: 'Ausgeliefert',
      },
      {
        client: 'Global Hitss',
        role: 'Software Engineer',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: 'Skalierbares Data Lake und Full-Stack-Lieferung für Kunden des Finanzsektors.',
        status: 'shipped',
        statusLabel: 'Ausgeliefert',
      },
    ],
    personalTitle: 'Persönliche Tools',
    personal: [
      {
        client: 'Robson',
        role: 'Autor',
        years: '2019–heute',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: 'Ausführungs- und Risikomanagement-Engine für Krypto-Futures mit fixem 1x-Hebel. Der Operator entscheidet den Einstieg; Robson steuert den Ausstieg.',
        status: 'production',
        statusLabel: 'In Produktion',
      },
      {
        client: 'x.sh',
        role: 'Autor',
        years: '2023–heute',
        tech: 'Bash · JSON',
        line: 'Runtime für gouvernierte Ausführung: verwandelt Shell-Befehle in dauerhafte, maschinenlesbare Traces für LLMs.',
        status: 'active',
        statusLabel: 'Aktiv',
      },
      {
        client: 'wt',
        role: 'Autor',
        years: '2023–heute',
        tech: 'Bash · Git',
        line: 'CLI für die Verwaltung von Git-Worktrees mit Umgebungsprofilen. Schneller Kontextwechsel.',
        status: 'active',
        statusLabel: 'Aktiv',
      },
      {
        client: 'Strategos',
        role: 'Autor',
        years: '2022–heute',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: 'Situationsraum-Oberfläche für strategische Mensch-KI-Deliberation und gouvernierte Entscheidungsprüfung.',
        status: 'active',
        statusLabel: 'Aktiv',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Fähigkeiten',
    title: 'Technische Expertise',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: 'Schreiben',
    title: 'Notizen',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: 'Publikationen',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: 'Masterarbeit · FGV EAESP',
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Verfügbar für ausgewählte Projekte.',
    body: '',
    note: 'Die Kontaktaufnahme kann über das RBX-Formular unten erfolgen.',
    links: COMMON_LINKS,
    form: {
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      message: 'Nachricht',
      whatsappOptIn: 'Kontakt per WhatsApp erlauben, wenn relevant',
      submit: 'Senden',
      submitting: 'Wird gesendet…',
      success: 'Nachricht gesendet.',
      error: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
      namePlaceholder: 'Ihr Name',
      emailPlaceholder: 'sie@beispiel.de',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: 'Was brauchen Sie?',
    },
  },
  ui: {
    home: 'Start',
    notes: 'Notizen',
    back: 'Zurück',
    switchLocale: 'Sprache',
    readArticle: 'Artikel lesen',
    viewFullArchive: 'Vollständiges Archiv ansehen',
    sendAnother: 'Weitere Nachricht senden',
    altchaIdle: 'Anti-Missbrauch-Challenge überprüfen',
    altchaLoading: 'Challenge wird geladen…',
    altchaVerified: 'Verifiziert',
    altchaError: 'Challenge fehlgeschlagen',
    altchaPrompt: 'Vor dem Senden ist die Anti-Missbrauch-Verifizierung erforderlich.',
    altchaAria: 'Anti-Missbrauch-Challenge überprüfen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
  },
  footer: '© 2026 Leandro Damasio. Alle Rechte vorbehalten.',
};

const ES: HomeCopy = {
  locale: 'es',
  htmlLang: 'es',
  nav: {
    work: 'Trabajo',
    writing: 'Notas',
    contact: 'Contacto',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: 'Ingeniero de IA. Sistemas de IA para finanzas y entornos de alta confiabilidad.',
    body: [
      'Ingeniero de IA en Enforce (Grupo BTG Pactual), con base en São Paulo. Construye sistemas de IA listos para producción para los dominios financiero y jurídico, donde la confiabilidad, la observabilidad y la gobernanza no son opcionales.',
      'Cursa Ingeniería de Computación en la Universidade Virtual do Estado de São Paulo (UNIVESP), con graduación prevista para 2027.',
      'Su trabajo abarca IA, arquitectura de software e infraestructura: arquitecturas de agentes, bucles de control de runtime y pipelines de evaluación y monitoreo para sistemas basados en LLM. Experiencia práctica con búsqueda vectorial usando pgvector y ParadeDB, gobernanza de prompts e integración segura con fuentes de datos internas y externas.',
      'Fundador y mantenedor de RBX Systems, un monorepo open-source de agentes de IA, agentes de código y herramientas a nivel de sistema enfocadas en arquitectura y mantenibilidad a largo plazo.',
    ],
    location: 'São Paulo',
    status: 'Disponible para proyectos seleccionados.',
  },
  team: {
    eyebrow: 'Equipo',
    title: 'Colaboración y trabajo multidisciplinario',
    body: 'A nivel personal, soy un fuerte solucionador de problemas con pasión por la innovación. Prospero en entornos colaborativos y disfruto trabajar con equipos multidisciplinarios. Soy altamente organizado y capaz de priorizar tareas para entregar resultados de alta calidad a tiempo.',
  },
  work: {
    eyebrow: 'Proyectos seleccionados',
    title: 'Trabajo, 2018–2026',
    selectedProjects: 'Proyectos seleccionados',
    selectedWork: 'Trabajos seleccionados',
    professional: [
      {
        client: 'Enforce / BTG Pactual Group',
        role: 'Ingeniero de IA',
        years: '2025–presente',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: 'Sistemas de IA listos para producción para dominios financieros y jurídicos. Pipelines RAG, gobernanza de prompts y arquitecturas de agentes.',
        status: 'active',
        statusLabel: 'Activo',
      },
      {
        client: 'RBX Systems',
        role: 'Fundador',
        years: '2020–presente',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'Agentes de IA, sistemas de trading, infraestructura de decisión y plataforma interna para desarrolladores.',
        status: 'active',
        statusLabel: 'Activo',
      },
      {
        client: 'Arte Arena',
        role: 'Ingeniero de Software Principal',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: 'Modernización de plataforma Laravel heredada a SaaS cloud-native. Deploys 42 % más rápidos, 39 % menos costo de computación.',
        status: 'shipped',
        statusLabel: 'Entregado',
      },
      {
        client: 'Stefanini / FAPESP',
        role: 'Ingeniero de Software Senior',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'Reformulación del motor de búsqueda de la Biblioteca Virtual de la FAPESP. 37 % de mejora en la respuesta a consultas.',
        status: 'shipped',
        statusLabel: 'Entregado',
      },
      {
        client: 'Grupo financiero brasileño de primera línea',
        role: 'Ingeniero de Software',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: 'Pipelines de datos automatizados e infraestructura de smart contracts para operaciones de crédito distressed.',
        status: 'shipped',
        statusLabel: 'Entregado',
      },
      {
        client: 'Global Hitss',
        role: 'Ingeniero de Software',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: 'Data lake escalable y entrega full-stack para clientes del sector financiero empresarial.',
        status: 'shipped',
        statusLabel: 'Entregado',
      },
    ],
    personalTitle: 'Herramientas personales',
    personal: [
      {
        client: 'Robson',
        role: 'Autor',
        years: '2019–presente',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: 'Motor de ejecución y gestión de riesgo para futuros de cripto con apalancamiento fijo de 1x. El operador decide la entrada; Robson gobierna la salida.',
        status: 'production',
        statusLabel: 'En producción',
      },
      {
        client: 'x.sh',
        role: 'Autor',
        years: '2023–presente',
        tech: 'Bash · JSON',
        line: 'Runtime de ejecución gobernada: convierte comandos de shell en trazas duraderas y legibles por máquina para LLMs.',
        status: 'active',
        statusLabel: 'Activo',
      },
      {
        client: 'wt',
        role: 'Autor',
        years: '2023–presente',
        tech: 'Bash · Git',
        line: 'CLI para gestión de worktrees de Git con perfiles de entorno. Cambio de contexto rápido.',
        status: 'active',
        statusLabel: 'Activo',
      },
      {
        client: 'Strategos',
        role: 'Autor',
        years: '2022–presente',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: 'Interfaz de sala de situación para deliberación estratégica humano-IA y revisión gobernada de decisiones.',
        status: 'active',
        statusLabel: 'Activo',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Capacidades',
    title: 'Especialidad técnica',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: 'Escritura',
    title: 'Notas',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: 'Publicaciones',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: 'Tesis de maestría · FGV EAESP',
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: 'Contacto',
    title: 'Disponible para proyectos seleccionados.',
    body: '',
    note: 'El contacto puede realizarse mediante el formulario RBX a continuación.',
    links: COMMON_LINKS,
    form: {
      name: 'Nombre',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      message: 'Mensaje',
      whatsappOptIn: 'Permitir contacto por WhatsApp cuando sea relevante',
      submit: 'Enviar',
      submitting: 'Enviando…',
      success: 'Mensaje enviado.',
      error: 'Fallo en el envío. Inténtelo de nuevo.',
      namePlaceholder: 'Su nombre',
      emailPlaceholder: 'usted@ejemplo.com',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: '¿Qué necesita?',
    },
  },
  ui: {
    home: 'Inicio',
    notes: 'Notas',
    back: 'Volver',
    switchLocale: 'Idioma',
    readArticle: 'Leer artículo',
    viewFullArchive: 'Ver archivo completo',
    sendAnother: 'Enviar otro',
    altchaIdle: 'Verificar desafío antiabuso',
    altchaLoading: 'Cargando desafío…',
    altchaVerified: 'Verificado',
    altchaError: 'El desafío falló',
    altchaPrompt: 'Se requiere verificación antiabuso antes de enviar.',
    altchaAria: 'Verificar desafío antiabuso',
    allRightsReserved: 'Todos los derechos reservados.',
  },
  footer: '© 2026 Leandro Damasio. Todos los derechos reservados.',
};

const FR: HomeCopy = {
  locale: 'fr',
  htmlLang: 'fr',
  nav: {
    work: 'Travail',
    writing: 'Notes',
    contact: 'Contact',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: 'Ingénieur IA. Systèmes d’IA pour la finance et les environnements à haute exigence de fiabilité.',
    body: [
      'Ingénieur IA chez Enforce (Groupe BTG Pactual), basé à São Paulo. Conçoit des systèmes d’IA prêts pour la production pour les domaines financier et juridique, où fiabilité, observabilité et gouvernance ne sont pas optionnelles.',
      'Il suit actuellement des études de génie informatique à l’Universidade Virtual do Estado de São Paulo (UNIVESP), avec une fin de cursus prévue en 2027.',
      'Son travail couvre l’IA, l’architecture logicielle et l’infrastructure : architectures d’agents, boucles de contrôle du runtime, pipelines d’évaluation et de supervision pour systèmes fondés sur les LLM. Pratique de la recherche vectorielle avec pgvector et ParadeDB, de la gouvernance des prompts et de l’intégration sécurisée de sources de données internes et externes.',
      'Fondateur et mainteneur de RBX Systems, un monorepo open source d’agents IA, d’agents de code et d’outils système axés sur l’architecture et la maintenabilité à long terme.',
    ],
    location: 'São Paulo',
    status: 'Disponible pour des projets sélectionnés.',
  },
  team: {
    eyebrow: 'Équipe',
    title: 'Collaboration et travail pluridisciplinaire',
    body: 'Sur le plan personnel, je suis un excellent résolveur de problèmes, passionné par l’innovation. Je m’épanouis dans les environnements collaboratifs et j’aime travailler avec des équipes pluridisciplinaires. Je suis très organisé et capable de prioriser les tâches pour livrer des résultats de grande qualité dans les délais.',
  },
  work: {
    eyebrow: 'Projets sélectionnés',
    title: 'Travail, 2018–2026',
    selectedProjects: 'Projets sélectionnés',
    selectedWork: 'Travaux sélectionnés',
    professional: [
      {
        client: 'Enforce / BTG Pactual Group',
        role: 'Ingénieur IA',
        years: '2025–aujourd’hui',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: 'Systèmes d’IA prêts pour la production pour les domaines financier et juridique. Pipelines RAG, gouvernance des prompts et architectures d’agents.',
        status: 'active',
        statusLabel: 'Actif',
      },
      {
        client: 'RBX Systems',
        role: 'Fondateur',
        years: '2020–aujourd’hui',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'Agents IA, systèmes de trading, infrastructure de décision et plateforme interne pour développeurs.',
        status: 'active',
        statusLabel: 'Actif',
      },
      {
        client: 'Arte Arena',
        role: 'Ingénieur logiciel principal',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: 'Modernisation d’une plateforme Laravel héritée vers un SaaS cloud-native. Déploiements 42 % plus rapides, 39 % de coûts de calcul en moins.',
        status: 'shipped',
        statusLabel: 'Livré',
      },
      {
        client: 'Stefanini / FAPESP',
        role: 'Ingénieur logiciel senior',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'Refonte du moteur de recherche de la Bibliothèque virtuelle FAPESP. 37 % d’amélioration du temps de réponse des requêtes.',
        status: 'shipped',
        statusLabel: 'Livré',
      },
      {
        client: 'Groupe financier brésilien de premier plan',
        role: 'Ingénieur logiciel',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: 'Pipelines de données automatisés et infrastructure de smart contracts pour opérations de crédit distressed.',
        status: 'shipped',
        statusLabel: 'Livré',
      },
      {
        client: 'Global Hitss',
        role: 'Ingénieur logiciel',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: 'Data lake évolutif et livraison full-stack pour des clients du secteur financier.',
        status: 'shipped',
        statusLabel: 'Livré',
      },
    ],
    personalTitle: 'Outils personnels',
    personal: [
      {
        client: 'Robson',
        role: 'Auteur',
        years: '2019–aujourd’hui',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: 'Moteur d’exécution et de gestion des risques pour futures crypto à levier fixe de 1x. L’opérateur décide de l’entrée ; Robson gouverne la sortie.',
        status: 'production',
        statusLabel: 'En production',
      },
      {
        client: 'x.sh',
        role: 'Auteur',
        years: '2023–aujourd’hui',
        tech: 'Bash · JSON',
        line: 'Runtime d’exécution gouvernée : transforme les commandes shell en traces durables et lisibles par machine pour les LLM.',
        status: 'active',
        statusLabel: 'Actif',
      },
      {
        client: 'wt',
        role: 'Auteur',
        years: '2023–aujourd’hui',
        tech: 'Bash · Git',
        line: 'CLI de gestion des worktrees Git avec profils d’environnement. Changement de contexte rapide.',
        status: 'active',
        statusLabel: 'Actif',
      },
      {
        client: 'Strategos',
        role: 'Auteur',
        years: '2022–aujourd’hui',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: 'Interface de salle de situation pour la délibération stratégique humain-IA et la révision gouvernée des décisions.',
        status: 'active',
        statusLabel: 'Actif',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Compétences',
    title: 'Expertise technique',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: 'Écrits',
    title: 'Notes',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: 'Publications',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: 'Mémoire de master · FGV EAESP',
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Disponible pour des projets sélectionnés.',
    body: '',
    note: 'Le contact peut passer par le formulaire RBX ci-dessous.',
    links: COMMON_LINKS,
    form: {
      name: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone',
      message: 'Message',
      whatsappOptIn: 'Autoriser le contact par WhatsApp quand c’est pertinent',
      submit: 'Envoyer',
      submitting: 'Envoi en cours…',
      success: 'Message envoyé.',
      error: 'Échec de l’envoi. Réessayez.',
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'vous@exemple.com',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: 'De quoi avez-vous besoin ?',
    },
  },
  ui: {
    home: 'Accueil',
    notes: 'Notes',
    back: 'Retour',
    switchLocale: 'Langue',
    readArticle: 'Lire l’article',
    viewFullArchive: 'Voir l’archive complète',
    sendAnother: 'En envoyer un autre',
    altchaIdle: 'Vérifier le défi anti-abus',
    altchaLoading: 'Chargement du défi…',
    altchaVerified: 'Vérifié',
    altchaError: 'Échec du défi',
    altchaPrompt: 'Vérification anti-abus requise avant l’envoi.',
    altchaAria: 'Vérifier le défi anti-abus',
    allRightsReserved: 'Tous droits réservés.',
  },
  footer: '© 2026 Leandro Damasio. Tous droits réservés.',
};

const IT: HomeCopy = {
  locale: 'it',
  htmlLang: 'it',
  nav: {
    work: 'Lavoro',
    writing: 'Note',
    contact: 'Contatti',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: 'Ingegnere IA. Sistemi di IA per la finanza e ambienti ad alta affidabilità.',
    body: [
      'Ingegnere IA presso Enforce (Gruppo BTG Pactual), con base a São Paulo. Sviluppa sistemi di IA pronti per la produzione per i domini finanziario e giuridico, dove affidabilità, osservabilità e governance non sono opzionali.',
      'Studia Ingegneria informatica presso l’Universidade Virtual do Estado de São Paulo (UNIVESP), con conclusione del corso prevista per il 2027.',
      'Il lavoro spazia tra IA, architettura software e infrastruttura: architetture di agenti, loop di controllo del runtime, pipeline di valutazione e monitoraggio per sistemi basati su LLM. Esperienza pratica con ricerca vettoriale tramite pgvector e ParadeDB, governance dei prompt e integrazione sicura con fonti di dati interne ed esterne.',
      'Fondatore e manutentore di RBX Systems, un monorepo open-source di agenti IA, agenti di codice e strumenti a livello di sistema orientati all’architettura e alla manutenibilità a lungo termine.',
    ],
    location: 'São Paulo',
    status: 'Disponibile per progetti selezionati.',
  },
  team: {
    eyebrow: 'Team',
    title: 'Collaborazione e lavoro multidisciplinare',
    body: 'Sul piano personale, sono un forte risolutore di problemi con passione per l’innovazione. Prospero in ambienti collaborativi e mi piace lavorare con team multidisciplinari. Sono altamente organizzato e capace di dare priorità alle attività per consegnare risultati di alta qualità nei tempi previsti.',
  },
  work: {
    eyebrow: 'Progetti selezionati',
    title: 'Lavoro, 2018–2026',
    selectedProjects: 'Progetti selezionati',
    selectedWork: 'Lavori selezionati',
    professional: [
      {
        client: 'Enforce / BTG Pactual Group',
        role: 'Ingegnere IA',
        years: '2025–presente',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: 'Sistemi di IA pronti per la produzione per domini finanziari e giuridici. Pipeline RAG, governance dei prompt e architetture di agenti.',
        status: 'active',
        statusLabel: 'Attivo',
      },
      {
        client: 'RBX Systems',
        role: 'Fondatore',
        years: '2020–presente',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'Agenti IA, sistemi di trading, infrastruttura decisionale e piattaforma interna per sviluppatori.',
        status: 'active',
        statusLabel: 'Attivo',
      },
      {
        client: 'Arte Arena',
        role: 'Ingegnere software principale',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: 'Modernizzazione di una piattaforma Laravel legacy in SaaS cloud-native. Deploy 42 % più rapidi, 39 % di riduzione dei costi di calcolo.',
        status: 'shipped',
        statusLabel: 'Consegnato',
      },
      {
        client: 'Stefanini / FAPESP',
        role: 'Ingegnere software senior',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'Rifacimento del motore di ricerca della Biblioteca Virtuale FAPESP. 37 % di miglioramento nella risposta alle query.',
        status: 'shipped',
        statusLabel: 'Consegnato',
      },
      {
        client: 'Gruppo finanziario brasiliano di primo livello',
        role: 'Ingegnere software',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: 'Pipeline di dati automatizzate e infrastruttura di smart contract per operazioni di credito distressed.',
        status: 'shipped',
        statusLabel: 'Consegnato',
      },
      {
        client: 'Global Hitss',
        role: 'Ingegnere software',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: 'Data lake scalabile e consegna full-stack per clienti del settore finanziario.',
        status: 'shipped',
        statusLabel: 'Consegnato',
      },
    ],
    personalTitle: 'Strumenti personali',
    personal: [
      {
        client: 'Robson',
        role: 'Autore',
        years: '2019–presente',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: 'Motore di esecuzione e gestione del rischio per futures su cripto con leva fissa 1x. L’operatore decide l’ingresso; Robson governa l’uscita.',
        status: 'production',
        statusLabel: 'In produzione',
      },
      {
        client: 'x.sh',
        role: 'Autore',
        years: '2023–presente',
        tech: 'Bash · JSON',
        line: 'Runtime di esecuzione governata: trasforma comandi shell in tracce durevoli e leggibili dalle macchine per gli LLM.',
        status: 'active',
        statusLabel: 'Attivo',
      },
      {
        client: 'wt',
        role: 'Autore',
        years: '2023–presente',
        tech: 'Bash · Git',
        line: 'CLI per la gestione dei worktree Git con profili d’ambiente. Cambio di contesto rapido.',
        status: 'active',
        statusLabel: 'Attivo',
      },
      {
        client: 'Strategos',
        role: 'Autore',
        years: '2022–presente',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: 'Interfaccia di sala situazioni per la deliberazione strategica uomo-IA e la revisione governata delle decisioni.',
        status: 'active',
        statusLabel: 'Attivo',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Capacità',
    title: 'Competenza tecnica',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: 'Scrittura',
    title: 'Note',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: 'Pubblicazioni',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: 'Tesi di master · FGV EAESP',
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: 'Contatti',
    title: 'Disponibile per progetti selezionati.',
    body: '',
    note: 'Il contatto può avvenire tramite il modulo RBX qui sotto.',
    links: COMMON_LINKS,
    form: {
      name: 'Nome',
      email: 'Email',
      phone: 'Telefono',
      message: 'Messaggio',
      whatsappOptIn: 'Consenti il contatto via WhatsApp quando pertinente',
      submit: 'Invia',
      submitting: 'Invio in corso…',
      success: 'Messaggio inviato.',
      error: 'Invio non riuscito. Riprova.',
      namePlaceholder: 'Il tuo nome',
      emailPlaceholder: 'tu@esempio.com',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: 'Di cosa hai bisogno?',
    },
  },
  ui: {
    home: 'Home',
    notes: 'Note',
    back: 'Indietro',
    switchLocale: 'Lingua',
    readArticle: 'Leggi l’articolo',
    viewFullArchive: 'Vedi l’archivio completo',
    sendAnother: 'Inviane un altro',
    altchaIdle: 'Verifica la sfida anti-abuso',
    altchaLoading: 'Caricamento sfida…',
    altchaVerified: 'Verificato',
    altchaError: 'Sfida non riuscita',
    altchaPrompt: 'Verifica anti-abuso richiesta prima dell’invio.',
    altchaAria: 'Verifica la sfida anti-abuso',
    allRightsReserved: 'Tutti i diritti riservati.',
  },
  footer: '© 2026 Leandro Damasio. Tutti i diritti riservati.',
};

const ZH: HomeCopy = {
  locale: 'zh',
  htmlLang: 'zh',
  nav: {
    work: '工作',
    writing: '笔记',
    contact: '联系',
  },
  hero: {
    eyebrow: '',
    title: 'Leandro Damasio',
    lead: '人工智能工程师。面向金融与高可靠性环境的 AI 系统。',
    body: [
      'Enforce（BTG Pactual 集团）AI 工程师，常驻圣保罗。面向金融与法律领域构建生产级 AI 系统——在这些领域中，可靠性、可观测性与治理是基础要求。',
      '目前在圣保罗州虚拟大学（UNIVESP）攻读计算机工程本科学位，预计于 2027 年毕业。',
      '工作横跨 AI、软件架构与基础设施：智能体架构、运行时控制回路、面向 LLM 系统的评估与监控流水线。在 pgvector 与 ParadeDB 向量检索、提示词治理以及内外部数据源的安全集成方面具有丰富的实践经验。',
      'RBX Systems 创始人与维护者：一个开源 monorepo，涵盖 AI 智能体、代码智能体与系统级工具，专注于架构与长期可维护性。',
    ],
    location: '圣保罗',
    status: '可承接精选项目。',
  },
  team: {
    eyebrow: '团队',
    title: '协作与多学科工作',
    body: '在个人层面，我是一个出色的解决问题者，对创新充满热情。我在协作环境中如鱼得水，乐于与多学科团队共事。我条理性极强，能够合理安排任务优先级，按时交付高质量成果。',
  },
  work: {
    eyebrow: '精选项目',
    title: '工作经历，2018–2026',
    selectedProjects: '精选项目',
    selectedWork: '精选工作',
    professional: [
      {
        client: 'Enforce / BTG Pactual 集团',
        role: 'AI 工程师',
        years: '2025–至今',
        tech: 'Python · FastAPI · k3s · ArgoCD · pgvector · RAG',
        line: '面向金融与法律领域的生产级 AI 系统。RAG 流水线、提示词治理与智能体架构。',
        status: 'active',
        statusLabel: '进行中',
      },
      {
        client: 'RBX Systems',
        role: '创始人',
        years: '2020–至今',
        tech: 'Go · Rust · TypeScript · Kubernetes · Svelte',
        line: 'AI 智能体、交易系统、决策基础设施与内部开发者平台。',
        status: 'active',
        statusLabel: '进行中',
      },
      {
        client: 'Arte Arena',
        role: '首席软件工程师',
        years: '2024–2025',
        tech: 'Go · Python · FastAPI · React · Kubernetes · AWS',
        line: '将遗留 Laravel 平台现代化为云原生 SaaS。部署提速 42%，计算成本降低 39%。',
        status: 'shipped',
        statusLabel: '已交付',
      },
      {
        client: 'Stefanini / FAPESP',
        role: '高级软件工程师',
        years: '2024–2025',
        tech: 'Django · Laravel · Apache Solr',
        line: 'FAPESP 虚拟图书馆搜索引擎重构。查询响应提升 37%。',
        status: 'shipped',
        statusLabel: '已交付',
      },
      {
        client: '巴西一线金融集团',
        role: '软件工程师',
        years: '2019–2022',
        tech: 'Node.js · AWS · Ethereum · Smart Contracts',
        line: '面向不良信贷业务的自动化数据流水线与智能合约基础设施。',
        status: 'shipped',
        statusLabel: '已交付',
      },
      {
        client: 'Global Hitss',
        role: '软件工程师',
        years: '2017–2019',
        tech: 'React · Nest.js · Hadoop · Spark · Docker',
        line: '可扩展数据湖与企业金融领域客户的全栈交付。',
        status: 'shipped',
        statusLabel: '已交付',
      },
    ],
    personalTitle: '个人工具',
    personal: [
      {
        client: 'Robson',
        role: '作者',
        years: '2019–至今',
        tech: 'Rust · PostgreSQL · Binance Futures',
        line: '固定 1 倍杠杆加密货币期货的执行与风控引擎。操作员决定入场；Robson 治理离场。',
        status: 'production',
        statusLabel: '已上线生产',
      },
      {
        client: 'x.sh',
        role: '作者',
        years: '2023–至今',
        tech: 'Bash · JSON',
        line: '受治理的执行运行时：将 shell 命令转化为持久、机器可读的轨迹，供 LLM 使用。',
        status: 'active',
        statusLabel: '进行中',
      },
      {
        client: 'wt',
        role: '作者',
        years: '2023–至今',
        tech: 'Bash · Git',
        line: '带环境配置的 Git worktree 管理 CLI。快速上下文切换。',
        status: 'active',
        statusLabel: '进行中',
      },
      {
        client: 'Strategos',
        role: '作者',
        years: '2022–至今',
        tech: 'Go · Svelte · PostgreSQL · MongoDB',
        line: '人机战略研判态势室界面，支持受治理的决策评审。',
        status: 'active',
        statusLabel: '进行中',
      },
    ],
  },
  capabilities: {
    eyebrow: '能力',
    title: '技术专长',
    lines: [
      'AI/LLM systems · RAG pipelines · agentic runtimes · prompt governance',
      'Distributed systems · trading infrastructure · event-driven architecture',
      'Languages: Rust, TypeScript, Python, Go, Bash',
      'Infrastructure: Kubernetes, k3s, ArgoCD, GitOps, Docker',
      'Databases: PostgreSQL, pgvector, ParadeDB, MongoDB, Redis',
      'Frameworks: FastAPI, Next.js, React, Svelte, Nest.js',
      'Specialties: Observability, MLOps, CI/CD, cloud-native, vector search, LLM evaluation',
    ],
  },
  writing: {
    eyebrow: '写作',
    title: '笔记',
  },
  publications: {
    eyebrow: 'Speaking & Writing',
    title: '出版物',
    items: [
      {
        meta: 'Paper · PDF',
        title: 'How AI Coding Agents Read Code: Runtime Architecture of Inspection, Memory and Control',
        href: '/how-ai-coding-agents-read-code.pdf',
        year: '2025',
      },
      {
        meta: 'Talk · Slides · AI Agents Meetup, Montréal',
        title: 'AI Agents: Practical Architectures',
        href: '/ai-agents-montreal.pptx',
        year: '2024',
      },
      {
        meta: '硕士论文 · FGV EAESP',
        title: 'Desenvolvimento institucional do INEP: conjuntura crítica e trajetória',
        href: 'https://pesquisa-eaesp.fgv.br/teses-dissertacoes/desenvolvimento-institucional-do-inep-conjuntura-critica-e-trajetoria',
        year: '2011',
      },
    ],
  },
  contact: {
    eyebrow: '联系',
    title: '可承接精选项目。',
    body: '',
    note: '可通过下方的 RBX 表单进行联系。',
    links: COMMON_LINKS,
    form: {
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      message: '留言',
      whatsappOptIn: '允许在相关时通过 WhatsApp 联系',
      submit: '发送',
      submitting: '发送中…',
      success: '消息已发送。',
      error: '提交失败，请重试。',
      namePlaceholder: '您的姓名',
      emailPlaceholder: 'you@example.com',
      phonePlaceholder: '+55 11 99999-9999',
      messagePlaceholder: '您需要什么？',
    },
  },
  ui: {
    home: '首页',
    notes: '笔记',
    back: '返回',
    switchLocale: '语言',
    readArticle: '阅读文章',
    viewFullArchive: '查看完整归档',
    sendAnother: '再发送一条',
    altchaIdle: '验证防滥用挑战',
    altchaLoading: '正在加载挑战…',
    altchaVerified: '已验证',
    altchaError: '挑战失败',
    altchaPrompt: '发送前需完成防滥用验证。',
    altchaAria: '验证防滥用挑战',
    allRightsReserved: '版权所有。',
  },
  footer: '© 2026 Leandro Damasio 版权所有。',
};

const COPY: Record<Locale, HomeCopy> = {
  en: EN,
  'pt-BR': PT,
  de: DE,
  es: ES,
  fr: FR,
  it: IT,
  zh: ZH,
};

export function resolveLocale(hostname: string, routeLocale?: string | null): Locale {
  return resolveRouteLocale(hostname, routeLocale);
}

export async function getHomeCopy(locale: Locale): Promise<HomeCopy> {
  return await loadHomeCopy(locale);
}

export async function getLegacyTranslationArchive(locale: Locale): Promise<LegacyTranslationArchive | null> {
  return await loadLegacyArchive(locale);
}
