// スキル設定
export interface Skill {
  name: string;
  icon: string; // Iconifyのアイコン名
  color: {
    bg: string;
    text: string;
  };
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      {
        name: "React",
        icon: "logos:react",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
      {
        name: "JavaScript",
        icon: "logos:javascript",
        color: { bg: "bg-yellow-100", text: "text-yellow-800" },
      },
      {
        name: "TypeScript",
        icon: "logos:typescript-icon",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
      {
        name: "HTML",
        icon: "logos:html-5",
        color: { bg: "bg-orange-100", text: "text-orange-800" },
      },
      {
        name: "CSS",
        icon: "logos:css-3",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
    ],
  },
  {
    title: "Backend",
    skills: [
      {
        name: "Python",
        icon: "logos:python",
        color: { bg: "bg-yellow-100", text: "text-yellow-800" },
      },
      {
        name: "PHP",
        icon: "logos:php",
        color: { bg: "bg-purple-100", text: "text-purple-800" },
      },
      {
        name: "Java",
        icon: "logos:java",
        color: { bg: "bg-red-100", text: "text-red-800" },
      },
      {
        name: "Kotlin",
        icon: "logos:kotlin-icon",
        color: { bg: "bg-purple-100", text: "text-purple-800" },
      },
    ],
  },
  {
    title: "Database",
    skills: [
      {
        name: "MySQL",
        icon: "logos:mysql",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
      {
        name: "PostgreSQL",
        icon: "logos:postgresql",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
    ],
  },
  {
    title: "Tools",
    skills: [
      {
        name: "Git",
        icon: "logos:git-icon",
        color: { bg: "bg-gray-100", text: "text-gray-800" },
      },
      {
        name: "Docker",
        icon: "logos:docker-icon",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
      {
        name: "AWS",
        icon: "logos:aws",
        color: { bg: "bg-orange-100", text: "text-orange-800" },
      },
      {
        name: "WSL2",
        icon: "logos:microsoft-windows",
        color: { bg: "bg-blue-100", text: "text-blue-800" },
      },
    ],
  },
];
