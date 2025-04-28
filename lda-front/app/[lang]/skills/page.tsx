import { getDictionary } from '../dictionaries-server'
import { getSkills } from '../skills-server'
import { NavMenu } from '../../components/NavigationMenu'
import { 
  Code, 
  Database, 
  Server, 
  Cloud, 
  Brain, 
  CpuIcon
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: `${t.meta.title} - Skills`,
    description: t.meta.desc,
  };
}

export default async function SkillsPage({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  const skillsFunc = await getSkills();
  const skillsData = await skillsFunc().then(module => module.skills);
  
  // Map of skill categories to their respective icons
  const categoryIcons: Record<string, React.ReactNode> = {
    languages: <Code className="w-6 h-6 text-primary" />,
    fullStackDevelopment: <CpuIcon className="w-6 h-6 text-primary" />,
    devOps: <Server className="w-6 h-6 text-primary" />,
    cloud: <Cloud className="w-6 h-6 text-primary" />,
    data: <Database className="w-6 h-6 text-primary" />,
    AIML: <Brain className="w-6 h-6 text-primary" />,
    softwareArchitecture: <CpuIcon className="w-6 h-6 text-primary" />,
    observability: <Server className="w-6 h-6 text-primary" />
  };
  
  // Helper function to format category name
  const formatCategoryName = (category: string) => {
    switch(category) {
      case 'AIML':
        return 'AI & Machine Learning';
      default:
        return category
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NavMenu lang={lang} dictionary={t} />
      
      <h1 className="text-4xl font-bold mb-8 text-center">
        {t.meta.skillsTitle || 'Technical Skills'}
      </h1>
      
      <p className="text-lg mb-12 text-center max-w-3xl mx-auto">
        {t.meta.skillsDescription || 'A comprehensive overview of my technical expertise and proficiency across various domains.'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(skillsData).map(([category, skillList]) => (
          <Card key={category} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categoryIcons[category] || <Code className="w-6 h-6 text-primary" />}
                {formatCategoryName(category)}
              </CardTitle>
              <CardDescription>
                {t.skills?.[category]?.description || `${Array.isArray(skillList) ? skillList.length : 0} ${formatCategoryName(category)} skills`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(skillList) && skillList.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
