export function getCommsBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  const host = window.location.host;

  if (host.includes('rbxsystems.ch')) {
    return 'https://api.comms.rbxsystems.ch';
  }

  if (host.includes('rbx.ia.br')) {
    return 'https://api.comms.rbx.ia.br';
  }

  return import.meta.env?.VITE_COMMS_BASE_URL ?? 'http://localhost:8080';
}
