import { getDictionary } from './dictionaries';


export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  // console.log(t);
  return (
    <>
      <div>
        <p className="">
          {t.home.title}
        </p>
        {t.home.desc}
      </div>

    </>
  );
}
