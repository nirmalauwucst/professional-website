import { Github, Linkedin, Twitter, Instagram, Code } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <a href="#" className="text-xl font-bold font-poppins flex items-center space-x-2 mb-4 md:mb-0">
            <span className="gradient-bg p-1.5 rounded text-white"><Code size={20} /></span>
            <span className="gradient-text font-bold">Nirmala Madusanka</span>
          </a>
          
          <div className="flex items-center space-x-6">
            <a href="https://github.com/Nirmala97" target="_blank" rel="noopener noreferrer" 
               className="text-white hover:text-transparent hover:bg-clip-text hover:gradient-text transition-colors">
              <Github size={22} />
            </a>
            <a href="https://www.linkedin.com/in/nirmalauwucst/" target="_blank" rel="noopener noreferrer" 
               className="text-white hover:text-transparent hover:bg-clip-text hover:gradient-text transition-colors">
              <Linkedin size={22} />
            </a>
            <a href="https://twitter.com/nirmalauwucst" target="_blank" rel="noopener noreferrer" 
               className="text-white hover:text-transparent hover:bg-clip-text hover:gradient-text transition-colors">
              <Twitter size={22} />
            </a>
            <a href="https://www.instagram.com/nirmalauwucst/" target="_blank" rel="noopener noreferrer" 
               className="text-white hover:text-transparent hover:bg-clip-text hover:gradient-text transition-colors">
              <Instagram size={22} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                &copy; {currentYear} Accelerarc. All rights reserved.
              </p>
            </div>
            
            <div>
              <ul className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <li><a href="#" className="hover:gradient-text transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:gradient-text transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="hover:gradient-text transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
