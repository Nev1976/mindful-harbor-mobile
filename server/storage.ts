import { 
  users, prompts, microMoments, habits, habitCompletions, reflections, dailyProgress,
  type User, type InsertUser, type Prompt, type InsertPrompt, type MicroMoment, 
  type InsertMicroMoment, type Habit, type InsertHabit, type HabitCompletion, 
  type InsertHabitCompletion, type Reflection, type InsertReflection, 
  type DailyProgress, type InsertDailyProgress
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Prompt methods
  getAllPrompts(): Promise<Prompt[]>;
  getUnusedPrompt(): Promise<Prompt | undefined>;
  markPromptAsUsed(id: number): Promise<void>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;

  // Micro moments methods
  getAllMicroMoments(): Promise<MicroMoment[]>;
  createMicroMoment(microMoment: InsertMicroMoment): Promise<MicroMoment>;

  // Habit methods
  getUserHabits(userId: number): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  toggleHabitCompletion(habitId: number, userId: number, date: string): Promise<void>;
  getHabitCompletions(userId: number, date: string): Promise<HabitCompletion[]>;
  getHabitStreak(habitId: number, userId: number): Promise<number>;

  // Reflection methods
  createReflection(reflection: InsertReflection): Promise<Reflection>;
  getUserReflections(userId: number): Promise<Reflection[]>;

  // Progress methods
  getDailyProgress(userId: number, date: string): Promise<DailyProgress | undefined>;
  updateDailyProgress(userId: number, date: string, progress: Partial<InsertDailyProgress>): Promise<DailyProgress>;
  getUserProgressRange(userId: number, startDate: string, endDate: string): Promise<DailyProgress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private prompts: Map<number, Prompt> = new Map();
  private microMoments: Map<number, MicroMoment> = new Map();
  private habits: Map<number, Habit> = new Map();
  private habitCompletions: Map<number, HabitCompletion> = new Map();
  private reflections: Map<number, Reflection> = new Map();
  private dailyProgress: Map<string, DailyProgress> = new Map();

  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed prompts
    const defaultPrompts = [
      { content: "Notice three small details in your environment right now that you've never paid attention to before. How do they make you feel?", category: "Mindful Awareness", isUsed: false },
      { content: "What is one thing you can appreciate about this exact moment, even if everything else feels challenging?", category: "Present Moment", isUsed: false },
      { content: "Think of someone who made you smile recently. What small gesture can you make to brighten someone else's day?", category: "Kindness", isUsed: false },
      { content: "How does your breath feel right now? Take three conscious breaths and notice how your body responds.", category: "Breathing", isUsed: false },
      { content: "What sound, texture, or sensation around you brings you a sense of peace in this moment?", category: "Sensory Awareness", isUsed: false }
    ];

    defaultPrompts.forEach(prompt => {
      const id = this.currentId++;
      const fullPrompt: Prompt = { 
        ...prompt, 
        id, 
        isUsed: prompt.isUsed || false,
        createdAt: new Date() 
      };
      this.prompts.set(id, fullPrompt);
    });

    // Seed micro moments
    const defaultMicroMoments: InsertMicroMoment[] = [
      { title: "Gratitude Pause", description: "Take 30 seconds to appreciate something beautiful around you", icon: "leaf", category: "gratitude", estimatedTime: 30 },
      { title: "Kindness Note", description: "Send a thoughtful message to someone you care about", icon: "heart", category: "kindness", estimatedTime: 120 },
      { title: "Breath Reset", description: "Three deep breaths to center yourself in this moment", icon: "cloud", category: "breathing", estimatedTime: 60 },
      { title: "Sunshine Check", description: "Notice how light feels on your skin right now", icon: "sun", category: "awareness", estimatedTime: 45 }
    ];

    defaultMicroMoments.forEach(moment => {
      const id = this.currentId++;
      this.microMoments.set(id, { ...moment, id });
    });

    // Seed default habits
    const defaultHabits = [
      { userId: 1, name: "Morning gratitude", description: "List 3 things you're grateful for", icon: "sunrise", isActive: true },
      { userId: 1, name: "Mindful walking", description: "5 minutes of conscious walking", icon: "footprints", isActive: true },
      { userId: 1, name: "Evening reflection", description: "Reflect on the day's moments", icon: "moon", isActive: true },
      { userId: 1, name: "Deep breathing", description: "5 minutes of focused breathing", icon: "wind", isActive: true },
      { userId: 1, name: "Acts of kindness", description: "One small act of kindness", icon: "heart", isActive: true }
    ];

    defaultHabits.forEach(habit => {
      const id = this.currentId++;
      const fullHabit: Habit = { 
        ...habit, 
        id,
        name: habit.name,
        description: habit.description || null,
        icon: habit.icon,
        userId: habit.userId || null,
        isActive: habit.isActive || null,
        createdAt: new Date() 
      };
      this.habits.set(id, fullHabit);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Prompt methods
  async getAllPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }

  async getUnusedPrompt(): Promise<Prompt | undefined> {
    const unusedPrompts = Array.from(this.prompts.values()).filter(prompt => !prompt.isUsed);
    if (unusedPrompts.length === 0) {
      // Reset all prompts if none available
      Array.from(this.prompts.values()).forEach(prompt => {
        prompt.isUsed = false;
      });
      return Array.from(this.prompts.values())[Math.floor(Math.random() * this.prompts.size)];
    }
    return unusedPrompts[Math.floor(Math.random() * unusedPrompts.length)];
  }

  async markPromptAsUsed(id: number): Promise<void> {
    const prompt = this.prompts.get(id);
    if (prompt) {
      prompt.isUsed = true;
    }
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.currentId++;
    const prompt: Prompt = { 
      ...insertPrompt, 
      id, 
      isUsed: insertPrompt.isUsed || false,
      createdAt: new Date() 
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  // Micro moments methods
  async getAllMicroMoments(): Promise<MicroMoment[]> {
    return Array.from(this.microMoments.values());
  }

  async createMicroMoment(insertMicroMoment: InsertMicroMoment): Promise<MicroMoment> {
    const id = this.currentId++;
    const microMoment: MicroMoment = { ...insertMicroMoment, id };
    this.microMoments.set(id, microMoment);
    return microMoment;
  }

  // Habit methods
  async getUserHabits(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(habit => habit.userId === userId && habit.isActive);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.currentId++;
    const habit: Habit = { 
      ...insertHabit, 
      id, 
      description: insertHabit.description || null,
      userId: insertHabit.userId || null,
      isActive: insertHabit.isActive || null,
      createdAt: new Date() 
    };
    this.habits.set(id, habit);
    return habit;
  }

  async toggleHabitCompletion(habitId: number, userId: number, date: string): Promise<void> {
    const existing = Array.from(this.habitCompletions.values()).find(
      hc => hc.habitId === habitId && hc.userId === userId && hc.date === date
    );
    
    if (existing) {
      this.habitCompletions.delete(existing.id);
    } else {
      const id = this.currentId++;
      const completion: HabitCompletion = {
        id,
        habitId,
        userId,
        date,
        completedAt: new Date()
      };
      this.habitCompletions.set(id, completion);
    }
  }

  async getHabitCompletions(userId: number, date: string): Promise<HabitCompletion[]> {
    return Array.from(this.habitCompletions.values()).filter(
      hc => hc.userId === userId && hc.date === date
    );
  }

  async getHabitStreak(habitId: number, userId: number): Promise<number> {
    const completions = Array.from(this.habitCompletions.values())
      .filter(hc => hc.habitId === habitId && hc.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < completions.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (completions.find(c => c.date === expectedDateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Reflection methods
  async createReflection(insertReflection: InsertReflection): Promise<Reflection> {
    const id = this.currentId++;
    const reflection: Reflection = { 
      ...insertReflection, 
      id, 
      userId: insertReflection.userId || null,
      promptId: insertReflection.promptId || null,
      mood: insertReflection.mood || null,
      createdAt: new Date() 
    };
    this.reflections.set(id, reflection);
    return reflection;
  }

  async getUserReflections(userId: number): Promise<Reflection[]> {
    return Array.from(this.reflections.values()).filter(reflection => reflection.userId === userId);
  }

  // Progress methods
  async getDailyProgress(userId: number, date: string): Promise<DailyProgress | undefined> {
    const key = `${userId}-${date}`;
    return this.dailyProgress.get(key);
  }

  async updateDailyProgress(userId: number, date: string, progress: Partial<InsertDailyProgress>): Promise<DailyProgress> {
    const key = `${userId}-${date}`;
    const existing = this.dailyProgress.get(key);
    
    if (existing) {
      const updated = { ...existing, ...progress };
      this.dailyProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const newProgress: DailyProgress = {
        id,
        userId,
        date,
        promptCompleted: false,
        microMomentsCount: 0,
        habitsCompleted: 0,
        totalHabits: 0,
        reflectionCount: 0,
        ...progress
      };
      this.dailyProgress.set(key, newProgress);
      return newProgress;
    }
  }

  async getUserProgressRange(userId: number, startDate: string, endDate: string): Promise<DailyProgress[]> {
    return Array.from(this.dailyProgress.values()).filter(
      progress => progress.userId === userId && 
                 progress.date >= startDate && 
                 progress.date <= endDate
    );
  }
}

export const storage = new MemStorage();
