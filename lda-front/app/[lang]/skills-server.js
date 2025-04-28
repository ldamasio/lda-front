// app/[lang]/dictionaries-server.js
import 'server-only';

const skillsData = {
  skills: () => import('./common.json').then((module) => module.default)
};

export const getSkills = async () => {
  return skillsData.skills;
};