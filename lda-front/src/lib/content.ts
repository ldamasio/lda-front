export type Locale = 'pt-BR' | 'en';

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  date: string;
  readTime: string;
  tags: string[];
  title: string;
  excerpt: string;
  cover?: string;
  sections: BlogSection[];
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
    body: string;
    location: string;
    status: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    body: string;
  };
  work: {
    eyebrow: string;
    title: string;
    items: Array<{
      title: string;
      body: string;
      meta: string;
    }>;
  };
  writing: {
    eyebrow: string;
    title: string;
    body: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
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
    archive: string;
    home: string;
    readArticle: string;
    viewFullArchive: string;
    sendAnother: string;
    switchLocale: string;
    altchaIdle: string;
    altchaLoading: string;
    altchaVerified: string;
    altchaError: string;
    altchaPrompt: string;
    altchaAria: string;
  };
  footer: string;
};

const BLOG_POSTS: Record<Locale, BlogPost[]> = {
  'pt-BR': [
    {
      slug: 'blog-como-projecao-editorial',
      date: '2026-07-04',
      readTime: '4 min',
      tags: ['blog', 'editorial', 'arquitetura'],
      title: 'Blog como projeção editorial, não como decoração',
      excerpt:
        'A parte que faltou na primeira migração não foi um card. Foi uma camada editorial: artigo, índice, data, leitura e páginas de detalhe que carregam contexto de forma estável.',
      sections: [
        {
          heading: 'O problema com páginas genéricas',
          paragraphs: [
            'Um front institucional sem escrita vira uma vitrine curta. Ele mostra que existe, mas não explica como pensa. Para este site, o blog precisa carregar argumento, não apenas anúncio.',
            'O site anterior tinha essa vocação embutida em páginas e notas. Na migração inicial eu preservei a superfície, mas não a gramática de publicação.',
          ],
          bullets: [
            'Índice com leitura, data e tags.',
            'Página de detalhe com seções legíveis.',
            'Histórico de escrita que sobreviva ao deploy.',
          ],
        },
        {
          heading: 'O que deveria ter entrado na migração',
          paragraphs: [
            'Eu deveria ter trazido um modelo de blog em vez de apenas um painel de vitrine. Isso inclui posts estruturados, página de arquivo, e navegação por tema.',
            'A fidelidade não está no framework. Está no tipo de conteúdo que o site consegue sustentar sem virar ruído.',
          ],
        },
        {
          heading: 'O resultado desejado',
          paragraphs: [
            'O blog entra como uma camada de raciocínio público. Ele não compete com o portfólio. Ele explica as decisões por trás dele.',
          ],
        },
      ],
    },
    {
      slug: 'whatsapp-no-lugar-de-email',
      date: '2026-07-04',
      readTime: '5 min',
      tags: ['contato', 'comms', 'whatsapp'],
      title: 'Contato operacional via WhatsApp, sem email exposto',
      excerpt:
        'O formulário deve ser a única porta pública. O email não precisa aparecer como atalho de baixa fricção; o fluxo certo é o RBX comms, com entrega via WhatsApp e registro do lead.',
      sections: [
        {
          heading: 'Por que esconder o email',
          paragraphs: [
            'Email fixo na tela vira um atalho frágil e pouco auditável. O usuário precisa de uma entrada clara; o operador precisa de roteamento, proteção anti-abuso e persistência.',
            'O `rbx-comms` já nasceu para isso: `/api/contact` como porta pública, Altcha, honeypot, rate limit, persistência e entrega ao WhatsApp.',
          ],
        },
        {
          heading: 'O que a interface deve fazer',
          paragraphs: [
            'Expor um formulário curto, com nome, email ou telefone, mensagem e consentimento para WhatsApp quando aplicável. O resto fica do lado do serviço.',
            'O frontend não deve decidir canal por conta própria. Ele só coleta, valida o básico e envia para o backend apropriado.',
          ],
          bullets: [
            'Sem email fixo na página.',
            'Sem CTA duplicado em vários lugares.',
            'Sem mistura de contato e marketing.',
          ],
        },
        {
          heading: 'Fidelidade ao ecossistema',
          paragraphs: [
            'Isso alinha o site pessoal com o restante do ecossistema RBX: a interface apresenta, o serviço comunica e o operador acompanha.',
          ],
        },
      ],
    },
    {
      slug: 'tipografia-menor-menos-barulho',
      date: '2026-07-04',
      readTime: '4 min',
      tags: ['design-system', 'tipografia', 'ui'],
      title: 'Tipografia menor, superfície mais sutil',
      excerpt:
        'O SvelteKit ficou correto, mas o desenho inicial estava grande demais. O tom certo aqui é institucional e fino, com menos contraste gestual e mais controle de ritmo.',
      sections: [
        {
          heading: 'O excesso da primeira versão',
          paragraphs: [
            'O primeiro corte foi mais alto e mais largo do que deveria. Em um site pessoal institucional, isso rouba sobriedade. O olho precisa de respiro, não de volume.',
            'A solução é reduzir a escala, estreitar a largura de leitura e empurrar a força visual para a hierarquia, não para o tamanho.',
          ],
        },
        {
          heading: 'Como o design system ajuda',
          paragraphs: [
            'Textos mais contidos, labels mais discretos, bordas finas e cards que parecem documentos operacionais. É esse tipo de elegância que o site antigo carregava melhor.',
            'A migração fica mais fiel quando a interface para de competir com a escrita.',
          ],
        },
      ],
    },
  ],
  en: [
    {
      slug: 'editorial-blog-not-just-decor',
      date: '2026-07-04',
      readTime: '4 min',
      tags: ['blog', 'editorial', 'architecture'],
      title: 'A blog as an editorial projection, not decoration',
      excerpt:
        'The missing part in the first migration was not another card. It was an editorial layer: article pages, an archive, dates, reading time and stable detail views.',
      sections: [
        {
          heading: 'The problem with generic pages',
          paragraphs: [
            'An institutional site without writing becomes a short showcase. It proves the site exists, but it does not explain how it thinks. For this site, the blog must carry arguments, not just announcements.',
            'The previous stack already hinted at that in notes and article pages. In the first migration I kept the surface, but not the publishing grammar.',
          ],
          bullets: [
            'Archive with reading time, dates and tags.',
            'Detail pages with readable sections.',
            'Writing history that survives deploys.',
          ],
        },
        {
          heading: 'What should have come over',
          paragraphs: [
            'I should have brought a blog model instead of only a showcase panel. That means structured posts, an archive page and topic navigation.',
            'Fidelity is not about the framework. It is about the kind of content the site can carry without becoming noise.',
          ],
        },
        {
          heading: 'The target result',
          paragraphs: [
            'The blog becomes a public reasoning layer. It does not compete with the portfolio. It explains the decisions behind it.',
          ],
        },
      ],
    },
    {
      slug: 'whatsapp-over-email',
      date: '2026-07-04',
      readTime: '5 min',
      tags: ['contact', 'comms', 'whatsapp'],
      title: 'Operational contact via WhatsApp, no pinned email',
      excerpt:
        'The form should be the only public door. Email does not need to sit on screen as a low-friction shortcut; the proper flow is RBX comms, with WhatsApp delivery and lead persistence.',
      sections: [
        {
          heading: 'Why hide the email',
          paragraphs: [
            'A pinned email address is a fragile and weakly auditable shortcut. Users need one clear entry. Operators need routing, abuse protection and persistence.',
            'That is what `rbx-comms` was built for: `/api/contact` as the public door, Altcha, honeypot, rate limiting, persistence and WhatsApp delivery.',
          ],
        },
        {
          heading: 'What the interface should do',
          paragraphs: [
            'Expose a short form with name, email or phone, message and WhatsApp consent where applicable. Everything else belongs to the service.',
            'The frontend should not invent channel logic. It should only collect, validate the basics and send the request to the right backend.',
          ],
          bullets: [
            'No email pinned on the page.',
            'No duplicated CTA noise.',
            'No blending of contact and marketing.',
          ],
        },
        {
          heading: 'Fit with the ecosystem',
          paragraphs: [
            'That keeps the personal site aligned with the RBX stack: the interface presents, the service communicates and the operator sees the result.',
          ],
        },
      ],
    },
    {
      slug: 'smaller-type-less-noise',
      date: '2026-07-04',
      readTime: '4 min',
      tags: ['design-system', 'type', 'ui'],
      title: 'Smaller type, quieter surface',
      excerpt:
        'The SvelteKit rewrite was correct, but the first pass was too large. The right tone here is institutional and restrained, with less gesture and more rhythm control.',
      sections: [
        {
          heading: 'The first pass was too loud',
          paragraphs: [
            'The initial scale was taller and wider than it should have been. On an institutional personal site, that steals sobriety. The eye needs space, not volume.',
            'The fix is to reduce scale, narrow the reading width and move visual force into hierarchy rather than size.',
          ],
        },
        {
          heading: 'How the design system helps',
          paragraphs: [
            'Smaller body text, quieter labels, thin borders and cards that feel like operational documents. That is the kind of elegance the old site handled better.',
            'The migration becomes more faithful when the interface stops competing with the writing.',
          ],
        },
      ],
    },
  ],
};

