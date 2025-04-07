import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProjectDetailsPage from "./pages/project-details";
import AllProjectsPage from "./pages/all-projects";
import NotFound from "./pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

const HomePage = () => {
  // State to track active section for navigation highlighting
  const [activeSection, setActiveSection] = useState("home");

  // Function to update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      
      sections.forEach((section) => {
        const sectionId = section.getAttribute("id") || "";
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < window.innerHeight * 0.5 && sectionTop >= -section.clientHeight * 0.5) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger once on mount to set initial active section
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Header activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

function App() {
  const [location] = useLocation();
  
  // Only render the Header and Footer on the homepage
  const isHomePage = location === "/";
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/projects" component={AllProjectsPage} />
          <Route path="/projects/:id" component={ProjectDetailsPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
