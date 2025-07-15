import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReflectionSchema, insertHabitSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get daily prompt
  app.get("/api/daily-prompt", async (req, res) => {
    try {
      const prompt = await storage.getUnusedPrompt();
      if (!prompt) {
        return res.status(404).json({ message: "No prompts available" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily prompt" });
    }
  });

  // Mark prompt as used
  app.post("/api/prompts/:id/use", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markPromptAsUsed(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark prompt as used" });
    }
  });

  // Get micro moments
  app.get("/api/micro-moments", async (req, res) => {
    try {
      const microMoments = await storage.getAllMicroMoments();
      res.json(microMoments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch micro moments" });
    }
  });

  // Get user habits
  app.get("/api/habits", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using user ID 1
      const habits = await storage.getUserHabits(userId);
      
      // Get completion status for today
      const today = new Date().toISOString().split('T')[0];
      const completions = await storage.getHabitCompletions(userId, today);
      
      const habitsWithStatus = await Promise.all(habits.map(async (habit) => {
        const isCompleted = completions.some(c => c.habitId === habit.id);
        const streak = await storage.getHabitStreak(habit.id, userId);
        return {
          ...habit,
          isCompleted,
          streak
        };
      }));
      
      res.json(habitsWithStatus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  // Toggle habit completion
  app.post("/api/habits/:id/toggle", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const userId = 1; // For demo purposes
      const today = new Date().toISOString().split('T')[0];
      
      await storage.toggleHabitCompletion(habitId, userId, today);
      
      // Update daily progress
      const habits = await storage.getUserHabits(userId);
      const completions = await storage.getHabitCompletions(userId, today);
      
      await storage.updateDailyProgress(userId, today, {
        habitsCompleted: completions.length,
        totalHabits: habits.length
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle habit completion" });
    }
  });

  // Create habit
  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse({
        ...req.body,
        userId: 1 // For demo purposes
      });
      const habit = await storage.createHabit(habitData);
      res.json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create habit" });
    }
  });

  // Create reflection
  app.post("/api/reflections", async (req, res) => {
    try {
      const reflectionData = insertReflectionSchema.parse({
        ...req.body,
        userId: 1 // For demo purposes
      });
      
      const reflection = await storage.createReflection(reflectionData);
      
      // Update daily progress
      const today = new Date().toISOString().split('T')[0];
      const existing = await storage.getDailyProgress(1, today);
      const currentCount = existing?.reflectionCount || 0;
      
      await storage.updateDailyProgress(1, today, {
        reflectionCount: currentCount + 1,
        promptCompleted: true
      });
      
      res.json(reflection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reflection data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reflection" });
    }
  });

  // Get user reflections
  app.get("/api/reflections", async (req, res) => {
    try {
      const userId = 1; // For demo purposes
      const reflections = await storage.getUserReflections(userId);
      res.json(reflections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });

  // Get daily progress
  app.get("/api/progress/daily", async (req, res) => {
    try {
      const userId = 1; // For demo purposes
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      
      let progress = await storage.getDailyProgress(userId, date);
      
      if (!progress) {
        // Create initial progress for the day
        const habits = await storage.getUserHabits(userId);
        progress = await storage.updateDailyProgress(userId, date, {
          totalHabits: habits.length
        });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily progress" });
    }
  });

  // Get progress range (for charts)
  app.get("/api/progress/range", async (req, res) => {
    try {
      const userId = 1; // For demo purposes
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const progress = await storage.getUserProgressRange(userId, startDate, endDate);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress range" });
    }
  });

  // Increment micro moment count
  app.post("/api/micro-moments/complete", async (req, res) => {
    try {
      const userId = 1; // For demo purposes
      const today = new Date().toISOString().split('T')[0];
      
      const existing = await storage.getDailyProgress(userId, today);
      const currentCount = existing?.microMomentsCount || 0;
      
      await storage.updateDailyProgress(userId, today, {
        microMomentsCount: currentCount + 1
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update micro moment count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
