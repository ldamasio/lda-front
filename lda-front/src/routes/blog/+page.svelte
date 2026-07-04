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
  <title>{data.copy.writing.title}</title>
  <meta name="description" content={data.copy.writing.body} />
</svelte:head>

<div class="page-shell">
  <header class="topbar topbar-tight" aria-label="Primary">
    <div class="brand">
      <span class="brand-mark">LD</span>
      <div>
        <p class="eyebrow">{data.copy.writing.eyebrow}</p>
        <p class="brand-subline">{data.copy.ui.archive}</p>
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
        <p>{data.copy.writing.body}</p>
      </div>

      <div class="archive-list">
        {#each data.posts as post}
          <article class="archive-item">
            <p class="post-meta">{post.date} · {post.readTime}</p>
            <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
            <p>{post.excerpt}</p>
            <div class="post-tags">
              {#each post.tags as tag}
                <span>{tag}</span>
              {/each}
            </div>
          </article>
        {/each}
      </div>
    </section>
  </main>
</div>
