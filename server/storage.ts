import { 
  users, 
  classes, 
  enrollments, 
  content, 
  messages, 
  ratings,
  type User, 
  type InsertUser,
  type Class,
  type InsertClass,
  type Enrollment,
  type InsertEnrollment,
  type Content,
  type InsertContent,
  type Message,
  type InsertMessage,
  type Rating,
  type InsertRating
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, count, avg, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Class operations
  getClass(id: string): Promise<Class | undefined>;
  getClassesByTeacher(teacherId: string): Promise<Class[]>;
  getAllClasses(): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, updates: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: string): Promise<boolean>;
  
  // Enrollment operations
  enrollStudent(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]>;
  getEnrollmentsByClass(classId: string): Promise<Enrollment[]>;
  checkEnrollment(studentId: string, classId: string): Promise<Enrollment | undefined>;
  
  // Content operations
  getContentByClass(classId: string): Promise<Content[]>;
  getContentByTeacher(teacherId: string): Promise<Content[]>;
  createContent(contentData: InsertContent): Promise<Content>;
  
  // Message operations
  getMessagesByClass(classId: string): Promise<Message[]>;
  createMessage(messageData: InsertMessage): Promise<Message>;
  
  // Rating operations
  createRating(ratingData: InsertRating): Promise<Rating>;
  getRatingsByTeacher(teacherId: string): Promise<Rating[]>;
  getAverageRating(teacherId: string): Promise<number>;
  
  // Statistics
  getUserStats(): Promise<{ totalUsers: number; totalStudents: number; totalTeachers: number }>;
  getClassStats(): Promise<{ totalClasses: number; liveClasses: number }>;
  
  sessionStore: connectPg.PGStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: connectPg.PGStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getClass(id: string): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData;
  }

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    return await db.select().from(classes).where(eq(classes.teacherId, teacherId)).orderBy(desc(classes.createdAt));
  }

  async getAllClasses(): Promise<Class[]> {
    return await db.select().from(classes).orderBy(desc(classes.createdAt));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async updateClass(id: string, updates: Partial<InsertClass>): Promise<Class | undefined> {
    const [updatedClass] = await db.update(classes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(classes.id, id))
      .returning();
    return updatedClass;
  }

  async deleteClass(id: string): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async enrollStudent(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
  }

  async getEnrollmentsByClass(classId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.classId, classId));
  }

  async checkEnrollment(studentId: string, classId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments)
      .where(and(eq(enrollments.studentId, studentId), eq(enrollments.classId, classId)));
    return enrollment;
  }

  async getContentByClass(classId: string): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.classId, classId)).orderBy(desc(content.createdAt));
  }

  async getContentByTeacher(teacherId: string): Promise<Content[]> {
    return await db.select({
      id: content.id,
      classId: content.classId,
      title: content.title,
      type: content.type,
      fileUrl: content.fileUrl,
      content: content.content,
      createdAt: content.createdAt
    })
    .from(content)
    .innerJoin(classes, eq(content.classId, classes.id))
    .where(eq(classes.teacherId, teacherId))
    .orderBy(desc(content.createdAt));
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(content).values(contentData).returning();
    return newContent;
  }

  async getMessagesByClass(classId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.classId, classId)).orderBy(desc(messages.timestamp));
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(messageData).returning();
    return newMessage;
  }

  async createRating(ratingData: InsertRating): Promise<Rating> {
    const [newRating] = await db.insert(ratings).values(ratingData).returning();
    return newRating;
  }

  async getRatingsByTeacher(teacherId: string): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.teacherId, teacherId)).orderBy(desc(ratings.createdAt));
  }

  async getAverageRating(teacherId: string): Promise<number> {
    const [result] = await db.select({ avg: avg(ratings.rating) })
      .from(ratings)
      .where(eq(ratings.teacherId, teacherId));
    return Number(result.avg) || 0;
  }

  async getUserStats(): Promise<{ totalUsers: number; totalStudents: number; totalTeachers: number }> {
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalStudents] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
    const [totalTeachers] = await db.select({ count: count() }).from(users).where(eq(users.role, 'teacher'));
    
    return {
      totalUsers: totalUsers.count,
      totalStudents: totalStudents.count,
      totalTeachers: totalTeachers.count
    };
  }

  async getClassStats(): Promise<{ totalClasses: number; liveClasses: number }> {
    const [totalClasses] = await db.select({ count: count() }).from(classes);
    const [liveClasses] = await db.select({ count: count() }).from(classes).where(eq(classes.isLive, true));
    
    return {
      totalClasses: totalClasses.count,
      liveClasses: liveClasses.count
    };
  }
}

export const storage = new DatabaseStorage();
