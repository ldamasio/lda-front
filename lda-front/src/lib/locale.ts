export type Locale = 'pt-BR' | 'en';

const LOCALE_ORIGINS: Record<Locale, string> = {
  'pt-BR': 'https://leandrodamasio.rbx.ia.br',
  en: 'https://leandrodamasio.rbxsystems.ch',
};

export function alternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'pt-BR' : 'en';
}

export function getLocaleHref(locale: Locale, pathname: string): string {
  const targetLocale = alternateLocale(locale);
  return `${LOCALE_ORIGINS[targetLocale]}${pathname}`;
}
