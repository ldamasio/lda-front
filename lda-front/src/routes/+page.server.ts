import type { PageServerLoad } from './$types';
import { getCopy, resolveLocale } from '$lib/site';

export const load: PageServerLoad = async ({ url }) => {
  const locale = resolveLocale(url.hostname);
  return {
    locale,
    copy: getCopy(locale),
  };
};
