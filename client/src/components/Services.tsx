import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { services } from "../data/services";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Zap } from "lucide-react";

const Services = () => {
  // Function to scroll to contact section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-black/[0.02] relative">
      {/* Background gradient accent */}
      <div className="absolute top-0 inset-x-0 h-1 gradient-bg"></div>
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-full flex items-center justify-center mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 font-medium mb-4 text-sm gradient-text">
              Services & Expertise
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Solutions that <span className="gradient-text">Drive Impact</span>
          </h2>
          <p className="text-muted-foreground">
            Specialized expertise to help your business thrive with custom technology solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 relative group overflow-hidden service-card gradient-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              {service.popular && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="gradient-bg text-white text-xs font-medium px-2.5 py-1 flex items-center gap-1">
                    <Zap size={12} className="animate-pulse" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <div className="p-7">
                {/* Icon */}
                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${service.icon} text-2xl text-white`}></i>
                </div>
                
                {/* Title and Description */}
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-6">{service.description}</p>
                
                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="mr-2 mt-0.5 flex-shrink-0 text-primary">
                        <Check size={16} className="fill-current" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Price or Engagement Model */}
                {service.price && (
                  <div className="mb-6">
                    <span className="text-2xl font-bold gradient-text">{service.price}</span>
                    {service.engagementModel && (
                      <span className="text-sm text-gray-500 ml-1">/ {service.engagementModel}</span>
                    )}
                  </div>
                )}
                
                {/* Engagement Model (if no price) */}
                {!service.price && service.engagementModel && (
                  <div className="text-sm text-gray-500 mb-6 italic">
                    {service.engagementModel}
                  </div>
                )}
                
                {/* CTA Button */}
                <Button 
                  variant="outline"
                  className="w-full btn-gradient text-white group mt-2"
                  onClick={() => scrollToSection("contact")}
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
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
            className="bg-black btn-gradient hover:bg-black text-white px-8 py-6 rounded-xl text-lg font-medium inline-flex items-center gap-2 h-12"
            onClick={() => scrollToSection("contact")}
          >
            <span>Schedule a Consultation</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;