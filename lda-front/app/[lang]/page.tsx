// [lang]/page.tsx
import { getDictionary } from './dictionaries-server'
import styles from './page.module.css';
import { Project } from './types';
import { NavMenu } from '../components/NavigationMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Code, Link } from "lucide-react";

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: t.meta.title,
    description: t.meta.desc,
    menu: t.meta.menu,
    tabs: t.meta.tabs,
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

        <Tabs defaultValue="projects" className="w-[100%]">
          <TabsList>
            <TabsTrigger value="projects">{t.meta.tabs.featuredProjects}</TabsTrigger>
            <TabsTrigger value="links">{t.meta.tabs.links}</TabsTrigger>
            <TabsTrigger value="cv">{t.meta.menu.curriculumVitae}</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <section className={styles.projects}>
              <h2 className="flex items-center gap-2 text-xl font-bold pb-4">
                <Code className="w-6 h-6 text-primary" />
                {t.meta.tabs.featuredProjects}
              </h2>
              <div>
                {Object.entries(t.portfolio.highlights).map(([key, project]) => (
                  <Card className={styles.projectCard} key={key}>
                    <a href={(project as Project).repositories[0]} target="_blank" rel="noopener noreferrer">
                      <h3>{(project as Project).name}</h3>
                    </a>
                    <p>{(project as Project).description}</p>
                    <p>Tecnologias: {(project as Project).technologies}</p>
                    {(project as Project).images[0] &&
                      <img
                        src={(project as Project).images[0]}
                        alt={(project as Project).name}
                        className={styles.projectImage}
                      />
                    }
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="links">
            <section className={styles.links}>
              <h2 className="flex items-center gap-2 text-xl font-bold pb-4">
                <Link className="w-6 h-6 text-primary" />
                Links
              </h2>
              <div>
                <div className={styles.linkCard}>
                  <a href={t.meta.links.github} target="_blank" rel="noopener noreferrer">
                    <h3>GitHub</h3>
                  </a>
                </div>
                <div className={styles.linkCard}>
                  <a href={t.meta.links.linkedin} target="_blank" rel="noopener noreferrer">
                    <h3>LinkedIn</h3>
                  </a>
                </div>
                <div className={styles.linkCard}>
                  <a href={`mailto:${t.meta.links.email}`}>
                    <h3>Email</h3>
                  </a>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
