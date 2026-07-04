<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import LocaleSwitch from '$lib/LocaleSwitch.svelte';

  export let data: PageData;

  onMount(() => {
    document.documentElement.lang = data.copy.htmlLang;
  });
</script>

<svelte:head>
  <title>{data.post.title}</title>
  <meta name="description" content={data.post.excerpt} />
</svelte:head>

<div class="page-shell">
  <header class="topbar topbar-tight" aria-label="Primary">
    <div class="brand">
      <span class="brand-mark">LD</span>
      <div>
        <p class="eyebrow">{data.copy.writing.eyebrow}</p>
        <p class="brand-subline">{data.post.date}</p>
      </div>
    </div>
    <nav class="pill-nav">
      <a href="/blog">{data.copy.ui.archive}</a>
      <a href="/">{data.copy.ui.home}</a>
    </nav>
    <LocaleSwitch locale={data.copy.locale} href={data.alternateHref} label={data.copy.ui.switchLocale} />
  </header>

  <main>
    <article class="article-shell">
      <p class="post-meta">{data.post.readTime}</p>
      <h1 class="article-title">{data.post.title}</h1>
      <p class="article-excerpt">{data.post.excerpt}</p>

      <div class="post-tags">
        {#each data.post.tags as tag}
          <span>{tag}</span>
        {/each}
      </div>

      {#if data.post.cover}
        <img class="article-cover" src={data.post.cover} alt={data.post.title} />
      {/if}

      <div class="article-body">
        {#each data.post.sections as section}
          <section class="article-section">
            <h2>{section.heading}</h2>
            {#each section.paragraphs as paragraph}
              <p>{paragraph}</p>
            {/each}
            {#if section.bullets}
              <ul>
                {#each section.bullets as bullet}
                  <li>{bullet}</li>
                {/each}
              </ul>
            {/if}
          </section>
        {/each}
      </div>
    </article>
  </main>
</div>
