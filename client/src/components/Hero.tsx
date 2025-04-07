import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen pt-24 flex items-center">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-lg">
              <span className="inline-block px-3 py-1 rounded-full bg-accent bg-opacity-10 text-accent text-sm font-medium mb-4">
                Software Developer & Entrepreneur
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6 leading-tight">
                Building digital <span className="text-secondary">experiences</span> that matter
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                I design and develop applications that help businesses grow and users succeed. Passionate about clean code, user experience, and innovative solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-secondary hover:bg-blue-600 text-white px-8 py-6 h-auto rounded-md font-medium inline-flex items-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  onClick={() => scrollToSection("projects")}
                >
                  View Projects
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 h-auto rounded-md font-medium inline-flex items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  onClick={() => scrollToSection("contact")}
                >
                  Contact Me
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 mt-12">
                <a href="#" className="text-gray-600 hover:text-secondary text-2xl transition-colors">
                  <i className="ri-github-fill"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-secondary text-2xl transition-colors">
                  <i className="ri-linkedin-box-fill"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-secondary text-2xl transition-colors">
                  <i className="ri-twitter-fill"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-secondary text-2xl transition-colors">
                  <i className="ri-medium-fill"></i>
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -left-6 -top-6 w-32 h-32 bg-accent opacity-10 rounded-full"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-secondary opacity-10 rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt="John Doe - Professional portrait" 
                className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
