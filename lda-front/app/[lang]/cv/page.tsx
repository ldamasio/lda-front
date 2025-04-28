import { getDictionary } from '../dictionaries-server';
import styles from '../page.module.css';
import { Experience, Education, Achievement } from '../types';
import { NavMenu } from '../../components/NavigationMenu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Award, BookOpen, Brain, Briefcase, Download, Link, University, Code, Database, Server, Cloud, CpuIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import common from '../common.json';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: `${t.curriculum.name} - Curriculum Vitae`,
    description: t.curriculum.headline,
  };
}

export default async function CV({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <NavMenu lang={lang} dictionary={t} />

        <div className="flex justify-between items-center w-full mb-6">
          <h1 className="text-3xl font-bold">Curriculum Vitae</h1>
          {t.meta.links.cvPdfLink && (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <a href={t.meta.links.cvPdfLink} target="_blank" rel="noopener noreferrer">
                Download PDF
              </a>
            </Button>
          )}
        </div>

        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t.curriculum.name}</CardTitle>
            <CardDescription className="text-lg">{t.curriculum.headline}</CardDescription>
            <CardDescription>{t.curriculum.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{t.curriculum.resume}</p>
          </CardContent>
        </Card>

        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Brain className="w-6 h-6 text-primary" />
            Habilidades
          </h2>
          <div className="flex flex-wrap gap-2">
            {t.curriculum.skills.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            Experiência Profissional
          </h2>
          {(t.curriculum.ProfessionalExperience || t.curriculum.professionalExperience)?.map((experience: Experience, index: number) => (
            <Card key={index} className="w-full mb-4">
              <CardHeader>
                <CardTitle>
                  {experience.Company || experience.company} - {experience.Title || experience.title}
                </CardTitle>
                <CardDescription className="italic">
                  {experience.Dates || experience.dates}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {(experience.Description || experience.description)?.map((desc, i) => (
                    <li key={i} className="text-gray-700">
                      {desc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <University className="w-6 h-6 text-primary" />
            Educação
          </h2>
          {(t.curriculum.Education || t.curriculum.education)?.map((education: Education, index: number) => (
            <Card key={index} className="w-full mb-4">
              <CardHeader>
                <CardTitle>
                  {education.Degree || education.degree}
                </CardTitle>
                <CardDescription>
                  {education.Institution || education.institution} • {education.Dates || education.dates}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        {(t.curriculum.languages && t.curriculum.languages.length > 0) && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              Idiomas
            </h2>
            <div className="flex flex-wrap gap-2">
              {t.curriculum.languages.map((language: string, index: number) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                  {language}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Award className="w-6 h-6 text-primary" />
            Conquistas Principais
          </h2>
          {(t.curriculum.KeyAchievements || t.curriculum.keyAchievements)?.map((achievement: Achievement, index: number) => (
            <Card key={index} className="w-full mb-4">
              <CardHeader>
                <CardTitle>
                  {achievement.Area || achievement.area}
                </CardTitle>
                <CardContent className="pt-4">
                  <p className="text-gray-700">
                    {achievement.Description || achievement.description}
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </section>

        {(t.honors && t.honors.length > 0) && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <Award className="w-6 h-6 text-primary" />
              Honras e Prêmios
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc pl-5 space-y-2">
                  {t.honors.map((honor: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {honor}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Habilidades Detalhadas */}
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Brain className="w-6 h-6 text-primary" />
            Habilidades Detalhadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(common.skills).map(([category, skills]) => {
              // Ícones para categorias
              const categoryIcons: Record<string, React.ReactNode> = {
                languages: <Code className="w-5 h-5 text-primary" />,
                fullStackDevelopment: <CpuIcon className="w-5 h-5 text-primary" />,
                devOps: <Server className="w-5 h-5 text-primary" />,
                cloud: <Cloud className="w-5 h-5 text-primary" />,
                data: <Database className="w-5 h-5 text-primary" />,
                AIML: <Brain className="w-5 h-5 text-primary" />,
                softwareArchitecture: <CpuIcon className="w-5 h-5 text-primary" />,
                observability: <Server className="w-5 h-5 text-primary" />
              };
              // Estrutura para ícones de skills individuais (pode ser expandida)
              const skillIcons: Record<string, React.ReactNode> = {
                Python: <Code className="w-4 h-4 text-blue-500" />, // Exemplo
                // Adicione mais skills e ícones conforme desejado
              };
              return (
                <div key={category}>
                  <h3 className="font-semibold mb-2 capitalize flex items-center gap-2">
                    {categoryIcons[category] || <Code className="w-5 h-5 text-primary" />}
                    {category.replace(/([A-Z])/g, ' $1')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(skills as string[]).map((skill, idx) => (
                      <Card key={idx} className="px-3 py-1 rounded-md shadow-sm bg-gray-50 border border-gray-200 text-sm flex items-center gap-2">
                        {skillIcons[skill]}
                        <span>{skill}</span>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {(t.works && t.works.length > 0) && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
              Trabalhos Adicionais
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc pl-5 space-y-2">
                  {t.works.map((work: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {work}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="flex justify-center mt-6">
          <div className="flex space-x-4">
            {t.meta.links.github && (
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                <a href={t.meta.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            )}
            {t.meta.links.linkedin && (
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                <a href={t.meta.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            )}
            {t.meta.links.email && (
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                <a href={`mailto:${t.meta.links.email}`}>
                  Email
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
