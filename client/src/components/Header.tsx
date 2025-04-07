import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface HeaderProps {
  activeSection: string;
}

const Header = ({ activeSection }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHomePage = location === "/";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Navigate and smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      // If on home page, smooth scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        closeMobileMenu();
      }
    } else {
      // If on another page, navigate to home and append the hash
      window.location.href = `/#${sectionId}`;
      closeMobileMenu();
    }
  };

  // Add box shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white bg-opacity-95 z-50 transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a 
          href="/" 
          className="text-xl font-bold font-poppins text-primary flex items-center space-x-2"
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              scrollToSection("home");
            }
          }}
        >
          <span className="text-2xl text-accent">&lt;/&gt;</span>
          <span>John Doe</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a 
                  href={isHomePage ? `#${link.id}` : `/#${link.id}`} 
                  className={`relative text-primary hover:text-secondary font-medium pb-1 ${
                    activeSection === link.id ? "after:w-full" : "after:w-0"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  {link.label}
                  <span 
                    className={`absolute left-0 bottom-0 w-0 h-0.5 bg-accent transition-all duration-300 ${
                      activeSection === link.id ? "w-full" : "w-0"
                    }`}
                  ></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white shadow-md py-4 px-6 absolute w-full transition-all duration-300 ${
          mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul className="space-y-4">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a 
                href={isHomePage ? `#${link.id}` : `/#${link.id}`} 
                className={`block py-2 ${
                  activeSection === link.id ? "text-secondary font-medium" : "text-primary hover:text-secondary"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
