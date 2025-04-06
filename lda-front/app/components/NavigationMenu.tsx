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
  home: {
    highlights: {
      [key: string]: {
        name: string;
        link: string;
        description: string;
      };
    };
  };
  curriculum: {
    skills: {
      Languages: string[];
    };
    headline: string;
    resume: string;
    location: string;
    values: string;
  };
  "aboutMe": {
    visualSkills: string;
    photo: string;
    desc: string;
    bio: string;
    values: string;
    title: string;
  };
  contact: {
    title: string;
    desc: string;
  };
}

export function NavMenu({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  const t = dictionary;

  const components = [
    {
      title: t.home.highlights["project01"].name,
      href: t.home.highlights["project01"].link,
      description: t.home.highlights["project01"].description,
    },
    {
      title: t.home.highlights["project02"].name,
      href: t.home.highlights["project02"].link,
      description: t.home.highlights["project02"].description,
    },
    {
      title: t.home.highlights["project03"].name,
      href: t.home.highlights["project03"].link,
      description: t.home.highlights["project03"].description,
    },
    {
      title: t.home.highlights["project04"].name,
      href: t.home.highlights["project04"].link,
      description: t.home.highlights["project04"].description,
    },
    {
      title: t.home.highlights["project05"].name,
      href: t.home.highlights["project05"].link,
      description: t.home.highlights["project05"].description,
    },
    {
      title: t.home.highlights["project06"].name,
      href: t.home.highlights["project06"].link,
      description: t.home.highlights["project06"].description,
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
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {t["aboutMe"].photo}
                    </div> 
                    <p className="text-sm leading-tight text-muted-foreground">
                      {t["aboutMe"].visualSkills}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/about-me" title={t["aboutMe"].title}>
                {t["aboutMe"].values}
              </ListItem>
              <ListItem href="/cv" title={t.curriculum.headline}>
                {t.curriculum.location}
              </ListItem>
              <ListItem href="/contact" title={t.contact.title}>
                {t.contact.desc}
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
          <Link href="/articles" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {lang === 'pt' ? 'Artigos' : 'Articles'}
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