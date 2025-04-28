// types.ts
export interface Project {
    name: string;
    description: string;
    repositories: string[];
    technologies: string;
    images: string[];
  }
  
  export interface SkillCategory {
    [category: string]: string[];
  }
  
  export interface Experience {
    Company?: string;
    Title?: string;
    Dates?: string;
    Description?: string[];
    company?: string;
    title?: string;
    dates?: string;
    description?: string[];
  }
  
  export interface Education {
    Dates?: string;
    Degree?: string;
    Institution?: string;
    dates?: string;
    degree?: string;
    institution?: string;
  }
  
  export interface Achievement {
    Area?: string;
    Description?: string;
    area?: string;
    description?: string;
  }