import { motion } from "framer-motion";
import { skillGroups } from "../data/skills";

const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary bg-opacity-10 text-primary text-sm font-medium mb-4">
            My Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Technical Skills
          </h2>
          <p className="text-gray-700">
            Technologies and tools I've worked with throughout my career.
          </p>
          <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {skillGroups.map((group, groupIndex) => (
            <motion.div 
              key={group.id} 
              className="bg-white rounded-xl shadow-md p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * groupIndex }}
            >
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 ${group.iconBgColor} rounded-lg flex items-center justify-center mr-4`}>
                  <i className={`${group.icon} text-2xl ${group.id === 'languages' ? 'text-secondary' : group.id === 'frameworks' ? 'text-accent' : group.id === 'tools' ? 'text-primary' : 'text-secondary'}`}></i>
                </div>
                <h3 className="text-xl font-semibold font-poppins">{group.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, skillIndex) => (
                  <motion.div 
                    key={skillIndex}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.3, delay: 0.05 * skillIndex + 0.2 * groupIndex }}
                  >
                    <div className={`w-3 h-3 rounded-full ${skill.color}`}></div>
                    <span className="font-medium text-sm">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
