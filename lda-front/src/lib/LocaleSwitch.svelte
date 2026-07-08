<script lang="ts">
  import type { Locale } from './locale';

  type LocaleOption = {
    locale: Locale;
    label: string;
    href: string;
    active: boolean;
  };

  export let label: string;
  export let options: LocaleOption[];
</script>

<nav class="locale-switch" aria-label={label}>
  <span class="switch-label">{label}</span>
  <div class="switch-options">
    {#each options as option}
      <a class:active={option.active} href={option.href} aria-current={option.active ? 'page' : undefined}>
        {option.label}
      </a>
    {/each}
  </div>
</nav>

<style>
  .locale-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.34rem 0.45rem 0.34rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    color: var(--accent);
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 0.64rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .switch-options {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.2rem;
  }

  .switch-options a {
    padding: 0.24rem 0.42rem;
    border-radius: 999px;
    color: var(--fg-3);
    text-decoration: none;
  }

  .switch-options a.active,
  .switch-options a:hover,
  .switch-options a:focus-visible {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.04);
    outline: none;
  }

  .switch-label {
    color: var(--fg-3);
  }
</style>
