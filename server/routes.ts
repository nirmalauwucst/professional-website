import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactMessageSchema, insertBlogPostSchema } from "@shared/schema";
import * as s3Service from "./services/s3Service";
import { getMarkdown } from "./services/s3Service";
import formidable from "formidable";
import * as fs from "fs";
import authRoutes from "./routes/authRoutes";
import cmsRoutes from "./routes/cmsRoutes";
import { verifyToken, DecodedToken } from "./services/authService";

// Contact form validation schema
const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  userId: z.number().optional(),
});

// Debug middleware to log auth headers
const logAuthHeaders = (req: Request, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  console.log(`Request to ${req.method} ${req.url}`);
  
  if (authHeader) {
    console.log(`Auth header present: ${authHeader.substring(0, 15)}...`);
    if (authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        console.log(`Token validation: success. User: ${(decoded as DecodedToken).username}, Role: ${(decoded as DecodedToken).role}`);
      } catch (error) {
        console.error(`Token validation failed:`, error);
      }
    } else {
      console.log(`Auth header format is invalid`);
    }
  } else {
    console.log(`No auth header present`);
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Add auth header logging middleware
  app.use(logAuthHeaders);
  
  // Register authentication routes
  app.use('/api/auth', authRoutes);
  
  // Register CMS routes
  app.use('/api/cms', cmsRoutes);
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
  
  // Blog post validation schema
  const createBlogPostSchema = insertBlogPostSchema.extend({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"), // Content will be stored in S3
    slug: z.string().min(1, "Slug is required"),
    tags: z.array(z.string()),
    published: z.boolean().default(false),
    coverImage: z.string().optional(),
    readTime: z.number().int().positive().default(5),
    authorId: z.number().int().positive(),
  });
  
  // Blog endpoints
  
  // Get all blog posts with optional filtering
  app.get('/api/blog', async (req, res) => {
    try {
      const { 
        page = '1', 
        limit = '10', 
        tag, 
        search,
        published = 'true'
      } = req.query;
      
      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        tag: tag as string,
        searchQuery: search as string,
        published: published === 'true'
      };
      
      const { posts, total } = await storage.getBlogPosts(options);
      
      return res.status(200).json({ 
        posts,
        pagination: {
          total,
          page: options.page,
          limit: options.limit,
          pages: Math.ceil(total / options.limit)
        }
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch blog posts' 
      });
    }
  });
  
  // Get all blog tags
  app.get('/api/blog/tags', async (req, res) => {
    try {
      const tags = await storage.getBlogTags();
      return res.status(200).json({ tags });
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch blog tags'
      });
    }
  });
  
  // Get a single blog post by slug
  app.get('/api/blog/:slug', async (req, res) => {
    try {
      // Skip if the slug is 'tags' since we have a dedicated endpoint for that
      if (req.params.slug === 'tags') {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      // Get the content from S3
      let content = '';
      try {
        content = await s3Service.getMarkdown(post.s3Key);
      } catch (s3Error) {
        console.error('Error fetching post content from S3:', s3Error);
        // We'll still return the post metadata, just without content
      }
      
      return res.status(200).json({
        post: {
          ...post,
          content
        }
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch blog post' 
      });
    }
  });
  
  // Create a new blog post
  app.post('/api/blog', async (req, res) => {
    try {
      // Validate the post data
      const validatedData = createBlogPostSchema.parse(req.body);
      const { content, ...postData } = validatedData;
      
      // Generate S3 key from slug
      const s3Key = `${postData.slug}-${Date.now()}.md`;
      
      // Upload content to S3
      await s3Service.uploadMarkdown(s3Key, content);
      
      // Store post metadata in database
      const post = await storage.createBlogPost({
        ...postData,
        s3Key,
      });
      
      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        post
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors
        });
      }
      
      console.error('Error creating blog post:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create blog post'
      });
    }
  });
  
  // Update an existing blog post
  app.put('/api/blog/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post ID'
        });
      }
      
      // Get the existing post
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      // Validate the updated data
      const validatedData = createBlogPostSchema.partial().parse(req.body);
      const { content, ...updateData } = validatedData;
      
      // If content was updated, update the S3 file
      if (content) {
        await s3Service.uploadMarkdown(existingPost.s3Key, content);
      }
      
      // Update the database entry
      const updatedPost = await storage.updateBlogPost(id, updateData);
      
      return res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        post: updatedPost
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors
        });
      }
      
      console.error('Error updating blog post:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update blog post'
      });
    }
  });
  
  // Delete a blog post
  app.delete('/api/blog/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post ID'
        });
      }
      
      // Get the post so we can delete the S3 file
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      // Delete the S3 file
      try {
        await s3Service.deleteMarkdown(post.s3Key);
      } catch (s3Error) {
        console.error('Error deleting S3 file:', s3Error);
        // Continue with deletion even if S3 deletion fails
      }
      
      // Delete the database entry
      await storage.deleteBlogPost(id);
      
      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete blog post'
      });
    }
  });
  
  // Get blog post content by S3 key
  app.get('/api/blog/content/:key', async (req, res) => {
    try {
      // Check for authentication token, require auth for CMS access
      let isAuthenticated = false;
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = verifyToken(token) as DecodedToken;
          
          if (decoded && decoded.role === 'admin') {
            isAuthenticated = true;
          }
        } catch (tokenError) {
          console.error('Token verification error:', tokenError);
          return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid authentication token'
          });
        }
      }
      
      // If not authenticated, return 401
      if (!isAuthenticated) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Authentication required'
        });
      }
      
      const { key } = req.params;
      if (!key) {
        return res.status(400).json({
          success: false,
          message: 'Content key is required'
        });
      }
      
      // Check if AWS environment variables are set
      if (!process.env.AWS_S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.error('AWS configuration is incomplete');
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: AWS S3 not properly configured'
        });
      }
      
      // Get content from S3
      const content = await getMarkdown(key);
      
      return res.status(200).json({
        success: true,
        content
      });
    } catch (error: any) {
      console.error('Error fetching blog content:', error);
      
      // Handle specific AWS errors
      if (error.message && error.message.includes('InvalidBucketName')) {
        return res.status(500).json({
          success: false,
          message: 'S3 bucket configuration error',
          error: 'The S3 bucket name is invalid or not properly configured'
        });
      }
      
      // Handle access denied errors
      if (error.message && error.message.includes('AccessDenied')) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to S3 resource',
          error: 'The application does not have permission to access this S3 resource'
        });
      }
      
      // Handle not found errors
      if (error.message && error.message.includes('NoSuchKey')) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
          error: 'The requested blog content could not be found in storage'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch blog content',
        error: error.message
      });
    }
  });

  // Upload blog image
  app.post('/api/blog/upload-image', async (req, res) => {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: (part: formidable.Part) => {
        return part.mimetype?.startsWith('image/') || false;
      }
    });
    
    form.parse(req, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Error parsing form data',
          error: err.message
        });
      }
      
      const file = files.image?.[0];
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }
      
      try {
        // Read the file
        const fileBuffer = await fs.promises.readFile(file.filepath);
        
        // Generate a unique filename
        const filename = `${Date.now()}-${file.originalFilename}`;
        
        // Upload to S3
        const imageUrl = await s3Service.uploadImage(
          filename,
          fileBuffer,
          file.mimetype || 'image/jpeg'
        );
        
        return res.status(200).json({
          success: true,
          url: imageUrl
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    });
  });

  // Add local storage routes for fallback mode
  const { localImageStorage, localMarkdownStorage } = s3Service.getLocalStorage();
  
  // Local storage endpoint for markdown
  app.get('/api/local-storage/markdown/:key', (req, res) => {
    const { key } = req.params;
    const sanitizedKey = key.replace(/-/g, '/');
    
    if (sanitizedKey in localMarkdownStorage) {
      console.log(`Serving markdown from local storage: ${sanitizedKey}`);
      return res.status(200).send(localMarkdownStorage[sanitizedKey].content);
    }
    
    return res.status(404).json({
      success: false,
      message: 'Markdown file not found in local storage'
    });
  });
  
  // Local storage endpoint for images
  app.get('/api/local-storage/images/:key', (req, res) => {
    const { key } = req.params;
    const sanitizedKey = key.replace(/-/g, '/');
    
    if (sanitizedKey in localImageStorage) {
      const { buffer, contentType } = localImageStorage[sanitizedKey];
      console.log(`Serving image from local storage: ${sanitizedKey}`);
      
      res.set('Content-Type', contentType);
      return res.status(200).send(buffer);
    }
    
    return res.status(404).json({
      success: false,
      message: 'Image not found in local storage'
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
