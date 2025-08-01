import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchCommandSchema, polecenia_cmd } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search commands endpoint
  app.post("/api/commands/search", async (req, res) => {
    try {
      const { query } = searchCommandSchema.parse(req.body);
      const commands = await storage.searchCommands(query);
      
      res.json({
        commands,
        count: commands.length,
        searchTime: Date.now() % 1000 / 1000 // Simple timing simulation
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid search query", 
          errors: error.errors 
        });
      }
      
      console.error("Search error:", error);
      res.status(500).json({ 
        message: "Failed to search commands. Please try again." 
      });
    }
  });

  // Get all commands (for initial load or browse)
  app.get("/api/commands", async (req, res) => {
    try {
      const commands = await storage.getAllCommands();
      
      // Get total count from database
      const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(polecenia_cmd);
      const totalCount = totalCountResult[0]?.count || 0;
      
      res.json({ 
        commands, 
        count: totalCount,
        total: totalCount 
      });
    } catch (error) {
      console.error("Get commands error:", error);
      res.status(500).json({ 
        message: "Failed to load commands. Please check database connection." 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      await storage.getAllCommands();
      res.json({ status: "connected", database: "PostgreSQL" });
    } catch (error) {
      res.status(500).json({ 
        status: "disconnected", 
        error: "Database connection failed" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
