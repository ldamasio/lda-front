import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBlogPost, getHomeCopy, resolveLocale } from '$lib/content';
import { getLocaleHref } from '$lib/locale';

export const load: PageServerLoad = async ({ params, url }) => {
  const locale = resolveLocale(url.hostname);
  const post = getBlogPost(locale, params.slug);

  if (!post) {
    throw error(404, 'Not found');
  }

  return {
    locale,
    copy: getHomeCopy(locale),
    post,
    alternateHref: getLocaleHref(locale, `${url.pathname}${url.search}`),
  };
};
