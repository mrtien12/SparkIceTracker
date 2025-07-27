import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSparkJobSchema, insertIcebergTableSchema, loginSchema, createUserSchema, type SparkJob, type IcebergTable } from "@shared/schema";
import { z } from "zod";
import { requireAuth, verifyPassword, createSession, deleteSession, getSession } from "./auth";
import { createUserWithRandomPassword } from "./admin-utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = createSession(user.id, user.username);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        deleteSession(token);
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  // Admin route for creating users (should be protected in production)
  app.post("/api/admin/create-user", async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const result = await createUserWithRandomPassword(userData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create user" });
    }
  });

  // Spark Jobs routes (protected)
  app.get("/api/spark-jobs", requireAuth, async (req, res) => {
    try {
      const sparkJobs = await storage.getSparkJobsByUserId(req.user!.userId);
      res.json(sparkJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch spark jobs" });
    }
  });

  app.post("/api/spark-jobs", requireAuth, async (req, res) => {
    try {
      const data = insertSparkJobSchema.parse(req.body);
      
      // Check if application name already exists
      const existingJob = await storage.getSparkJobByApplicationName(data.applicationName);
      if (existingJob) {
        return res.status(400).json({ message: "Application name already exists" });
      }

      const sparkJob = await storage.createSparkJob(data, req.user!.userId);
      res.status(201).json(sparkJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create spark job" });
    }
  });

  app.put("/api/spark-jobs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      // If updating application name, check uniqueness
      if (data.applicationName) {
        const existingJob = await storage.getSparkJobByApplicationName(data.applicationName);
        if (existingJob && existingJob.id !== id) {
          return res.status(400).json({ message: "Application name already exists" });
        }
      }

      const sparkJob = await storage.updateSparkJob(id, data);
      res.json(sparkJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to update spark job" });
    }
  });

  app.delete("/api/spark-jobs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSparkJob(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete spark job" });
    }
  });

  // Iceberg Tables routes (protected)
  app.get("/api/iceberg-tables", requireAuth, async (req, res) => {
    try {
      const icebergTables = await storage.getIcebergTablesByUserId(req.user!.userId);
      res.json(icebergTables);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch iceberg tables" });
    }
  });

  app.post("/api/iceberg-tables", requireAuth, async (req, res) => {
    try {
      const data = insertIcebergTableSchema.parse(req.body);
      
      // Check if table name already exists
      const existingTable = await storage.getIcebergTableByTableName(data.tableName);
      if (existingTable) {
        return res.status(400).json({ message: "Table name already exists" });
      }

      const icebergTable = await storage.createIcebergTable(data, req.user!.userId);
      res.status(201).json(icebergTable);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create iceberg table" });
    }
  });

  app.put("/api/iceberg-tables/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      // If updating table name, check uniqueness
      if (data.tableName) {
        const existingTable = await storage.getIcebergTableByTableName(data.tableName);
        if (existingTable && existingTable.id !== id) {
          return res.status(400).json({ message: "Table name already exists" });
        }
      }

      const icebergTable = await storage.updateIcebergTable(id, data);
      res.json(icebergTable);
    } catch (error) {
      res.status(500).json({ message: "Failed to update iceberg table" });
    }
  });

  app.delete("/api/iceberg-tables/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteIcebergTable(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete iceberg table" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
