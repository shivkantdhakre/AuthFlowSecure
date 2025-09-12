import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireRole } from "./auth";
import { setupWebSocket } from "./websocket";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Class routes
  app.get("/api/classes", async (req, res) => {
    try {
      const classes = await storage.getAllClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.getClass(req.params.id);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch class" });
    }
  });

  app.post("/api/classes", requireAuth, requireRole('teacher'), async (req, res) => {
    try {
      const classData = {
        ...req.body,
        teacherId: req.user!.id,
        date: new Date(req.body.date)
      };
      const newClass = await storage.createClass(classData);
      res.status(201).json(newClass);
    } catch (error) {
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.put("/api/classes/:id", requireAuth, requireRole('teacher'), async (req, res) => {
    try {
      const updatedClass = await storage.updateClass(req.params.id, req.body);
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(updatedClass);
    } catch (error) {
      res.status(500).json({ message: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", requireAuth, requireRole('teacher'), async (req, res) => {
    try {
      const deleted = await storage.deleteClass(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete class" });
    }
  });

  // Enrollment routes
  app.post("/api/classes/:id/enroll", requireAuth, requireRole('student'), async (req, res) => {
    try {
      const studentId = req.user!.id;
      const classId = req.params.id;
      
      // Check if already enrolled
      const existingEnrollment = await storage.checkEnrollment(studentId, classId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this class" });
      }

      const enrollment = await storage.enrollStudent({ studentId, classId });
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to enroll in class" });
    }
  });

  app.get("/api/enrollments", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const enrollments = await storage.getEnrollmentsByStudent(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Content routes
  app.get("/api/classes/:id/content", requireAuth, async (req, res) => {
    try {
      const content = await storage.getContentByClass(req.params.id);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/classes/:id/content", requireAuth, requireRole('teacher'), upload.single('file'), async (req, res) => {
    try {
      const { title, type, content: textContent } = req.body;
      const classId = req.params.id;
      
      const contentData = {
        classId,
        title,
        type,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
        content: textContent || null
      };

      const newContent = await storage.createContent(contentData);
      res.status(201).json(newContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  // Chat routes
  app.get("/api/classes/:id/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessagesByClass(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Rating routes
  app.post("/api/ratings", requireAuth, requireRole('student'), async (req, res) => {
    try {
      const { teacherId, classId, rating, comment } = req.body;
      const studentId = req.user!.id;
      
      const newRating = await storage.createRating({
        studentId,
        teacherId,
        classId,
        rating,
        comment
      });
      
      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  app.get("/api/teachers/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRatingsByTeacher(req.params.id);
      const averageRating = await storage.getAverageRating(req.params.id);
      res.json({ ratings, averageRating });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Statistics routes
  app.get("/api/stats", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      const classStats = await storage.getClassStats();
      res.json({ ...userStats, ...classStats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Teacher-specific routes
  app.get("/api/teacher/classes", requireAuth, requireRole('teacher'), async (req, res) => {
    try {
      const classes = await storage.getClassesByTeacher(req.user!.id);
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teacher classes" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', require('express').static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  
  // Setup WebSocket
  setupWebSocket(httpServer);

  return httpServer;
}
