// API configuration for mobile app
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' // Development - connects to your local server
  : 'https://your-deployed-app.replit.app/api'; // Production - your deployed Replit URL

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Daily prompts
  getDailyPrompt: () => apiRequest<any>('/daily-prompt'),
  
  // Habits
  getHabits: () => apiRequest<any[]>('/habits'),
  createHabit: (habit: any) => apiRequest<any>('/habits', {
    method: 'POST',
    body: JSON.stringify(habit),
  }),
  toggleHabit: (habitId: number, date: string) => apiRequest<any>(`/habits/${habitId}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  }),
  
  // Micro moments
  getMicroMoments: () => apiRequest<any[]>('/micro-moments'),
  
  // Reflections
  getReflections: () => apiRequest<any[]>('/reflections'),
  createReflection: (reflection: any) => apiRequest<any>('/reflections', {
    method: 'POST',
    body: JSON.stringify(reflection),
  }),
  
  // Progress
  getDailyProgress: () => apiRequest<any>('/progress/daily'),
  updateDailyProgress: (progress: any) => apiRequest<any>('/progress/daily', {
    method: 'POST',
    body: JSON.stringify(progress),
  }),
};