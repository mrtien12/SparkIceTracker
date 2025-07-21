import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSparkJobSchema, insertIcebergTableSchema, type SparkJob, type IcebergTable } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Spark Jobs routes
  app.get("/api/spark-jobs", async (req, res) => {
    try {
      const sparkJobs = await storage.getAllSparkJobs();
      res.json(sparkJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch spark jobs" });
    }
  });

  app.post("/api/spark-jobs", async (req, res) => {
    try {
      const data = insertSparkJobSchema.parse(req.body);
      
      // Check if application name already exists
      const existingJob = await storage.getSparkJobByApplicationName(data.applicationName);
      if (existingJob) {
        return res.status(400).json({ message: "Application name already exists" });
      }

      const sparkJob = await storage.createSparkJob(data);
      res.status(201).json(sparkJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create spark job" });
    }
  });

  app.put("/api/spark-jobs/:id", async (req, res) => {
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

  app.delete("/api/spark-jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSparkJob(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete spark job" });
    }
  });

  // Iceberg Tables routes
  app.get("/api/iceberg-tables", async (req, res) => {
    try {
      const icebergTables = await storage.getAllIcebergTables();
      res.json(icebergTables);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch iceberg tables" });
    }
  });

  app.post("/api/iceberg-tables", async (req, res) => {
    try {
      const data = insertIcebergTableSchema.parse(req.body);
      
      // Check if table name already exists
      const existingTable = await storage.getIcebergTableByTableName(data.tableName);
      if (existingTable) {
        return res.status(400).json({ message: "Table name already exists" });
      }

      const icebergTable = await storage.createIcebergTable(data);
      res.status(201).json(icebergTable);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create iceberg table" });
    }
  });

  app.put("/api/iceberg-tables/:id", async (req, res) => {
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

  app.delete("/api/iceberg-tables/:id", async (req, res) => {
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
