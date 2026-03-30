import { getDictionary } from '../dictionaries-server'
import { NavMenu } from '../../components/NavigationMenu'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { Project } from '../types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: `${t.meta.title} - Portfolio`,
    description: t.meta.desc,
  };
}

export default async function PortfolioPage({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  const projects = t.portfolio.highlights as Project[];

  return (
    <div className="container mx-auto px-4 py-8">
      <NavMenu lang={lang} dictionary={t} />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {t.meta.menu.portfolio}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {lang === 'it' ? 'Una selezione di sistemi di IA ed evoluzioni di software architettura.' : 
                 lang === 'pt' ? 'Uma seleção de sistemas de IA e evoluções de arquitetura de software.' : 
                 'A selection of AI systems and software architecture evolutions.'}
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="glass-institutional group flex flex-col h-full overflow-hidden hover:border-primary/50 transition-all duration-300">
              {project.images && project.images[0] && (
                <div className="relative h-48 w-full overflow-hidden border-b border-border bg-muted">
                  <Image 
                    src={project.images[0]} 
                    alt={project.name}
                    width={800}
                    height={400}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
                    <div className="flex gap-2">
                        {project.repositories.map((repo, i) => (
                            <a 
                                key={i} 
                                href={repo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-accent/50 hover:bg-accent text-primary transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.split(',').map((tech, i) => (
                    <Badge key={i} variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-[10px] uppercase tracking-wider font-semibold border-none">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto border-t border-border/50 bg-accent/10">
                 <a 
                    href={project.repositories[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                 >
                    {lang === 'pt' ? 'Ver Repositório' : lang === 'it' ? 'Vedi Repository' : 'View Repository'} 
                    <ExternalLink className="w-4 h-4" />
                 </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
