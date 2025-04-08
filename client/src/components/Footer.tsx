const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <a href="#" className="text-xl font-bold font-poppins flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl text-accent">&lt;/&gt;</span>
            <span>Nirmala Madusanka</span>
          </a>
          
          <div className="flex items-center space-x-6">
            <a href="https://github.com/Nirmala97" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent text-2xl transition-colors">
              <i className="ri-github-fill"></i>
            </a>
            <a href="https://www.linkedin.com/in/nirmalauwucst/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent text-2xl transition-colors">
              <i className="ri-linkedin-box-fill"></i>
            </a>
            <a href="https://twitter.com/nirmalauwucst" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent text-2xl transition-colors">
              <i className="ri-twitter-fill"></i>
            </a>
            <a href="https://www.instagram.com/nirmalauwucst/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent text-2xl transition-colors">
              <i className="ri-instagram-fill"></i>
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
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
