import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { services } from "../data/services";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const Services = () => {
  // Function to scroll to contact section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-16 md:py-24">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg relative flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              {service.popular && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="bg-accent text-white font-medium">
                    Popular
                  </Badge>
                </div>
              )}
              
              <div className="p-6 flex-grow">
                <div className={`w-14 h-14 ${service.iconBgColor} rounded-lg flex items-center justify-center mb-6`}>
                  <i className={`${service.icon} text-3xl ${
                    service.iconBgColor.includes('blue') ? 'text-blue-600' : 
                    service.iconBgColor.includes('green') ? 'text-green-600' : 
                    service.iconBgColor.includes('yellow') ? 'text-yellow-600' : 
                    service.iconBgColor.includes('purple') ? 'text-purple-600' : 
                    service.iconBgColor.includes('red') ? 'text-red-600' : 
                    service.iconBgColor.includes('indigo') ? 'text-indigo-600' : 
                    'text-primary'
                  }`}></i>
                </div>
                
                <h3 className="text-xl font-semibold font-poppins mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-5">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="text-accent mr-2 mt-0.5">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {service.engagementModel && (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg mb-5">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Engagement:</span> {service.engagementModel}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="px-6 pb-6">
                <Button 
                  className="w-full bg-secondary hover:bg-blue-600 text-white py-5 h-auto rounded-md font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  onClick={() => scrollToSection("contact")}
                >
                  Schedule Consultation
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Additional CTA */}
        <motion.div 
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="mb-6 text-lg">Need a custom solution not listed here?</p>
          <Button 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 h-auto rounded-md font-medium inline-flex items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            onClick={() => scrollToSection("contact")}
          >
            <i className="ri-chat-1-line mr-2"></i>
            Discuss Your Project
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;