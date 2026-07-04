<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import ContactForm from '$lib/ContactForm.svelte';
  import LocaleSwitch from '$lib/LocaleSwitch.svelte';

  export let data: PageData;

  onMount(() => {
    document.documentElement.lang = data.copy.htmlLang;
  });

  const anchors = [
    { href: '#work', label: data.copy.nav.work },
    { href: '#writing', label: data.copy.nav.writing },
    { href: '#contact', label: data.copy.nav.contact },
  ];

  $: featuredPosts = data.posts.slice(0, 3);
</script>

<svelte:head>
  <title>{data.copy.hero.title}</title>
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
    <LocaleSwitch locale={data.copy.locale} href={data.alternateHref} label={data.copy.ui.switchLocale} />
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">{data.copy.hero.status}</p>
        <h1>{data.copy.hero.title}</h1>
        <p class="lead">{data.copy.hero.lead}</p>
        <p class="body">{data.copy.hero.body}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#writing">{data.copy.nav.writing}</a>
          <a class="button button-secondary" href="#contact">{data.copy.nav.contact}</a>
        </div>
        <div class="meta-line">
          <span>{data.copy.hero.location}</span>
          <span>{data.copy.hero.status}</span>
        </div>
      </div>

      <aside class="signal-panel" aria-label="Positioning">
        <div>
          <p class="eyebrow">{data.copy.intro.eyebrow}</p>
          <h2>{data.copy.intro.title}</h2>
        </div>
        <div class="signal-lines">
          <span>{data.copy.intro.body}</span>
          <span>{data.copy.writing.body}</span>
          <span>{data.copy.contact.note}</span>
        </div>
      </aside>
    </section>

    <section id="work" class="content-section">
      <div class="section-heading">
        <p class="eyebrow">{data.copy.work.eyebrow}</p>
        <h2>{data.copy.work.title}</h2>
      </div>

      <div class="work-grid">
        {#each data.copy.work.items as item}
          <article class="work-card">
            <p class="work-meta">{item.meta}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        {/each}
      </div>
    </section>

    <section id="writing" class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.writing.eyebrow}</p>
        <h2>{data.copy.writing.title}</h2>
        <p>{data.copy.writing.body}</p>
      </div>

      <div class="post-grid">
        {#each featuredPosts as post}
          <article class="post-card">
            <p class="post-meta">{post.date} · {post.readTime}</p>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div class="post-tags">
              {#each post.tags as tag}
                <span>{tag}</span>
              {/each}
            </div>
            <a class="post-link" href={`/blog/${post.slug}`}>{data.copy.ui.readArticle}</a>
          </article>
        {/each}
      </div>

      <a class="archive-link" href="/blog">{data.copy.ui.viewFullArchive}</a>
    </section>

    <section id="contact" class="content-section">
      <div class="section-heading section-heading-wide">
        <p class="eyebrow">{data.copy.contact.eyebrow}</p>
        <h2>{data.copy.contact.title}</h2>
        <p>{data.copy.contact.body}</p>
      </div>

      <ContactForm
        labels={data.copy.contact.form}
        ui={data.copy.ui}
        locale={data.copy.locale}
        title={data.copy.contact.title}
        note={data.copy.contact.note}
      />
    </section>
  </main>

  <footer>
    <p>{data.copy.footer}</p>
  </footer>
</div>
