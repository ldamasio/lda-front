// [lang]/page.tsx
import { getDictionary } from './dictionaries-server'
import styles from './page.module.css';
import { NavMenu } from '../components/NavigationMenu';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  // const s = await getSkills();
  return {
    title: t.meta.title,
    description: t.meta.desc,
    menu: t.meta.menu,
    tabs: t.meta.tabs,
    // skills: s.skills
  };
}

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);

  return (
    <div className={styles.container}>
      <div className={styles.main}>

        <NavMenu lang={lang} dictionary={t} />

        <header className="max-w-3xl mb-12">
          <h1 className={styles.title}>{t.meta.title}</h1>
          <div className={styles.description}>
            {t.meta.desc.map((p: string, i: number) => (
              <p key={i} className="mb-6 text-lg leading-relaxed">{p}</p>
            ))}
          </div>
        </header>
      </div>
    </div>
  );
}

