import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactMessageSchema } from "@shared/schema";

// Contact form validation schema
const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  userId: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get all projects
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      return res.status(200).json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch projects' 
      });
    }
  });

  // API endpoint to get a specific project by ID
  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid project ID' 
        });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project not found' 
        });
      }

      return res.status(200).json({ project });
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch project' 
      });
    }
  });

  // API endpoint to get all services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      return res.status(200).json({ services });
    } catch (error) {
      console.error('Error fetching services:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch services' 
      });
    }
  });

  // API endpoint to get all skill groups with their skills
  app.get('/api/skills', async (req, res) => {
    try {
      const skillGroups = await storage.getSkillGroups();
      const skills = await storage.getSkills();
      
      // Combine skill groups with their skills
      const skillGroupsWithSkills = skillGroups.map(group => {
        const groupSkills = skills.filter(skill => skill.groupId === group.id);
        return {
          ...group,
          skills: groupSkills
        };
      });
      
      return res.status(200).json({ skillGroups: skillGroupsWithSkills });
    } catch (error) {
      console.error('Error fetching skills:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch skills' 
      });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate form data
      const validatedData = contactFormSchema.parse(req.body);
      
      // Store contact message in the database
      const contactMessage = await storage.createContactMessage(validatedData);
      
      console.log('Contact form submission:', contactMessage);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Message received! We will get back to you soon.',
        contactId: contactMessage.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        });
      }
      
      console.error('Contact form error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to process your request' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
