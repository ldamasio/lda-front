<script lang="ts">
  import type { NoteBlock } from './notes';

  export let blocks: NoteBlock[] = [];
</script>

<article class="note-body">
  {#each blocks as block}
    {#if block.type === 'heading'}
      <h2>{@html block.html}</h2>
    {:else if block.type === 'paragraph'}
      <p>{@html block.html}</p>
    {:else if block.type === 'bullet-list'}
      <ul>
        {#each block.items as item}
          <li>{@html item}</li>
        {/each}
      </ul>
    {:else if block.type === 'code'}
      <pre><code>{block.code}</code></pre>
    {:else}
      <hr />
    {/if}
  {/each}
</article>

<style>
  .note-body {
    display: grid;
    gap: 1rem;
    max-width: 42rem;
  }

  .note-body h2 {
    margin: 1.2rem 0 0.25rem;
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.35;
    color: var(--text-primary, #f5f5f3);
  }

  .note-body p,
  .note-body li {
    margin: 0;
    color: var(--text-secondary, #b4b5b8);
    font-size: 0.98rem;
    line-height: 1.8;
  }

  .note-body ul {
    margin: 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.35rem;
  }

  .note-body pre {
    margin: 0;
    padding: 1rem 1.1rem;
    border: 1px solid var(--surface-hairline, #26272c);
    border-radius: 0.5rem;
    overflow: auto;
    background: rgba(255, 255, 255, 0.02);
    color: var(--text-secondary, #b4b5b8);
    font-size: 0.84rem;
    line-height: 1.7;
  }

  .note-body code {
    font-family: inherit;
  }

  .note-body hr {
    border: 0;
    border-top: 1px solid var(--surface-hairline, #26272c);
    margin: 0.5rem 0;
  }

  :global(.note-body strong) {
    color: var(--text-primary, #f5f5f3);
    font-weight: 500;
  }
</style>
