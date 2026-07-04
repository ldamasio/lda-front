<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  onMount(() => {
    document.documentElement.lang = data.copy.htmlLang;
  });

  const anchors = [
    { href: '#work', label: data.copy.nav.work },
    { href: '#practice', label: data.copy.nav.practice },
    { href: '#contact', label: data.copy.nav.contact },
  ];
</script>

<svelte:head>
  <title>{data.copy.hero.title} · {data.copy.hero.eyebrow}</title>
  <meta name="description" content={data.copy.hero.body} />
  <meta property="og:title" content={data.copy.hero.title} />
  <meta property="og:description" content={data.copy.hero.body} />
</svelte:head>

<div class="page-shell">
  <header class="topbar" aria-label="Primary">
    <div class="brand">
      <span class="brand-mark">LD</span>
      <div>
        <p class="eyebrow">{data.copy.hero.eyebrow}</p>
        <p class="brand-subline">{data.copy.hero.location}</p>
      </div>
    </div>
    <nav class="pill-nav">
      {#each anchors as anchor}
        <a href={anchor.href}>{anchor.label}</a>
      {/each}
    </nav>
    <div class="locale-badge">{data.copy.locale.toUpperCase()}</div>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">{data.copy.hero.status}</p>
        <h1>{data.copy.hero.title}</h1>
        <p class="lead">{data.copy.hero.lead}</p>
        <p class="body">{data.copy.hero.body}</p>

        <div class="hero-actions">
          <a class="button button-primary" href="#work">{data.copy.nav.work}</a>
          <a class="button button-secondary" href="#contact">{data.copy.nav.contact}</a>
        </div>

        <div class="meta-line">
          <span>{data.copy.hero.location}</span>
          <span>{data.copy.hero.availability}</span>
        </div>
      </div>

      <aside class="signal-panel" aria-label="Profile signals">
        <div>
          <p class="eyebrow">Selected profile</p>
          <h2>{data.copy.hero.status}</h2>
        </div>
        <div class="signal-lines">
          <span>{data.copy.hero.location}</span>
          <span>Frontend · AI engineering · GitOps delivery</span>
          <span>Operational interfaces for stable systems</span>
        </div>
      </aside>
    </section>

    <section class="highlights" aria-label="Highlights">
      {#each data.copy.highlights as item}
        <div class="highlight-chip">{item}</div>
      {/each}
    </section>

    <section id="practice" class="section-grid">
      {#each data.copy.sections as section}
        <article class="card">
          <p class="eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </article>
      {/each}
    </section>

    <section id="work" class="content-section">
      <div class="section-heading">
        <p class="eyebrow">{data.copy.nav.work}</p>
        <h2>{data.copy.hero.status}</h2>
      </div>

      <div class="work-grid">
        {#each data.copy.work as item}
          <article class="work-card">
            <p class="work-meta">{item.meta}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        {/each}
      </div>
    </section>

    <section id="contact" class="content-section contact-section">
      <div class="section-heading">
        <p class="eyebrow">{data.copy.nav.contact}</p>
        <h2>{data.copy.contactTitle}</h2>
        <p>{data.copy.contactBody}</p>
      </div>

      <div class="contact-links">
        {#each data.copy.links as link}
          <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
            <span>{link.label}</span>
            <span>{link.href.replace('mailto:', '')}</span>
          </a>
        {/each}
      </div>
    </section>
  </main>

  <footer>
    <p>{data.copy.footer}</p>
  </footer>
</div>
