import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { isAdmin, DecodedToken } from '../services/authService';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}
import { uploadMarkdown, deleteMarkdown, uploadImage } from '../services/s3Service';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { insertBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Apply admin middleware to all CMS routes
router.use(isAdmin);

/**
 * Get all blog posts for admin (including drafts)
 * GET /api/cms/blog
 */
router.get('/blog', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await storage.getBlogPosts({
      page: Number(page),
      limit: Number(limit)
    });
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
});

/**
 * Get a single blog post by ID
 * GET /api/cms/blog/:id
 */
router.get('/blog/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID'
      });
    }
    
    const post = await storage.getBlogPost(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      post
    });
  } catch (error: any) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
});

/**
 * Create a new blog post
 * POST /api/cms/blog
 */
router.post('/blog', async (req, res) => {
  try {
    const form = formidable({ multiples: true, keepExtensions: true });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error parsing form data',
          error: err.message
        });
      }
      
      // Get form data
      const title = fields.title?.[0] || '';
      const excerpt = fields.excerpt?.[0] || '';
      const content = fields.content?.[0] || '';
      const slug = fields.slug?.[0] || '';
      const tags = fields.tags?.[0] ? JSON.parse(fields.tags[0]) : [];
      const published = fields.published?.[0] === 'true';
      const readTime = parseInt(fields.readTime?.[0] || '5');
      
      // Use the authenticated user's ID as the author ID
      const authorId = req.user?.userId || 1; // Default to 1 if for some reason user ID is not available
      
      if (!title || !excerpt || !content || !slug) {
        return res.status(400).json({
          success: false,
          message: 'Title, excerpt, content, and slug are required'
        });
      }
      
      // Generate a unique S3 key for the blog post
      const s3Key = `blog/${slug}-${uuidv4()}.md`;
      
      try {
        // Upload markdown content to S3
        await uploadMarkdown(s3Key, content);
        
        // Handle optional cover image
        let coverImage = null;
        if (files.coverImage && files.coverImage[0]?.filepath) {
          const coverImageFile = files.coverImage[0];
          const buffer = fs.readFileSync(coverImageFile.filepath);
          const extension = coverImageFile.mimetype?.split('/')[1] || 'jpg';
          const coverImageKey = `blog/images/${slug}-${uuidv4()}.${extension}`;
          
          // Upload cover image to S3 using uploadImage instead of uploadMarkdown
          const uploadResult = await uploadImage(
            coverImageKey,
            buffer,
            coverImageFile.mimetype || 'image/jpeg'
          );
          coverImage = uploadResult;
        }
        
        // Create blog post in database
        const blogPost = await storage.createBlogPost({
          title,
          excerpt,
          slug,
          coverImage,
          s3Key,
          published,
          authorId,
          tags,
          readTime
        });
        
        res.status(201).json({
          success: true,
          post: blogPost,
          message: 'Blog post created successfully'
        });
      } catch (error: any) {
        // If S3 upload fails, delete any uploaded files
        console.error('Blog post creation error:', error);
        res.status(500).json({
          success: false,
          message: 'Error creating blog post',
          error: error.message
        });
      }
    });
  } catch (error: any) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
});

/**
 * Update a blog post
 * PUT /api/cms/blog/:id
 */
router.put('/blog/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID'
      });
    }
    
    const form = formidable({ multiples: true, keepExtensions: true });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error parsing form data',
          error: err.message
        });
      }
      
      // Get the existing blog post
      const existingPost = await storage.getBlogPost(id);
      
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      
      // Get form data
      const title = fields.title?.[0];
      const excerpt = fields.excerpt?.[0];
      const content = fields.content?.[0];
      const slug = fields.slug?.[0];
      const tags = fields.tags?.[0] ? JSON.parse(fields.tags[0]) : undefined;
      const published = fields.published?.[0] === 'true';
      const readTime = fields.readTime?.[0] ? parseInt(fields.readTime[0]) : undefined;
      
      // Make sure we don't try to update the author ID
      // Existing blog post already has the correct author ID
      
      try {
        // If content changed, update the markdown file in S3
        if (content) {
          await uploadMarkdown(existingPost.s3Key, content);
        }
        
        // Handle optional cover image
        let coverImage = existingPost.coverImage;
        if (files.coverImage && files.coverImage[0]?.filepath) {
          const coverImageFile = files.coverImage[0];
          const buffer = fs.readFileSync(coverImageFile.filepath);
          const extension = coverImageFile.mimetype?.split('/')[1] || 'jpg';
          const coverImageKey = `blog/images/${slug || existingPost.slug}-${uuidv4()}.${extension}`;
          
          // Upload cover image to S3 using uploadImage instead of uploadMarkdown
          const uploadResult = await uploadImage(
            coverImageKey,
            buffer,
            coverImageFile.mimetype || 'image/jpeg'
          );
          coverImage = uploadResult;
        }
        
        // Update blog post in database
        const updatedPost = await storage.updateBlogPost(id, {
          title,
          excerpt,
          slug,
          coverImage,
          published,
          tags,
          readTime
          // updatedAt is handled by the database
        });
        
        if (!updatedPost) {
          return res.status(404).json({
            success: false,
            message: 'Blog post not found'
          });
        }
        
        res.status(200).json({
          success: true,
          post: updatedPost,
          message: 'Blog post updated successfully'
        });
      } catch (error: any) {
        console.error('Blog post update error:', error);
        res.status(500).json({
          success: false,
          message: 'Error updating blog post',
          error: error.message
        });
      }
    });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
});

/**
 * Delete a blog post
 * DELETE /api/cms/blog/:id
 */
router.delete('/blog/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID'
      });
    }
    
    // Get the blog post to get the S3 key
    const post = await storage.getBlogPost(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Delete the blog post from the database
    const deleted = await storage.deleteBlogPost(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting blog post'
      });
    }
    
    // Delete the markdown file from S3
    try {
      await deleteMarkdown(post.s3Key);
      
      // If there's a cover image, delete it too
      if (post.coverImage) {
        try {
          // Extract S3 key from cover image URL
          // The location is typically a full URL like https://bucket-name.s3.region.amazonaws.com/blog/images/filename.jpg
          const urlParts = post.coverImage.split('/');
          const key = urlParts.slice(3).join('/'); // Skip the https:, empty string, and domain parts
          
          if (key) {
            await deleteMarkdown(key);
          }
        } catch (imageError) {
          // Log image deletion error but continue
          console.error('Error deleting image from S3:', imageError);
        }
      }
    } catch (s3Error) {
      // Log S3 deletion error but don't fail the request
      console.error('S3 deletion error:', s3Error);
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
});

/**
 * Get all blog tags
 * GET /api/cms/blog/tags
 */
router.get('/blog/tags', async (req, res) => {
  try {
    const tags = await storage.getBlogTags();
    
    res.status(200).json({
      success: true,
      tags
    });
  } catch (error: any) {
    console.error('Get blog tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog tags',
      error: error.message
    });
  }
});

export default router;