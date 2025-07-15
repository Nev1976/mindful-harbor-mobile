import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const microMoments = pgTable("micro_moments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  estimatedTime: integer("estimated_time").notNull(), // in seconds
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").references(() => habits.id),
  userId: integer("user_id").references(() => users.id),
  completedAt: timestamp("completed_at").defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  promptId: integer("prompt_id").references(() => prompts.id),
  content: text("content").notNull(),
  mood: integer("mood"), // 1-5 scale
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyProgress = pgTable("daily_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  promptCompleted: boolean("prompt_completed").default(false),
  microMomentsCount: integer("micro_moments_count").default(0),
  habitsCompleted: integer("habits_completed").default(0),
  totalHabits: integer("total_habits").default(0),
  reflectionCount: integer("reflection_count").default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

export const insertMicroMomentSchema = createInsertSchema(microMoments).omit({
  id: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
});

export const insertHabitCompletionSchema = createInsertSchema(habitCompletions).omit({
  id: true,
  completedAt: true,
});

export const insertReflectionSchema = createInsertSchema(reflections).omit({
  id: true,
  createdAt: true,
});

export const insertDailyProgressSchema = createInsertSchema(dailyProgress).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;

export type MicroMoment = typeof microMoments.$inferSelect;
export type InsertMicroMoment = z.infer<typeof insertMicroMomentSchema>;

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;

export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;

export type DailyProgress = typeof dailyProgress.$inferSelect;
export type InsertDailyProgress = z.infer<typeof insertDailyProgressSchema>;
