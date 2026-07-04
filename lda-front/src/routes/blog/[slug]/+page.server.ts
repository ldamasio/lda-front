import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getHomeCopy, resolveLocale } from '$lib/content';
import { getNote, formatNoteDate } from '$lib/notes';
import { getLocaleHref } from '$lib/locale';

export const load: PageServerLoad = async ({ params, url }) => {
  const locale = resolveLocale(url.hostname);
  const note = await getNote(params.slug, locale);

  if (!note) {
    throw error(404, 'Not found');
  }

  return {
    locale,
    copy: getHomeCopy(locale),
    note: {
      ...note,
      dateLabel: formatNoteDate(note.date),
    },
    alternateHref: getLocaleHref(locale, `${url.pathname}${url.search}`),
  };
};
