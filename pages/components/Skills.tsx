import { skillCategories } from "../config/skills";

// スキルセクション
export function Skills() {
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {skillCategories.map((category) => (
            <div key={category.title} className="skill-category">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`${skill.color.bg} ${skill.color.text} px-3 py-1 rounded-full text-sm flex items-center gap-1.5`}
                  >
                    <iconify-icon icon={skill.icon} width="16" height="16" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
