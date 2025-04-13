import { getDictionary } from './dictionaries-server'
import styles from './page.module.css';
import { Project, SkillCategory, Experience, Education, Achievement } from './types';
import { NavMenu } from '../components/NavigationMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
    curriculum: t.page.curriculum,
  };
}

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);

  // console.log('Dictionary in page.tsx:', t);

  return (
    <div className={styles.container}>
      <div className={styles.main}>

        <NavMenu lang={lang} dictionary={t} />

        <h1 className={styles.title}>{t.home.title}</h1>
        <p className={styles.description}>{t.home.introduction}</p>

        <Tabs defaultValue="projects" className="w-[100%]">
          <TabsList>
            <TabsTrigger value="projects">Projetos Destacados</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="cv">Currículo</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <section className={styles.projects}>

              <h2>Projetos Destacados</h2>
              <div>
                {Object.entries(t.home.highlights).map(([key, project]) => (
                  <div className={styles.projectCard} key={key}>
                    <a href={(project as Project).link}>
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
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="links">
            <section className={styles.links}>
              <h2>Links</h2>
              <div>
                <div className={styles.linkCard}>
                  <a href={t.home.links.github}>
                    <h3>GitHub</h3>
                  </a>
                </div>
                <div className={styles.linkCard}>
                  <a href={t.home.links.linkedin}>
                    <h3>LinkedIn</h3>
                  </a>
                </div>
                <div className={styles.linkCard}>
                  <a href={`mailto:${t.home.links.email}`}>
                    <h3>Email</h3>
                  </a>
                </div>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="cv">
            <section className={styles.curriculum}>
              <h2>Currículo</h2>
              <div className={styles.curriculumDetails}>
                <h3>{t.curriculum.name}</h3>
                <p>{t.curriculum.headline}</p>
                <p>{t.curriculum.location}</p>
                <p>{t.curriculum.resume}</p>

                <h4>Habilidades</h4>
                {Object.entries(t.curriculum.skills as SkillCategory).map(([category, skills]) => (
                  <Card key={category} className="w-[100%] mt-4 p-4">
                    <CardTitle>
                      {category}
                    </CardTitle>
                    <CardDescription className="p-4 flex flex-wrap gap-4">
                      {skills.map((skill) => (
                        <p key={skill} className="bg-gray-100 p-2 rounded-md">
                          {skill}
                        </p>
                      ))}
                    </CardDescription>
                  </Card>
                ))}

                <h4>Experiência Profissional</h4>
                {t.curriculum.ProfessionalExperience.map((experience: Experience, index: number) => (
                  <div key={index}>
                    <h5>{experience.Company} - {experience.Title}</h5>
                    <p>{experience.Dates}</p>
                    <ul>
                      {experience.Description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <h4>Educação</h4>
                {t.curriculum.Education.map((education: Education, index: number) => (
                  <div key={index}>
                    <h5>{education.Degree}</h5>
                    <p>{education.Institution}</p>
                  </div>
                ))}

                <h4>Conquistas Principais</h4>
                {t.curriculum.KeyAchievements.map((achievement: Achievement, index: number) => (
                  <div key={index}>
                    <h5>{achievement.Area}</h5>
                    <p>{achievement.Description}</p>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
