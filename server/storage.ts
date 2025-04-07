import { 
  users, projects, services, skills, skillGroups, contactMessages, blogPosts,
  type User, type InsertUser, 
  type Project, type InsertProject,
  type Service, type InsertService,
  type Skill, type InsertSkill,
  type SkillGroup, type InsertSkillGroup,
  type ContactMessage, type InsertContactMessage,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, asc, or, sql } from "drizzle-orm";

// Expanded storage interface for all our models
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Service methods
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Skill methods
  getSkillGroups(): Promise<SkillGroup[]>;
  getSkillGroup(id: number): Promise<SkillGroup | undefined>;
  createSkillGroup(skillGroup: InsertSkillGroup): Promise<SkillGroup>;
  updateSkillGroup(id: number, skillGroup: Partial<InsertSkillGroup>): Promise<SkillGroup | undefined>;
  deleteSkillGroup(id: number): Promise<boolean>;
  
  getSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Contact message methods
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Blog post methods
  getBlogPosts(options?: {
    published?: boolean;
    tag?: string;
    limit?: number;
    page?: number;
    searchQuery?: string;
  }): Promise<{
    posts: BlogPost[];
    total: number;
  }>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  getBlogTags(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  
  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return true; // In PostgreSQL with Drizzle, we don't get affected rows, so we assume success
  }
  
  // Service methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }
  
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }
  
  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService || undefined;
  }
  
  async deleteService(id: number): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }
  
  // Skill Group methods
  async getSkillGroups(): Promise<SkillGroup[]> {
    return await db.select().from(skillGroups);
  }
  
  async getSkillGroup(id: number): Promise<SkillGroup | undefined> {
    const [group] = await db.select().from(skillGroups).where(eq(skillGroups.id, id));
    return group || undefined;
  }
  
  async createSkillGroup(group: InsertSkillGroup): Promise<SkillGroup> {
    const [newGroup] = await db.insert(skillGroups).values(group).returning();
    return newGroup;
  }
  
  async updateSkillGroup(id: number, group: Partial<InsertSkillGroup>): Promise<SkillGroup | undefined> {
    const [updatedGroup] = await db
      .update(skillGroups)
      .set(group)
      .where(eq(skillGroups.id, id))
      .returning();
    return updatedGroup || undefined;
  }
  
  async deleteSkillGroup(id: number): Promise<boolean> {
    await db.delete(skillGroups).where(eq(skillGroups.id, id));
    return true;
  }
  
  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }
  
  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill || undefined;
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }
  
  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updatedSkill] = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill || undefined;
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  }
  
  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updatedMessage || undefined;
  }
  
  async deleteContactMessage(id: number): Promise<boolean> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  }
  
  // Blog post methods
  async getBlogPosts(options?: {
    published?: boolean;
    tag?: string;
    limit?: number;
    page?: number;
    searchQuery?: string;
  }): Promise<{
    posts: BlogPost[];
    total: number;
  }> {
    const {
      published = true,
      tag,
      limit = 10,
      page = 1,
      searchQuery,
    } = options || {};
    
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    
    // Only return published posts if requested
    if (published !== undefined) {
      whereConditions.push(eq(blogPosts.published, published));
    }
    
    // Filter by tag if provided
    if (tag) {
      // We use SQL to check if the tag array contains the specified tag
      whereConditions.push(sql`${blogPosts.tags} @> ARRAY[${tag}]::text[]`);
    }
    
    // Add search query filter if provided
    if (searchQuery) {
      whereConditions.push(
        or(
          like(blogPosts.title, `%${searchQuery}%`),
          like(blogPosts.excerpt, `%${searchQuery}%`)
        )
      );
    }
    
    // Combine all conditions
    const whereCondition = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;
    
    // Execute query with conditions
    const posts = await db
      .select()
      .from(blogPosts)
      .where(whereCondition)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);
    
    // Get total posts count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(whereCondition);
    
    return {
      posts,
      total: Number(count),
    };
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Always update the updatedAt timestamp when editing a post
    const updateData = {
      ...post,
      updatedAt: new Date(),
    };
    
    const [updatedPost] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    
    return updatedPost || undefined;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }
  
  async getBlogTags(): Promise<string[]> {
    // Get all posts and extract unique tags
    const posts = await db.select().from(blogPosts);
    
    // Create a Set to store unique tags
    const uniqueTags = new Set<string>();
    
    // Iterate through all posts and their tags
    for (const post of posts) {
      for (const tag of post.tags) {
        uniqueTags.add(tag);
      }
    }
    
    // Convert Set to Array and sort
    return Array.from(uniqueTags).sort();
  }
}

export const storage = new DatabaseStorage();
