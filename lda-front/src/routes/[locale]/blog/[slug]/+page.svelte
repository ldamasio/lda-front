<script lang="ts">
  import { onMount } from 'svelte';
  import LocaleSwitch from '$lib/LocaleSwitch.svelte';
  import NoteBody from '$lib/NoteBody.svelte';
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
  <title>{data.note.title}</title>
  <meta name="description" content={data.note.description} />
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
      <a href={`/${localePath}/blog`}>{data.copy.ui.back}</a>
      <a href={`/${localePath}`}>{data.copy.ui.home}</a>
    </nav>
    <LocaleSwitch label={data.copy.ui.switchLocale} options={data.localeOptions} />
  </header>

  <main>
    <article class="article-shell">
      <p class="post-meta">{data.note.dateLabel} · {data.note.readTime}</p>
      <h1 class="article-title">{data.note.title}</h1>
      <p class="article-excerpt">{data.note.description}</p>

      <div class="post-tags">
        {#each data.note.tags as tag}
          <span>{tag}</span>
        {/each}
      </div>

      <NoteBody blocks={data.note.blocks} />
    </article>
  </main>
</div>
