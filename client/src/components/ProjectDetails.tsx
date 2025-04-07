import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { projects } from "../data/projects";
import { useLocation, Link } from "wouter";

const ProjectDetails = () => {
  const [location] = useLocation();
  const projectId = parseInt(location.split("/projects/")[1]);
  const [project, setProject] = useState(projects.find(p => p.id === projectId));
  
  // If project not found, redirect to projects page
  useEffect(() => {
    if (!project) {
      window.location.href = "/#projects";
    }
  }, [project]);
  
  if (!project) return null;
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <a 
            href="/#projects" 
            className="hover:text-secondary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/#projects";
            }}
          >
            Projects
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{project.title}</span>
        </div>
        
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4 ml-auto">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <i className="ri-github-fill text-xl"></i>
                  <span className="text-sm font-medium">View Source</span>
                </a>
              )}
              {project.demoLink && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
                >
                  <i className="ri-external-link-line text-xl"></i>
                  <span className="text-sm font-medium">Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Project Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
        
        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="prose prose-lg max-w-none">
              <h2>Project Overview</h2>
              <p className="text-gray-700">{project.description}</p>
              
              <p className="text-gray-700">
                This project was designed to address the needs of modern businesses looking to expand their online presence. 
                It features a responsive design that works seamlessly across all devices, from mobile phones to desktop computers.
              </p>
              
              <h2>Key Features</h2>
              <ul>
                <li>Responsive design that works on all devices</li>
                <li>Interactive user interface with smooth animations</li>
                <li>Optimized performance for fast load times</li>
                <li>Secure data handling and user authentication</li>
                <li>Integration with popular third-party services</li>
              </ul>
              
              <h2>Development Process</h2>
              <p className="text-gray-700">
                The development process began with a thorough requirements gathering phase, where we identified the key needs of the target users.
                We then moved into the design phase, creating wireframes and prototypes to refine the user experience.
                The implementation used modern web technologies to ensure optimal performance and maintainability.
              </p>
              
              <h2>Technical Details</h2>
              <p className="text-gray-700">
                This project was built using a modern tech stack consisting of:
              </p>
              <ul>
                {project.tags.map((tag, index) => (
                  <li key={index}>{tag}: Used for {getTagDescription(tag)}</li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
              <h3 className="text-xl font-semibold font-poppins mb-6">Project Information</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Category</h4>
                  <p className="font-medium">{project.category}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Project Links</h4>
                  <div className="space-y-3">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <i className="ri-github-fill text-xl"></i>
                        <span className="text-sm">GitHub Repository</span>
                      </a>
                    )}
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
                      >
                        <i className="ri-external-link-line text-xl"></i>
                        <span className="text-sm">Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    onClick={() => {
                      // Force navigation to home page first, then to the contact section
                      sessionStorage.setItem('scrollToContact', 'true');
                      window.location.href = "/";
                    }}
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                  >
                    Discuss This Project
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Next/Prev Projects */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <PrevNextProjectLink
              type="prev"
              projectId={project.id}
            />
            <div className="my-4 sm:my-0"></div>
            <PrevNextProjectLink
              type="next"
              projectId={project.id}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component for previous/next project links
const PrevNextProjectLink = ({ type, projectId }: { type: "prev" | "next", projectId: number }) => {
  const targetId = type === "prev" ? projectId - 1 : projectId + 1;
  const targetProject = projects.find(p => p.id === targetId);
  
  if (!targetProject) {
    return (
      <div className={`flex items-center ${type === "next" ? "justify-end" : ""}`}>
        <span className="text-gray-400 text-sm">
          {type === "prev" ? "No Previous Project" : "No Next Project"}
        </span>
      </div>
    );
  }
  
  return (
    <a 
      href={`/projects/${targetProject.id}`}
      className={`group flex items-center ${type === "next" ? "flex-row" : "flex-row-reverse"}`}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `/projects/${targetProject.id}`;
      }}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group-hover:bg-secondary group-hover:text-white transition-colors ${type === "next" ? "mr-4" : "ml-4"}`}>
        <i className={`ri-arrow-${type === "next" ? "right" : "left"}-line`}></i>
      </div>
      <div className={`${type === "next" ? "text-right" : "text-left"}`}>
        <div className="text-sm text-gray-500">
          {type === "next" ? "Next Project" : "Previous Project"}
        </div>
        <div className="font-medium text-gray-900 group-hover:text-secondary transition-colors">
          {targetProject.title}
        </div>
      </div>
    </a>
  );
};

// Helper function to provide description for each technology
const getTagDescription = (tag: string): string => {
  const descriptions: Record<string, string> = {
    "React": "front-end UI development with component-based architecture",
    "Node.js": "server-side JavaScript runtime environment",
    "MongoDB": "NoSQL database for flexible data storage",
    "React Native": "cross-platform mobile application development",
    "Firebase": "backend services including authentication and real-time database",
    "GraphQL": "API query language and runtime for more efficient data fetching",
    "Python": "server-side scripting and data processing",
    "TensorFlow": "machine learning model training and deployment",
    "FastAPI": "modern, high-performance Python web framework",
    "Vue.js": "progressive JavaScript framework for building user interfaces",
    "Laravel": "PHP framework for web application development",
    "MySQL": "relational database management system",
    "Express": "minimalist web framework for Node.js",
    "Socket.io": "real-time bidirectional event-based communication",
    "Flutter": "UI toolkit for building natively compiled applications",
    "IoT": "connecting and controlling physical devices via the internet",
    "AWS": "cloud computing services and infrastructure"
  };
  
  return descriptions[tag] || "implementation of core functionality";
};

export default ProjectDetails;