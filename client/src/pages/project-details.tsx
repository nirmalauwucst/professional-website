import ProjectDetails from "../components/ProjectDetails";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Suspense } from "react";

export default function ProjectDetailsPage() {
  return (
    <>
      <Header activeSection="projects" />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ProjectDetails />
      </Suspense>
      <Footer />
    </>
  );
}