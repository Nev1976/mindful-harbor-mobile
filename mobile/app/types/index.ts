// Shared types from your backend
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Prompt {
  id: number;
  content: string;
  category: string;
  isUsed: boolean;
  createdAt: string;
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface HabitCompletion {
  id: number;
  habitId: number;
  userId: number;
  date: string;
  createdAt: string;
}

export interface MicroMoment {
  id: number;
  title: string;
  description: string;
  duration: number;
  category: string;
  instructions: string;
}

export interface Reflection {
  id: number;
  userId: number;
  promptId: number;
  content: string;
  mood: number;
  createdAt: string;
}

export interface DailyProgress {
  id: number;
  userId: number;
  date: string;
  habitsCompleted: number;
  totalHabits: number;
  reflectionCompleted: boolean;
  microMomentsCompleted: number;
  moodScore: number;
  mindfulnessMinutes: number;
}