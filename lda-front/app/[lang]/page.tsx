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
      <div className="p-4 md:p-6 lg:p-8">
        <p className="">
          {t.home.title}
        </p>
        {t.home.desc}
      </div>

    </>
  );
}
