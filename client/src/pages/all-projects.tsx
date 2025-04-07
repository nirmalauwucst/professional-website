import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { projects, categories } from "../data/projects";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "wouter";

const AllProjectsPage = () => {
  // State for filtered projects
  const [filteredCategory, setFilteredCategory] = useState("All");
  
  // Filter projects by category
  const filteredProjects = filteredCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === filteredCategory);
  
  // Color mapping for tag backgrounds
  const getTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      "React": "bg-blue-100 text-blue-700",
      "Node.js": "bg-green-100 text-green-700",
      "MongoDB": "bg-purple-100 text-purple-700",
      "React Native": "bg-blue-100 text-blue-700",
      "Firebase": "bg-yellow-100 text-yellow-700",
      "GraphQL": "bg-red-100 text-red-700",
      "Python": "bg-green-100 text-green-700",
      "TensorFlow": "bg-gray-100 text-gray-700",
      "FastAPI": "bg-indigo-100 text-indigo-700",
      "Vue.js": "bg-blue-100 text-blue-700",
      "Laravel": "bg-orange-100 text-orange-700",
      "MySQL": "bg-red-100 text-red-700",
      "Express": "bg-purple-100 text-purple-700",
      "Socket.io": "bg-green-100 text-green-700",
      "Flutter": "bg-blue-100 text-blue-700",
      "IoT": "bg-gray-100 text-gray-700",
      "AWS": "bg-yellow-100 text-yellow-700",
    };
    
    return colorMap[tag] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <Header activeSection="projects" />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/">
              <a className="hover:text-secondary transition-colors">Home</a>
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">All Projects</span>
          </div>
          
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              All Projects
            </h1>
            <p className="text-gray-700">
              Browse through my complete portfolio of projects and case studies.
            </p>
            <div className="w-20 h-1 bg-secondary mx-auto mt-6"></div>
          </motion.div>
          
          {/* Project Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <button 
                key={index}
                className={`px-5 py-2 rounded-full transition-all duration-300 ${
                  filteredCategory === category 
                    ? "bg-secondary text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } font-medium text-sm`}
                onClick={() => setFilteredCategory(category)}
              >
                {category}
              </button>
            ))}
          </motion.div>
          
          {/* Projects Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-md group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index % 6) }}
              >
                <div className="relative overflow-hidden aspect-video">
                  <img 
                    src={project.image} 
                    alt={`${project.title} project`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className={`text-xs font-medium px-2 py-1 ${getTagColor(tag)} rounded-full`}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold font-poppins mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <a href={`/projects/${project.id}`} className="text-secondary hover:text-blue-700 font-medium text-sm inline-flex items-center group">
                      View Details
                      <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <div className="flex space-x-2">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                          <i className="ri-github-fill"></i>
                        </a>
                      )}
                      {project.demoLink && (
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                          <i className="ri-external-link-line"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 p-8 rounded-lg inline-block max-w-lg">
                <div className="rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <i className="ri-folder-open-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Projects Found</h3>
                <p className="text-gray-600 mb-6">
                  {filteredCategory === "All" 
                    ? "There are no projects available at the moment. Check back later for updates."
                    : `No projects found in the "${filteredCategory}" category. Try selecting a different category.`
                  }
                </p>
                {filteredCategory !== "All" && (
                  <Button 
                    onClick={() => setFilteredCategory("All")}
                    className="bg-secondary hover:bg-secondary/90 text-white"
                  >
                    View All Projects
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Back to Home Button */}
          <div className="text-center mt-16">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-gray-600 hover:text-secondary transition-colors group">
                <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
                <span className="font-medium">Back to Homepage</span>
              </a>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AllProjectsPage;