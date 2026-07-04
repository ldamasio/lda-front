<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createAltchaStore } from './altchaStore';

  interface Props {
    challengeurl?: string;
    onstatechange?: (payload: string | null) => void;
    ui: {
      altchaIdle: string;
      altchaLoading: string;
      altchaVerified: string;
      altchaError: string;
      altchaAria: string;
    };
  }

  let { challengeurl = '/api/altcha-challenge', onstatechange, ui }: Props = $props();

  let altchaState = $state<'idle' | 'loading' | 'verified' | 'error'>('idle');
  let errorText = $state<string | null>(null);
  let payload = $state<string | null>(null);
  let verify = async () => {};
  let cleanup = () => {};

  $effect(() => {
    cleanup();

    const store = createAltchaStore(challengeurl);
    const unsubscribeState = store.altchaState.subscribe((value) => {
      altchaState = value;
    });
    const unsubscribeError = store.errorText.subscribe((value) => {
      errorText = value;
    });
    const unsubscribePayload = store.payload.subscribe((value) => {
      payload = value;
      onstatechange?.(value);
    });

    verify = store.verify;
    cleanup = () => {
      unsubscribeState();
      unsubscribeError();
      unsubscribePayload();
    };

    return cleanup;
  });

  onDestroy(() => cleanup());
</script>

<button type="button" class="altcha-box" disabled={altchaState === 'loading'} onclick={() => verify()} aria-label={ui.altchaAria}>
  <span class="checkbox" class:checked={altchaState === 'verified'}>
    {#if altchaState === 'loading'}
      <span class="spinner"></span>
    {:else if altchaState === 'verified'}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    {/if}
  </span>
  <span class="label">
    {#if altchaState === 'verified'}
      {ui.altchaVerified}
    {:else if altchaState === 'loading'}
      {ui.altchaLoading}
    {:else if altchaState === 'error'}
      {errorText ?? ui.altchaError}
    {:else}
      {ui.altchaIdle}
    {/if}
  </span>
</button>

<style>
  .altcha-box {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 0.9rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--line);
    border-radius: 0.6rem;
    color: var(--fg-2);
    font-size: 0.84rem;
    cursor: pointer;
  }

  .altcha-box:disabled {
    cursor: wait;
  }

  .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--line-strong);
    border-radius: 0.25rem;
  }

  .checkbox.checked {
    border-color: var(--accent);
    background: var(--accent);
    color: #0a0a0b;
  }

  .checkbox svg {
    width: 0.7rem;
    height: 0.7rem;
  }

  .spinner {
    width: 0.7rem;
    height: 0.7rem;
    border: 2px solid rgba(255, 255, 255, 0.18);
    border-top-color: var(--accent);
    border-radius: 999px;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
