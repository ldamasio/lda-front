import type { PageServerLoad } from './$types';
import { getBlogPosts, getHomeCopy, resolveLocale } from '$lib/content';
import { getLocaleHref } from '$lib/locale';

export const load: PageServerLoad = async ({ url }) => {
  const locale = resolveLocale(url.hostname);
  return {
    locale,
    copy: getHomeCopy(locale),
    posts: getBlogPosts(locale),
    alternateHref: getLocaleHref(locale, `${url.pathname}${url.search}`),
  };
};
