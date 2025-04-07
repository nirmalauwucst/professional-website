import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const About = () => {
  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary bg-opacity-10 text-secondary text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            My Journey
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="md:w-5/12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-full h-full border-2 border-accent rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="John working on coding projects" 
                className="w-full h-auto rounded-lg shadow-lg relative z-10"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-7/12"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold font-poppins mb-4">
              Software Developer & Tech Entrepreneur
            </h3>
            <p className="text-gray-700 mb-6">
              I'm a passionate software developer with over 8 years of experience building web and mobile applications. My journey began when I built my first website at 15, and since then, I've been on a mission to create digital solutions that solve real-world problems.
            </p>
            <p className="text-gray-700 mb-6">
              After graduating with a degree in Computer Science, I worked at several tech companies before founding my own startup that helps small businesses automate their operations. I believe in writing clean, maintainable code and creating intuitive user interfaces.
            </p>
            <p className="text-gray-700 mb-8">
              When I'm not coding, you'll find me hiking, reading about new technologies, or mentoring aspiring developers. I'm always open to discussing new projects and opportunities to collaborate.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white px-5 py-2 rounded-md font-medium inline-flex items-center gap-2 text-sm"
              >
                <i className="ri-download-line text-base"></i>
                Download Resume
              </Button>
              <Button 
                variant="outline"
                className="border border-primary text-primary hover:bg-primary/5 px-5 py-2 rounded-md font-medium inline-flex items-center gap-2 text-sm"
                onClick={() => scrollToSection("contact")}
              >
                <i className="ri-chat-1-line text-base"></i>
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Current Role/Venture */}
        <motion.div 
          className="mt-24 bg-white rounded-xl shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-rocket-2-fill text-5xl text-secondary"></i>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-2xl font-semibold font-poppins mb-2">
                Current Venture: TechFlow Solutions
              </h3>
              <p className="text-gray-600 mb-4">Founder & Lead Developer</p>
              <p className="text-gray-700 mb-4">
                TechFlow is a startup focused on creating automation tools for small businesses. Our flagship product helps companies streamline their customer service workflows, reducing response times by an average of 45%.
              </p>
              <a href="#" className="text-secondary hover:text-blue-700 font-medium inline-flex items-center">
                Visit TechFlow
                <i className="ri-external-link-line ml-1"></i>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
