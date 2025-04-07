export interface SkillGroup {
  id: string;
  title: string;
  icon: string;
  iconBgColor: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  color: string;
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    icon: "ri-code-s-slash-line",
    iconBgColor: "bg-blue-100",
    skills: [
      { name: "JavaScript", color: "bg-blue-500" },
      { name: "TypeScript", color: "bg-blue-600" },
      { name: "Python", color: "bg-green-500" },
      { name: "Java", color: "bg-red-500" },
      { name: "PHP", color: "bg-purple-500" },
      { name: "Swift", color: "bg-orange-500" },
      { name: "Go", color: "bg-cyan-500" }
    ]
  },
  {
    id: "frameworks",
    title: "Frameworks",
    icon: "ri-stack-line",
    iconBgColor: "bg-green-100",
    skills: [
      { name: "React", color: "bg-blue-400" },
      { name: "Vue.js", color: "bg-green-400" },
      { name: "Angular", color: "bg-red-400" },
      { name: "Next.js", color: "bg-purple-400" },
      { name: "Express", color: "bg-yellow-400" },
      { name: "Django", color: "bg-indigo-400" },
      { name: "Laravel", color: "bg-pink-400" },
      { name: "Flask", color: "bg-blue-300" }
    ]
  },
  {
    id: "tools",
    title: "Tools",
    icon: "ri-tools-fill",
    iconBgColor: "bg-purple-100",
    skills: [
      { name: "Git", color: "bg-gray-600" },
      { name: "Docker", color: "bg-orange-500" },
      { name: "VS Code", color: "bg-blue-500" },
      { name: "Webpack", color: "bg-green-500" },
      { name: "npm/yarn", color: "bg-red-500" },
      { name: "Jira", color: "bg-blue-400" },
      { name: "Figma", color: "bg-purple-500" }
    ]
  },
  {
    id: "platforms",
    title: "Platforms",
    icon: "ri-cloud-line",
    iconBgColor: "bg-yellow-100",
    skills: [
      { name: "AWS", color: "bg-orange-400" },
      { name: "Azure", color: "bg-blue-400" },
      { name: "Google Cloud", color: "bg-red-400" },
      { name: "Heroku", color: "bg-purple-400" },
      { name: "Digital Ocean", color: "bg-blue-500" },
      { name: "Vercel", color: "bg-black" },
      { name: "Netlify", color: "bg-green-500" }
    ]
  }
];
