import type { PageServerLoad } from './$types';
import { getHomeCopy, resolveLocale } from '$lib/content';
import { getAllNotes, formatNoteDate } from '$lib/notes';
import { getLocaleHref } from '$lib/locale';

export const load: PageServerLoad = async ({ url }) => {
  const locale = resolveLocale(url.hostname);
  return {
    locale,
    copy: await getHomeCopy(locale),
    notes: (await getAllNotes(locale)).slice(0, 4).map((note) => ({ ...note, dateLabel: formatNoteDate(note.date) })),
    alternateHref: getLocaleHref(locale, `${url.pathname}${url.search}`),
  };
};
