import { getDictionary } from './dictionaries-server'
import styles from './page.module.css';
import { Project, SkillCategory, Experience, Education, Achievement } from './types';
import { NavMenu } from '../components/NavigationMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Award, BookOpen, Brain, Briefcase, Code, Link, University } from "lucide-react";

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
        <p className={styles.description}>
          {t.home.introduction}
        </p>

        <Tabs defaultValue="projects" className="w-[100%]">
          <TabsList>
            <TabsTrigger value="projects">Projetos Destacados</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="cv">Currículo</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <section className={styles.projects}>
              <h2 className="flex items-center gap-2 text-xl font-bold pb-4">
                <Code className="w-6 h-6 text-primary" />
                Projetos Destacados
              </h2>
              <div>
                {Object.entries(t.home.highlights).map(([key, project]) => (
                  <Card className={styles.projectCard} key={key}>
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
            <section className={styles.links}>
              <h2 className="flex items-center gap-2 text-xl font-bold pb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                Currículo
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>{t.curriculum.name}</CardTitle>
                  <CardDescription>{t.curriculum.headline}</CardDescription>
                  <CardDescription>{t.curriculum.location}</CardDescription>
                </CardHeader>
              </Card>
              <div className={styles.curriculumDetails}>
                <p className="p-4 text-sm text-muted-foreground">{t.curriculum.resume}</p>

                <h4 className="mt-4 font-bold flex items-center gap-2">
                  <Brain className="w-6 h-6 text-primary" />
                  Habilidades
                </h4>
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

                <h4 className="mt-4 font-bold flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Experiência Profissional
                </h4>
                {t.curriculum.ProfessionalExperience.map((experience: Experience, index: number) => (
                  <Card key={index} className="w-[100%] mt-4 p-4">
                    <CardTitle>
                      {experience.Company} - {experience.Title}
                    </CardTitle>
                    <p className="p-4 italic text-sm text-muted-foreground">{experience.Dates}</p>
                    <CardDescription className="p-4 flex flex-wrap gap-4">
                      {experience.Description.map((desc, i) => (
                        <p key={i}>
                          {desc}
                        </p>
                      ))}
                    </CardDescription>
                  </Card>
                ))}

                <h4 className="mt-4 font-bold flex items-center gap-2">
                  <University className="w-6 h-6 text-primary" />
                  Educação
                </h4>
                {t.curriculum.Education.map((education: Education, index: number) => (
                  <Card key={index} className="w-[100%] mt-4 p-4">
                    <CardTitle>
                      {education.Degree}
                    </CardTitle>
                    <CardDescription className="p-4 flex flex-wrap gap-4">
                      {education.Institution} + {education.Dates}
                    </CardDescription>
                  </Card>
                ))}

                <h4 className="mt-4 font-bold flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Conquistas Principais
                </h4>
                {t.curriculum.KeyAchievements.map((achievement: Achievement, index: number) => (
                  <Card key={index} className="w-[100%] mt-4 p-4">
                    <CardTitle>
                      {achievement.Area}
                    </CardTitle>
                    <CardDescription className="p-4 flex flex-wrap gap-4">
                      {achievement.Description}
                    </CardDescription>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
