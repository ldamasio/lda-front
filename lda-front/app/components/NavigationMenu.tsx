"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaceIcon } from '@radix-ui/react-icons'
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
    name: string;
    resume: string;
  };
  "about-me": {
    bio: string;
    desc: string;
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
      title: t.home.highlights["project-01"].name,
      href: t.home.highlights["project-01"].link,
      description: t.home.highlights["project-01"].description,
    },
    {
      title: t.home.highlights["project-02"].name,
      href: t.home.highlights["project-02"].link,
      description: t.home.highlights["project-02"].description,
    },
    {
      title: t.home.highlights["project-03"].name,
      href: t.home.highlights["project-03"].link,
      description: t.home.highlights["project-03"].description,
    },
    {
      title: t.home.highlights["project-04"].name,
      href: t.home.highlights["project-04"].link,
      description: t.home.highlights["project-04"].description,
    },
    {
      title: t.home.highlights["project-05"].name,
      href: t.home.highlights["project-05"].link,
      description: t.home.highlights["project-05"].description,
    },
    {
      title: t.home.highlights["project-06"].name,
      href: t.home.highlights["project-06"].link,
      description: t.home.highlights["project-06"].description,
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
                    <FaceIcon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {t.curriculum.skills.Languages[0]}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {t["about-me"].desc}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title={t["about-me"].bio}>
                {t["about-me"].desc}
              </ListItem>
              <ListItem href="/docs/installation" title={t.curriculum.name}>
                {t.curriculum.resume}
              </ListItem>
              <ListItem href="/docs/primitives/typography" title={t.contact.title}>
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
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Artigos
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