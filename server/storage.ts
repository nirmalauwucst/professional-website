import { 
  users, projects, services, skills, skillGroups, contactMessages, 
  type User, type InsertUser, 
  type Project, type InsertProject,
  type Service, type InsertService,
  type Skill, type InsertSkill,
  type SkillGroup, type InsertSkillGroup,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
