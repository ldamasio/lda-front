<script lang="ts">
  import type { HomeCopy } from './content';

  export let locale: HomeCopy['locale'];
  export let href: string;
  export let label: string;

  const target = locale === 'en' ? 'PT-BR' : 'EN';
  const ariaLabel = locale === 'en' ? 'Switch to Portuguese' : 'Switch to English';
</script>

<a class="locale-switch" href={href} aria-label={ariaLabel} title={ariaLabel}>
  <span class="switch-label">{label}</span>
  <span class="switch-target">{target}</span>
</a>

<style>
  .locale-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.48rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    color: var(--accent);
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
  }

  .locale-switch:hover,
  .locale-switch:focus-visible {
    border-color: var(--accent);
    outline: none;
  }

  .switch-label {
    color: var(--fg-3);
  }

  .switch-target {
    color: var(--accent);
  }
</style>
