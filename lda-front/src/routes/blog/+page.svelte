<script lang="ts">
  import { onMount } from 'svelte';
  import LocaleSwitch from '$lib/LocaleSwitch.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  onMount(() => {
    document.documentElement.lang = data.copy.htmlLang;
  });
</script>

<svelte:head>
  <title>{data.copy.writing.title}</title>
  <meta name="description" content={data.copy.writing.title} />
</svelte:head>

<div class="page-shell">
  <header class="topbar topbar-tight" aria-label="Primary">
    <div class="brand">
      <span class="brand-mark">LD</span>
      <div>
        <p class="eyebrow">{data.copy.writing.eyebrow}</p>
        <p class="brand-subline">{data.copy.writing.title}</p>
      </div>
    </div>
    <nav class="pill-nav">
      <a href="/">{data.copy.ui.home}</a>
      <a href="/#contact">{data.copy.nav.contact}</a>
    </nav>
    <LocaleSwitch locale={data.copy.locale} href={data.alternateHref} label={data.copy.ui.switchLocale} />
  </header>

  <main>
    <section class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.writing.eyebrow}</p>
        <h1 class="archive-title">{data.copy.writing.title}</h1>
      </div>

      <div class="archive-list">
        {#each data.notes as note}
          <a class="archive-item" href={`/blog/${note.slug}`}>
            <div>
              <p class="post-meta">{note.tags.join(' · ')}</p>
              <h2>{note.title}</h2>
              <p class="archive-desc">{note.description}</p>
            </div>
            <div class="archive-meta">
              <p>{note.dateLabel}</p>
              <p>{note.readTime}</p>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </main>
</div>
