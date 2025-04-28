"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import LanguageSelect from '@/app/components/LanguageSelect';

interface Dictionary {
  aboutMe: {
    desc: string[];
    bio: string;
    values: string[];
    skills: string[];
  }
  portfolio: {
    highlights: Array<{
      name: string;
      description: string;
      repositories: string[];
      technologies: string;
      images: string[];
    }>;
  },
  curriculum: {
    skills: {
      Languages: string[];
    };
    headline: string;
    resume: string;
    location: string;
    values: string;
  }
}

export function NavMenu({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  const t = dictionary;

  const components = [
    {
      title: t.portfolio.highlights[0].name,
      href: `/${lang}${t.portfolio.highlights[0].repositories[0]}`,
      description: t.portfolio.highlights[0].description,
    },
    {
      title: t.portfolio.highlights[1].name,
      href: `/${lang}${t.portfolio.highlights[1].repositories[0]}`,
      description: t.portfolio.highlights[1].description,
    },
    {
      title: t.portfolio.highlights[2].name,
      href: `/${lang}${t.portfolio.highlights[2].repositories[0]}`,
      description: t.portfolio.highlights[2].description,
    },
    {
      title: t.portfolio.highlights[3].name,
      href: `/${lang}${t.portfolio.highlights[3].repositories[0]}`,
      description: t.portfolio.highlights[3].description,
    },
    {
      title: t.portfolio.highlights[4].name,
      href: `/${lang}${t.portfolio.highlights[4].repositories[0]}`,
      description: t.portfolio.highlights[4].description,
    },
    {
      title: t.portfolio.highlights[5].name,
      href: `/${lang}${t.portfolio.highlights[5].repositories[0]}`,
      description: t.portfolio.highlights[5].description,
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col w-full md:flex-row">




        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {lang === 'pt' ? 'Sobre Mim' : 'About Me'}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href={`/${lang}/skills`} title="Habilidades">
              {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/cv`} title="Currículo">
              {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/about-me`} title="Portfolio">
              {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/cv`} title="Biografia">
                {t.curriculum.location}
              </ListItem>
              <ListItem href={`/${lang}/contact`} title="Trabalhos">
                {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/contact`} title="Honrarias">
                {t.aboutMe.desc}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>



        <NavigationMenuItem>
          <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`/${lang}/articles`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Currículo
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <LanguageSelect />
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"