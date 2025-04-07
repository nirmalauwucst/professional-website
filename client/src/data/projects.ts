export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  category: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description: "A comprehensive dashboard for online store management with real-time analytics, inventory tracking, and order processing.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["React", "Node.js", "MongoDB"],
    githubLink: "#",
    demoLink: "#",
    category: "Web Development"
  },
  {
    id: 2,
    title: "Fitness Tracker App",
    description: "Mobile application for tracking workouts, nutrition, and health metrics with personalized recommendations.",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["React Native", "Firebase", "GraphQL"],
    githubLink: "#",
    demoLink: "#",
    category: "Mobile Apps"
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "Platform that uses machine learning to generate blog posts, social media content, and marketing copy.",
    image: "https://images.unsplash.com/photo-1548094878-84ced0f6896d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["Python", "TensorFlow", "FastAPI"],
    githubLink: "#",
    demoLink: "#",
    category: "AI/ML"
  },
  {
    id: 4,
    title: "Educational Platform",
    description: "Online learning platform with interactive courses, quizzes, and a community forum for students and educators.",
    image: "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["Vue.js", "Laravel", "MySQL"],
    githubLink: "#",
    demoLink: "#",
    category: "Web Development"
  },
  {
    id: 5,
    title: "Team Collaboration Tool",
    description: "Real-time collaboration platform for remote teams with project management, chat, and file sharing capabilities.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["React", "Express", "Socket.io"],
    githubLink: "#",
    demoLink: "#",
    category: "Web Development"
  },
  {
    id: 6,
    title: "Smart Home App",
    description: "Mobile application for controlling smart home devices with automation features and energy consumption tracking.",
    image: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["Flutter", "IoT", "AWS"],
    githubLink: "#",
    demoLink: "#",
    category: "Mobile Apps"
  }
];

export const categories = [
  "All",
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "AI/ML"
];
