import { skillCategories } from "../config/skills";

// スキルセクション
export function renderSkills(): string {
  const categoriesHTML = skillCategories
    .map(
      (category) => `
      <div class="skill-category">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">${category.title}</h3>
        <div class="flex flex-wrap gap-2">
          ${category.skills
            .map(
              (skill) => `
            <span class="${skill.color.bg} ${skill.color.text} px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
              <iconify-icon icon="${skill.icon}" width="16" height="16"></iconify-icon>
              <span>${skill.name}</span>
            </span>
          `,
            )
            .join("")}
        </div>
      </div>
    `,
    )
    .join("");

  return `
    <section class="max-w-4xl mx-auto mb-16">
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Skills
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          ${categoriesHTML}
        </div>
      </div>
    </section>
  `;
}
