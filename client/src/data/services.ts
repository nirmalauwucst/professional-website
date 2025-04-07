export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  features: string[];
  price?: string;
  engagementModel?: string;
  popular?: boolean;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Custom Web Application Development",
    description: "End-to-end development of scalable, custom web applications tailored to your business needs.",
    icon: "ri-code-box-line",
    iconBgColor: "bg-blue-100",
    features: [
      "Requirements analysis and planning",
      "Full-stack development (React, Angular, Vue)",
      "Backend implementation (Node.js, .NET)",
      "Database design and optimization",
      "Responsive and accessible interfaces"
    ],
    engagementModel: "Project-based or retainer",
    popular: true
  },
  {
    id: 2,
    title: "Technical Product Consulting",
    description: "Strategic technical guidance to optimize your product development process and technology stack.",
    icon: "ri-lightbulb-flash-line",
    iconBgColor: "bg-yellow-100",
    features: [
      "Technology stack evaluation",
      "Architecture reviews and recommendations",
      "Performance optimization",
      "Technical debt assessment",
      "Engineering team workflow improvements"
    ],
    engagementModel: "Weekly or monthly retainer"
  },
  {
    id: 3,
    title: "MVP Design and Development for Startups",
    description: "Rapid development of minimum viable products to validate your business idea and attract investors.",
    icon: "ri-rocket-2-line",
    iconBgColor: "bg-green-100",
    features: [
      "Lean MVP scoping and planning",
      "Rapid prototyping and development",
      "Core feature implementation",
      "Scalable architecture foundation",
      "Analytics integration for validation metrics"
    ],
    engagementModel: "Fixed-price packages",
    popular: true
  },
  {
    id: 4,
    title: "System Architecture and DevOps",
    description: "Designing robust system architectures and implementing modern DevOps practices for seamless deployment and operation.",
    icon: "ri-cloud-line",
    iconBgColor: "bg-purple-100",
    features: [
      "Cloud architecture design (AWS, Azure, GCP)",
      "CI/CD pipeline implementation",
      "Container orchestration (Docker, Kubernetes)",
      "Infrastructure as Code setup",
      "Monitoring and logging systems"
    ],
    engagementModel: "Project-based or consultation"
  },
  {
    id: 5,
    title: "UI/UX Consultation for Web Platforms",
    description: "User-centered design consultation to create intuitive, engaging, and accessible web experiences.",
    icon: "ri-layout-line",
    iconBgColor: "bg-red-100",
    features: [
      "User experience audits",
      "Interface design recommendations",
      "Accessibility compliance review",
      "User flow optimization",
      "Design system consultation"
    ],
    engagementModel: "Hourly consultation"
  },
  {
    id: 6,
    title: "API Design and Integration",
    description: "Building robust, secure, and well-documented APIs or integrating existing third-party services.",
    icon: "ri-plug-line",
    iconBgColor: "bg-indigo-100",
    features: [
      "RESTful or GraphQL API design",
      "API documentation and testing",
      "Third-party service integration",
      "Authentication and security implementation",
      "Performance optimization for API endpoints"
    ],
    engagementModel: "Project-based",
    popular: true
  }
];