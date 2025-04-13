// types.ts
export interface Project {
    name: string;
    description: string;
    link: string;
    technologies: string;
    images: string[];
  }
  
  export interface SkillCategory {
    [category: string]: string[];
  }
  
  export interface Experience {
    Company: string;
    Title: string;
    Dates: string;
    Description: string[];
  }
  
  export interface Education {
    Dates: string;
    Degree: string;
    Institution: string;
  }
  
  export interface Achievement {
    Area: string;
    Description: string;
  }