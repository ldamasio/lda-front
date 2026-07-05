<script lang="ts">
  import { onMount } from 'svelte';
  import AltchaWidget from './AltchaWidget.svelte';
  import { getCommsBaseUrl } from './comms';
  import type { HomeCopy } from './content';

  type Status = 'idle' | 'submitting' | 'success' | 'error';

  export let labels: HomeCopy['contact']['form'];
  export let ui: HomeCopy['ui'];
  export let locale: HomeCopy['locale'];
  export let title: string;
  export let note: string;

  let name = '';
  let email = '';
  let phone = '';
  let message = '';
  let whatsappOptIn = false;
  let website = '';
  let status: Status = 'idle';
  let errorText = '';
  let altchaPayload: string | null = null;
  let commsBase = '';
  let challengeUrl = '/api/altcha-challenge';

  onMount(() => {
    commsBase = getCommsBaseUrl();
    challengeUrl = commsBase ? `${commsBase}/api/altcha-challenge` : '/api/altcha-challenge';
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!altchaPayload) {
      status = 'error';
      errorText = 'Verify the anti-abuse challenge first.';
      return;
    }

    status = 'submitting';
    errorText = '';

    try {
      const res = await fetch(`${commsBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email: email || '',
          phone: phone || undefined,
          message,
          whatsapp_opt_in: whatsappOptIn,
          source: 'site',
          language: locale,
          altcha: altchaPayload,
          website
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      status = 'success';
      name = '';
      email = '';
      phone = '';
      message = '';
      whatsappOptIn = false;
      website = '';
      altchaPayload = null;
    } catch {
      status = 'error';
      errorText = labels.error;
    }
  }
</script>

<section class="contact-shell" aria-busy={status === "submitting"}>
  {#if status === "submitting"}
    <div class="freeze-overlay" role="status" aria-live="polite" aria-label={ui.altchaLoading}>
      <div class="freeze-panel">
        <p class="eyebrow">{title}</p>
        <h3>{ui.altchaLoading}</h3>
        <p>{labels.submitting}</p>
      </div>
    </div>
  {/if}
  <div class="contact-copy">
    <p class="eyebrow">{title}</p>
    <h3>{note}</h3>
    <p>{labels.submit}</p>
    <p class="note">{ui.altchaPrompt}</p>
  </div>

  {#if status === 'success'}
    <div class="form-card form-success">
      <p>{labels.success}</p>
      <button type="button" class="ghost" on:click={() => (status = 'idle')}>{ui.sendAnother}</button>
    </div>
  {:else}
    <form class="form-card" on:submit|preventDefault={handleSubmit}>
      <fieldset class="form-fieldset" disabled={status === 'submitting'}>
        <input class="honeypot" aria-hidden="true" tabindex="-1" autocomplete="off" bind:value={website} />

        <div class="row">
          <label>
            <span>{labels.name}</span>
            <input bind:value={name} placeholder={labels.namePlaceholder} required />
          </label>
          <label>
            <span>{labels.email}</span>
            <input bind:value={email} placeholder={labels.emailPlaceholder} />
          </label>
        </div>

        <label>
          <span>{labels.phone}</span>
          <input bind:value={phone} placeholder={labels.phonePlaceholder} />
        </label>

        <label>
          <span>{labels.message}</span>
          <textarea bind:value={message} placeholder={labels.messagePlaceholder} rows="5" required></textarea>
        </label>

        <label class="checkbox-row">
          <input type="checkbox" bind:checked={whatsappOptIn} />
          <span>{labels.whatsappOptIn}</span>
        </label>

        <div class="challenge-row">
          <AltchaWidget challengeurl={challengeUrl} ui={ui} onstatechange={(payload) => (altchaPayload = payload)} />
          <p>{labels.submit}</p>
        </div>

        {#if status === 'error'}
          <p class="error" role="alert">{errorText}</p>
        {/if}

        <button class="submit" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? labels.submitting : labels.submit}
        </button>
      </fieldset>
    </form>
  {/if}
</section>

<style>
  .contact-shell {
    display: grid;
    gap: 1rem;
  }

  .contact-copy {
    max-width: 42rem;
  }

  .contact-copy h3 {
    margin: 0.35rem 0 0.55rem;
    font-size: clamp(1.05rem, 1.8vw, 1.35rem);
    font-weight: 400;
    line-height: 1.3;
    color: var(--fg);
  }

  .contact-copy p {
    margin: 0;
    color: var(--fg-2);
    max-width: 38rem;
  }

  .contact-copy .note {
    margin-top: 0.75rem;
    color: var(--fg-3);
    font-size: 0.8rem;
  }

  .form-card {
    display: grid;
    gap: 0.9rem;
    padding: 1rem;
    border: 1px solid var(--line);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.02);
  }

  .form-fieldset {
    display: grid;
    gap: 0.9rem;
    padding: 0;
    margin: 0;
    border: 0;
    min-width: 0;
  }

  .form-fieldset:disabled {
    opacity: 0.72;
  }

  .freeze-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(5, 5, 7, 0.68);
    backdrop-filter: blur(10px);
  }

  .freeze-panel {
    width: min(32rem, 100%);
    padding: 1.1rem 1.2rem;
    border: 1px solid var(--line-strong);
    border-radius: 1rem;
    background: rgba(10, 10, 11, 0.96);
    box-shadow: var(--shadow);
  }

  .freeze-panel h3 {
    margin: 0.25rem 0 0.35rem;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--fg);
  }

  .freeze-panel p {
    margin: 0;
    color: var(--fg-2);
    font-size: 0.9rem;
  }

  .form-success {
    align-items: start;
  }

  .row {
    display: grid;
    gap: 0.9rem;
  }

  label {
    display: grid;
    gap: 0.35rem;
    color: var(--fg-2);
    font-size: 0.84rem;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 0.6rem;
    background: rgba(255, 255, 255, 0.02);
    color: var(--fg);
    padding: 0.8rem 0.9rem;
    font: inherit;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--fg-3);
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .checkbox-row input {
    width: 1rem;
    height: 1rem;
    padding: 0;
    accent-color: var(--accent);
  }

  .challenge-row {
    display: grid;
    gap: 0.5rem;
  }

  .challenge-row p {
    margin: 0;
    color: var(--fg-3);
    font-size: 0.8rem;
  }

  .submit,
  .ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-height: 2.55rem;
    padding: 0.68rem 0.95rem;
    border-radius: 0.55rem;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.02);
    color: var(--fg);
    font-size: 0.82rem;
  }

  .submit:hover,
  .ghost:hover {
    border-color: var(--accent);
  }

  .submit:disabled {
    opacity: 0.55;
    cursor: wait;
  }

  .error {
    margin: 0;
    color: #d58a8a;
    font-size: 0.82rem;
  }

  .honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .row {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
