import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for Poppins/Inter fonts
const style = document.createElement('style');
style.textContent = `
  :root {
    --primary: 212 54% 13%;
    --primary-foreground: 0 0% 98%;
    
    --secondary: 204 93% 47%;
    --secondary-foreground: 0 0% 98%;
    
    --accent: 168 100% 36%;
    --accent-foreground: 0 0% 98%;
    
    --background: 0 0% 100%;
    --foreground: 212 54% 13%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 214.3 32.9% 45%;
    
    --card: 0 0% 100%;
    --card-foreground: 212 54% 13%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 212 54% 13%;
    
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    
    --ring: 204 93% 47%;
    
    --radius: 0.5rem;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: #2D3436;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
