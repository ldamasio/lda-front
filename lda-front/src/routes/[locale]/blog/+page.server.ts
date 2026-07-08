import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getHomeCopy, resolveLocale } from '$lib/content';
import { getAllNotes, formatNoteDate } from '$lib/notes';
import { getLocaleOptions, isRouteLocaleSegment } from '$lib/locale';

export const load: PageServerLoad = async ({ params, url }) => {
  if (!isRouteLocaleSegment(params.locale)) {
    throw error(404, 'Not found');
  }

  const locale = resolveLocale(url.hostname, params.locale);
  return {
    locale,
    copy: await getHomeCopy(locale),
    notes: (await getAllNotes(locale)).map((note) => ({ ...note, dateLabel: formatNoteDate(note.date) })),
    localeOptions: getLocaleOptions(locale, `${url.pathname}${url.search}`),
  };
};
