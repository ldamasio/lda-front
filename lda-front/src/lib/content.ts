export type Locale = 'pt-BR' | 'en';

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
];

const EN: HomeCopy = {
  locale: 'en',
  htmlLang: 'en',
  nav: {
    work: 'Work',
    writing: 'Writing',
    contact: 'Contact',
  },
  hero: {
    eyebrow: 'Authorial engineering',
    title: 'Leandro Damasio',
    lead: 'Computer Engineer. AI systems for finance and high-reliability environments.',
    body: [
      'AI Engineer at Enforce (BTG Pactual Group), based in São Paulo, Brazil. Builds production-grade AI systems for financial and legal domains where reliability, observability, and governance are not optional.',
      'Work spans AI, software architecture, and infrastructure: agentic architectures, runtime control loops, evaluation and monitoring pipelines for LLM-based systems. Hands-on with vector search using pgvector and ParadeDB, prompt governance, and secure integration with internal and external data sources.',
      'Founder and maintainer of RBX Systems, an open-source monorepo of AI agents, code agents, and system-level tooling focused on architecture and long-term maintainability.',
      'Based in Brazil, working across Zürich and São Paulo. Available for selected engagements.',
    ],
    location: 'Brazil · Zürich / São Paulo',
    status: 'Available for selected engagements.',
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
        client: 'RTK · Rust Token Killer',
        role: 'Author',
        years: '2024',
        tech: 'Rust',
        line: 'Token-level audit tool for LLM prompt chains. Detects leakage and governance violations.',
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
    switchLocale: 'PT-BR / EN',
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
    writing: 'Escrita',
    contact: 'Contato',
  },
  hero: {
    eyebrow: 'Engenharia autoral',
    title: 'Leandro Damasio',
    lead: 'Engenheiro de Computação. Sistemas de IA para finanças e ambientes de alta confiabilidade.',
    body: [
      'Engenheiro de IA na Enforce (Grupo BTG Pactual), baseado em São Paulo, Brasil. Constrói sistemas de IA prontos para produção para os domínios financeiro e jurídico onde confiabilidade, observabilidade e governança são requisitos de base.',
      'Trabalho abrange IA, arquitetura de software e infraestrutura: arquiteturas de agentes, loops de controle de runtime, pipelines de avaliação e monitoramento para sistemas baseados em LLM. Experiência prática com busca vetorial usando pgvector e ParadeDB, governança de prompts e integração segura com fontes de dados internas e externas.',
      'Fundador e mantenedor da RBX Systems, monorepo open-source de agentes de IA, agentes de código e ferramentas de nível de sistema com foco em arquitetura e manutenibilidade de longo prazo.',
      'Baseado no Brasil, atuando entre Zürich e São Paulo. Disponível para projetos selecionados.',
    ],
    location: 'Brasil · Zürich / São Paulo',
    status: 'Disponível para projetos selecionados.',
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
        client: 'RTK · Rust Token Killer',
        role: 'Autor',
        years: '2024',
        tech: 'Rust',
        line: 'Ferramenta de auditoria em nível de token para cadeias de prompt de LLM. Detecta vazamento e violações de governança.',
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
    switchLocale: 'PT-BR / EN',
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

const COPY: Record<Locale, HomeCopy> = {
  en: EN,
  'pt-BR': PT,
};

export function resolveLocale(hostname: string): Locale {
  return hostname.endsWith('.ch') ? 'en' : 'pt-BR';
}

export function getHomeCopy(locale: Locale): HomeCopy {
  return COPY[locale];
}