const HOME_COPY: Record<Locale, HomeCopy> = {
  'pt-BR': {
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
      lead: 'Engenheiro de Computação. Sistemas de IA e interfaces para ambientes de alta confiabilidade.',
      body: 'Constrói produtos digitais, plataformas de automação e sistemas operacionais com rigor institucional. O foco é confiabilidade, observabilidade e clareza operacional.',
      location: 'Brasil · São Paulo / Zürich',
      status: 'Disponível para projetos selecionados',
    },
    intro: {
      eyebrow: 'Posicionamento',
      title: 'Institucional, porém pessoal.',
      body: 'O site precisa parecer um documento de trabalho, não um palco. Ele explica a prática, mostra o corpo de escrita e abre um canal de contato operacional sem ruído.',
    },
    work: {
      eyebrow: 'Trabalho',
      title: 'Sistemas, produtos e entrega',
      items: [
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
    },
    writing: {
      eyebrow: 'Escrita',
      title: 'Blog e artigos',
      body: 'A parte mais fiel da migração é a escrita estruturada. O blog abaixo traz argumento, data, leitura e detalhe, como um arquivo público de raciocínio.',
    },
    contact: {
      eyebrow: 'Contato',
      title: 'Um único formulário, sem email exposto',
      body: 'Use o formulário para enviar a mensagem. O backend do `rbx-comms` faz o roteamento via WhatsApp e persiste o lead no fluxo correto.',
      note: 'Sem email fixo na tela. Sem contato duplicado. Só a porta pública que o ecossistema já usa.',
      form: {
        name: 'Nome',
        email: 'Email ou telefone',
        phone: 'Telefone',
        message: 'Mensagem',
        whatsappOptIn: 'Pode responder por WhatsApp',
        submit: 'Enviar via WhatsApp',
        submitting: 'Enviando',
        success: 'Mensagem enviada. O fluxo do RBX comms recebeu a solicitação.',
        error: 'Não foi possível enviar agora. Tente novamente.',
        namePlaceholder: 'Seu nome',
        emailPlaceholder: 'email@dominio.com ou +55...',
        phonePlaceholder: '+55 11 99999-9999',
        messagePlaceholder: 'Explique brevemente o contexto, prazo e objetivo.',
      },
    },
    ui: {
      archive: 'Arquivo',
      home: 'Início',
      readArticle: 'Ler artigo',
      viewFullArchive: 'Ver arquivo completo',
      sendAnother: 'Enviar outra mensagem',
      switchLocale: 'Idioma',
      altchaIdle: "Não sou um robô",
      altchaLoading: 'Verificando...',
      altchaVerified: 'Verificado',
      altchaError: 'Falha na verificação. Tente novamente.',
      altchaPrompt: 'Altcha, honeypot e roteamento via RBX comms.',
      altchaAria: 'Verificar desafio antiabuso',
    },
    footer: 'Leandro Damasio · Sistemas digitais com rigor institucional.',
  },
  en: {
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
      lead: 'Computer Engineer. AI systems and interfaces for high-reliability environments.',
      body: 'Builds digital products, automation platforms and operational systems with institutional rigor. The emphasis is reliability, observability and operational clarity.',
      location: 'Brazil · São Paulo / Zürich',
      status: 'Available for selected engagements',
    },
    intro: {
      eyebrow: 'Positioning',
      title: 'Institutional, but personal.',
      body: 'The site should feel like a working document, not a stage. It explains the practice, surfaces a body of writing and opens an operational contact path without noise.',
    },
    work: {
      eyebrow: 'Work',
      title: 'Systems, products and delivery',
      items: [
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
    },
    writing: {
      eyebrow: 'Writing',
      title: 'Blog and essays',
      body: 'The most faithful part of the migration is the structured writing layer. The archive below carries argument, date, reading time and detail, like a public record of reasoning.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'One form only, no pinned email',
      body: 'Use the form to send the message. The `rbx-comms` backend routes it through WhatsApp and persists the lead in the proper flow.',
      note: 'No fixed email on screen. No duplicated contact path. Just the public door the ecosystem already uses.',
      form: {
        name: 'Name',
        email: 'Email or phone',
        phone: 'Phone',
        message: 'Message',
        whatsappOptIn: 'Reply via WhatsApp',
        submit: 'Send via WhatsApp',
        submitting: 'Sending',
        success: 'Message sent. RBX comms received the request.',
        error: 'Could not send right now. Please try again.',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'email@domain.com or +55...',
        phonePlaceholder: '+55 11 99999-9999',
        messagePlaceholder: 'Briefly explain the context, timing and goal.',
      },
    },
    ui: {
      archive: 'Archive',
      home: 'Home',
      readArticle: 'Read article',
      viewFullArchive: 'View full archive',
      sendAnother: 'Send another message',
      switchLocale: 'Language',
      altchaIdle: "I'm not a robot",
      altchaLoading: 'Verifying...',
      altchaVerified: 'Verified',
      altchaError: 'Verification failed. Try again.',
      altchaPrompt: 'Altcha, honeypot and routing via RBX comms.',
      altchaAria: 'Verify anti-abuse challenge',
    },
    footer: 'Leandro Damasio · Digital systems with institutional rigor.',
  },
};

export function resolveLocale(hostname: string): Locale {
  return hostname.endsWith('.ch') ? 'en' : 'pt-BR';
}

export function getHomeCopy(locale: Locale): HomeCopy {
  return HOME_COPY[locale];
}

export function getBlogPosts(locale: Locale): BlogPost[] {
  return BLOG_POSTS[locale];
}

export function getBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  return BLOG_POSTS[locale].find((post) => post.slug === slug);
}
