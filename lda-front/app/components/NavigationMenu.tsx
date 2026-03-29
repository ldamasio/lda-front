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
import { usePathname } from "next/navigation";

interface Dictionary {
  meta: {
    menu: {
      aboutMe: string,
      skills: string,
      curriculumVitae: string,
      portfolio: string,
      biography: string,
      works: string,
      honors: string
    }
  }
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
  const pathname = usePathname();

  const components = t.portfolio.highlights.map((project) => ({
    title: project.name,
    href: project.repositories[0],
    description: project.description,
  }));

  return (
    <NavigationMenu className="mb-8">
      <NavigationMenuList className="flex flex-col w-full md:flex-row gap-2 md:gap-0">

        <NavigationMenuItem>
          <Link href={`/${lang}/`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>


        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t.meta.menu.aboutMe}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href={`/${lang}/skills`} title={`${t.meta.menu.skills}`}>
                {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/cv`} title={`${t.meta.menu.curriculumVitae}`}>
                {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/portfolio`} title={`${t.meta.menu.portfolio}`}>
                {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/biography`} title={`${t.meta.menu.biography}`}>
                {t.curriculum.location}
              </ListItem>
              <ListItem href={`/${lang}/works`} title={`${t.meta.menu.works}`}>
                {t.aboutMe.desc}
              </ListItem>
              <ListItem href={`/${lang}/honors`} title={`${t.meta.menu.honors}`}>
                {t.aboutMe.desc}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>



        <NavigationMenuItem>
          <NavigationMenuTrigger>{t.meta.menu.portfolio}</NavigationMenuTrigger>
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
          <Link href={`/${lang}/cv`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t.meta.menu.curriculumVitae}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`/${lang}/contact`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact
              </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <LanguageSelect currentPath={pathname} />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  const isExternal = href?.startsWith('http');

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
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