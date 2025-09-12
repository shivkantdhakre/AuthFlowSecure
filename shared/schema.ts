import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  role: varchar("role").notNull().default("student"), // student, teacher, admin
  avatar: varchar("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classes table
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  subject: varchar("subject").notNull(),
  teacherId: varchar("teacher_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  maxStudents: integer("max_students").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isLive: boolean("is_live").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completed: boolean("completed").default(false),
});

// Content table
export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").references(() => classes.id), // Optional - allows general teacher content
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // video, pdf, slide, note
  fileUrl: varchar("file_url"),
  content: text("content"), // for text notes
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table (for chat)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull().references(() => classes.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  teacherId: varchar("teacher_id").notNull().references(() => users.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  taughtClasses: many(classes),
  enrollments: many(enrollments),
  messages: many(messages),
  givenRatings: many(ratings, { relationName: "studentRatings" }),
  receivedRatings: many(ratings, { relationName: "teacherRatings" }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  content: many(content),
  messages: many(messages),
  ratings: many(ratings),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
}));

export const contentRelations = relations(content, ({ one }) => ({
  class: one(classes, {
    fields: [content.classId],
    references: [classes.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  class: one(classes, {
    fields: [messages.classId],
    references: [classes.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  student: one(users, {
    fields: [ratings.studentId],
    references: [users.id],
    relationName: "studentRatings",
  }),
  teacher: one(users, {
    fields: [ratings.teacherId],
    references: [users.id],
    relationName: "teacherRatings",
  }),
  class: one(classes, {
    fields: [ratings.classId],
    references: [classes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
