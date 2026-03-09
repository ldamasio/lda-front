import { getDictionary } from '../dictionaries-server'
import { NavMenu } from '../../components/NavigationMenu'
import { Mail, Github, Linkedin, MapPin, Send } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);
  return {
    title: `${t.meta.title} - Contact`,
    description: t.aboutMe.desc,
  };
}

export default async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  const t = await getDictionary(lang);

  const contactLinks = [
    {
      name: 'Email',
      value: 'ldamasio@gmail.com',
      href: 'mailto:ldamasio@gmail.com',
      icon: <Mail className="w-5 h-5" />,
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/ldamasio',
      href: 'https://www.linkedin.com/in/ldamasio/',
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: 'GitHub',
      value: 'github.com/ldamasio',
      href: 'https://github.com/ldamasio',
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: 'Location',
      value: t.curriculum.location,
      icon: <MapPin className="w-5 h-5" />,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <NavMenu lang={lang} dictionary={t} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
            {lang === 'it' ? 'Contatti' : 
             lang === 'pt' ? 'Contato' : 
             lang === 'es' ? 'Contacto' : 
             lang === 'de' ? 'Kontakt' : 
             lang === 'fr' ? 'Contact' : 
             'Contact'
            }
        </h1>
        
        <p className="text-lg mb-12 text-center text-muted-foreground">
            {lang === 'it' ? 'Sempre aperto a nuove opportunità, collaborazioni o discussioni interessanti sull\'IA e sull\'ingegneria del software.' : 
             lang === 'pt' ? 'Sempre aberto a novas oportunidades, colaborações ou discussões interessantes sobre IA e engenharia de software.' : 
             'Always open to new opportunities, collaborations, or interesting discussions about AI and software engineering.'
            }
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {contactLinks.map((link, index) => (
              <Card key={index} className="glass-institutional hover:bg-accent/50 transition-all active:scale-[0.98]">
                <CardHeader className="flex flex-row items-center space-y-0 gap-4 p-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {link.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {link.name}
                    </CardTitle>
                    {link.href ? (
                      <a href={link.href} className="text-lg font-semibold hover:underline">
                        {link.value}
                      </a>
                    ) : (
                      <span className="text-lg font-semibold">
                        {link.value}
                      </span>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="glass-institutional">
            <CardHeader>
              <CardTitle>
                {lang === 'it' ? 'Mandami un messaggio' : 'Send a Message'}
              </CardTitle>
              <CardDescription>
                {lang === 'it' ? 'Puoi contattarmi direttamente via email.' : 'You can reach out to me directly via email.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-accent/50 rounded-full flex items-center justify-center mb-6">
                <Send className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <Button asChild size="lg" className="rounded-full px-8">
                <a href="mailto:ldamasio@gmail.com">
                   {lang === 'it' ? 'Invia Email' : 'Send Email'}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
