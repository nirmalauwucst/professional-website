import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { services } from "../data/services";
import { Badge } from "@/components/ui/badge";

const Services = () => {
  // Function to scroll to contact section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary bg-opacity-10 text-secondary text-sm font-medium mb-4">
            What I Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Services & Solutions
          </h2>
          <p className="text-gray-700">
            Specialized expertise to help your business thrive with custom technology solutions.
          </p>
          <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              {service.popular && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="default" className="bg-accent/90 text-white text-xs font-medium px-2.5 py-0.5">
                    Popular
                  </Badge>
                </div>
              )}
              
              <div className="p-6">
                {/* Icon */}
                <div className={`w-12 h-12 ${service.iconBgColor} rounded-md flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${service.icon} text-2xl ${
                    service.iconBgColor.includes('blue') ? 'text-blue-600' : 
                    service.iconBgColor.includes('green') ? 'text-green-600' : 
                    service.iconBgColor.includes('yellow') ? 'text-yellow-600' : 
                    service.iconBgColor.includes('purple') ? 'text-purple-600' : 
                    service.iconBgColor.includes('red') ? 'text-red-600' : 
                    service.iconBgColor.includes('indigo') ? 'text-indigo-600' : 
                    'text-primary'
                  }`}></i>
                </div>
                
                {/* Title and Description */}
                <h3 className="text-lg font-semibold font-poppins mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="text-accent mr-2 mt-0.5 flex-shrink-0">
                        <i className="ri-check-line text-sm"></i>
                      </div>
                      <span className="text-gray-700 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Engagement Model */}
                {service.engagementModel && (
                  <div className="text-xs text-gray-500 mb-4 italic">
                    {service.engagementModel}
                  </div>
                )}
                
                {/* CTA Button */}
                <Button 
                  variant="ghost"
                  className="text-secondary hover:text-secondary/90 hover:bg-secondary/5 p-0 h-auto text-sm font-medium group flex items-center mt-2"
                  onClick={() => scrollToSection("contact")}
                >
                  Schedule Consultation
                  <i className="ri-arrow-right-line ml-1 transition-transform duration-300 group-hover:translate-x-1"></i>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Additional CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-white text-sm px-6 py-2 rounded-md font-medium inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
            onClick={() => scrollToSection("contact")}
          >
            Discuss Your Custom Project
            <i className="ri-arrow-right-line text-base"></i>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;