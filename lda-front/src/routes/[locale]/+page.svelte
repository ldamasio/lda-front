<script lang="ts">
  import { onMount } from 'svelte';
  import LocaleSwitch from '$lib/LocaleSwitch.svelte';
  import ContactForm from '$lib/ContactForm.svelte';
  import { getLocalePathSegment } from '$lib/locale';
  import type { PageData } from './$types';

  export let data: PageData;
  let localePath = '';
  $: localePath = getLocalePathSegment(data.copy.locale) ?? '';

  onMount(() => {
    document.documentElement.lang = data.copy.htmlLang;
  });
</script>

<svelte:head>
  <title>{data.copy.hero.title}</title>
  <meta name="description" content={data.copy.hero.lead} />
  <meta property="og:title" content={data.copy.hero.title} />
  <meta property="og:description" content={data.copy.hero.lead} />
</svelte:head>

<div class="page-shell">
  <header class="topbar" aria-label="Primary">
    <div class="brand">
      <span class="brand-mark">LD</span>
      <div>
        {#if data.copy.hero.eyebrow}<p class="eyebrow">{data.copy.hero.eyebrow}</p>{/if}
        <p class="brand-subline">{data.copy.hero.location}</p>
      </div>
    </div>
    <nav class="pill-nav">
      <a href={`/${localePath}#work`}>{data.copy.nav.work}</a>
      <a href={`/${localePath}#writing`}>{data.copy.nav.writing}</a>
      <a href={`/${localePath}#contact`}>{data.copy.nav.contact}</a>
    </nav>
    <LocaleSwitch label={data.copy.ui.switchLocale} options={data.localeOptions} />
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">{data.copy.hero.status}</p>
        <h1>{data.copy.hero.title}</h1>
        <p class="lead">{data.copy.hero.lead}</p>
        {#each data.copy.hero.body as paragraph}
          <p class="body">{paragraph}</p>
        {/each}
        <div class="hero-actions">
          <a class="button button-primary" href={`/${localePath}#work`}>{data.copy.nav.work}</a>
          <a class="button button-secondary" href={`/${localePath}#contact`}>{data.copy.nav.contact}</a>
        </div>
      </div>

      <aside class="signal-panel" aria-label="Positioning">
        <div>
          <p class="eyebrow">{data.copy.work.selectedProjects}</p>
          <h2>{data.copy.work.title}</h2>
        </div>
        <div class="signal-lines">
          <span>{data.copy.hero.location}</span>
          <span>{data.copy.capabilities.lines[0]}</span>
          <span>{data.copy.contact.title}</span>
        </div>
      </aside>
    </section>

    <section class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.team.eyebrow}</p>
        <h2>{data.copy.team.title}</h2>
      </div>
      <p class="body">{data.copy.team.body}</p>
    </section>

    <section id="work" class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.work.selectedProjects}</p>
        <h2>{data.copy.work.title}</h2>
      </div>

      <div class="work-grid">
        {#each data.copy.work.professional as item}
          <article class="work-card">
            <p class="work-meta">{item.tech}</p>
            <h3>{item.client}</h3>
            <p class="work-role">{item.role} · {item.years}</p>
            <p>{item.line}</p>
            <p class="work-status">{item.statusLabel}</p>
          </article>
        {/each}
      </div>

      <div class="section-heading section-heading-wide section-spacer">
        <p class="eyebrow">{data.copy.work.personalTitle}</p>
      </div>

      <div class="work-grid">
        {#each data.copy.work.personal as item}
          <article class="work-card">
            <p class="work-meta">{item.tech}</p>
            <h3>{item.client}</h3>
            <p class="work-role">{item.role} · {item.years}</p>
            <p>{item.line}</p>
            <p class="work-status">{item.statusLabel}</p>
          </article>
        {/each}
      </div>
    </section>

    <section class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.capabilities.eyebrow}</p>
        <h2>{data.copy.capabilities.title}</h2>
      </div>
      <div class="capability-list">
        {#each data.copy.capabilities.lines as line}
          <p>{line}</p>
        {/each}
      </div>
    </section>

    <section id="writing" class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.writing.eyebrow}</p>
        <h2>{data.copy.writing.title}</h2>
      </div>

      <div class="post-grid">
        {#each data.notes as note}
          <article class="post-card">
            <p class="post-meta">{note.dateLabel} · {note.readTime}</p>
            <h3>{note.title}</h3>
            <div class="post-tags">
              {#each note.tags as tag}
                <span>{tag}</span>
              {/each}
            </div>
            <a class="post-link" href={`/${localePath}/blog/${note.slug}`}>{data.copy.ui.readArticle}</a>
          </article>
        {/each}
      </div>

      <a class="archive-link" href={`/${localePath}/blog`}>{data.copy.ui.viewFullArchive}</a>
    </section>

    <section class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.publications.eyebrow}</p>
        <h2>{data.copy.publications.title}</h2>
      </div>

      <div class="archive-list">
        {#each data.copy.publications.items as item}
          <a class="archive-item" href={item.href} target="_blank" rel="noreferrer">
            <div>
              <p class="post-meta">{item.meta}</p>
              <h3>{item.title}</h3>
            </div>
            <p class="archive-year">{item.year}</p>
          </a>
        {/each}
      </div>
    </section>

    <section id="contact" class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.contact.eyebrow}</p>
        <h2>{data.copy.contact.title}</h2>
        {#if data.copy.contact.body}
          <p>{data.copy.contact.body}</p>
        {/if}
      </div>

      <ContactForm
        labels={data.copy.contact.form}
        ui={data.copy.ui}
        locale={data.copy.locale}
        title={data.copy.contact.title}
        note={data.copy.contact.note}
      />

      <div class="contact-links">
        {#each data.copy.contact.links as link}
          <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
            <span>{link.label}</span>
          </a>
        {/each}
      </div>
    </section>
  </main>

  <footer>
    <p>{data.copy.footer}</p>
  </footer>
</div>
