export type Locale = 'pt-BR' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'zh';

export const SUPPORTED_LOCALES: readonly Locale[] = ['pt-BR', 'en', 'de', 'es', 'fr', 'it', 'zh'];

const ROOT_ORIGINS: Record<'pt-BR' | 'en', string> = {
  'pt-BR': 'https://leandrodamasio.rbx.ia.br',
  en: 'https://leandrodamasio.rbxsystems.ch',
};

const ROUTE_SEGMENTS: Record<Locale, string | null> = {
  'pt-BR': 'pt',
  en: 'en',
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  zh: 'zh',
};

const LOCALE_LABELS: Record<Locale, string> = {
  'pt-BR': 'PT-BR',
  en: 'EN',
  de: 'DE',
  es: 'ES',
  fr: 'FR',
  it: 'IT',
  zh: 'ZH',
};

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isRouteLocaleSegment(routeLocale?: string | null): boolean {
  if (!routeLocale) return false;
  if (routeLocale === 'pt') return true;
  return isLocale(routeLocale);
}

function normalizeRouteLocale(routeLocale?: string | null): Locale | null {
  if (!routeLocale) return null;
  if (routeLocale === 'pt') return 'pt-BR';
  return isLocale(routeLocale) ? routeLocale : null;
}

export function getLocalePathSegment(locale: Locale): string | null {
  return ROUTE_SEGMENTS[locale];
}

function stripLocalePrefix(pathname: string): string {
  const cleaned = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = cleaned.split('/').filter(Boolean);
  if (segments.length === 0) return '/';

  const normalized = normalizeRouteLocale(segments[0]);
  if (!normalized || ROUTE_SEGMENTS[normalized] === null) {
    return cleaned;
  }

  const rest = `/${segments.slice(1).join('/')}`;
  return rest === '/' ? '/' : rest;
}

export function resolveLocale(hostname: string, routeLocale?: string | null): Locale {
  const normalizedRouteLocale = normalizeRouteLocale(routeLocale);
  if (normalizedRouteLocale) {
    return normalizedRouteLocale;
  }

  return hostname.endsWith('.ch') ? 'en' : 'pt-BR';
}

export function getLocaleHref(locale: Locale, pathname: string): string {
  const origin = ROOT_ORIGINS[locale === 'en' ? 'en' : 'pt-BR'];
  const cleanPath = stripLocalePrefix(pathname);
  const segment = ROUTE_SEGMENTS[locale];
  const localizedPath = segment ? `/${segment}${cleanPath === '/' ? '' : cleanPath}` : cleanPath;
  return `${origin}${localizedPath}`;
}

export function getLocaleOptions(currentLocale: Locale, pathname: string) {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    label: LOCALE_LABELS[locale],
    href: getLocaleHref(locale, pathname),
    active: locale === currentLocale,
  }));
}
