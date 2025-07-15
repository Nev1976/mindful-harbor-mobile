import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function HabitTracker() {
  const queryClient = useQueryClient();

  const { data: habits, isLoading } = useQuery({
    queryKey: ["/api/habits"],
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async (habitId: number) => {
      const response = await apiRequest("POST", `/api/habits/${habitId}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/daily"] });
    },
  });

  const handleToggleHabit = (habitId: number) => {
    toggleHabitMutation.mutate(habitId);
  };

  const getStreakDots = (streak: number) => {
    const dots = [];
    const maxDots = 4;
    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < streak 
              ? 'bg-teal-300' 
              : 'bg-warm-gray-200'
          }`}
        />
      );
    }
    return dots;
  };

  const completedToday = habits?.filter((h: any) => h.isCompleted).length || 0;
  const totalHabits = habits?.length || 0;

  if (isLoading) {
    return (
      <Card className="mindful-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-warm-gray-800">
              Daily Habits
            </CardTitle>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mindful-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-warm-gray-800">
            Daily Habits
          </CardTitle>
          <span className="text-sm text-warm-gray-500">
            {completedToday} of {totalHabits} today
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {habits && habits.length > 0 ? (
          <>
            <div className="space-y-4">
              {habits.slice(0, 3).map((habit: any) => (
                <div key={habit.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`w-6 h-6 p-0 rounded-full flex items-center justify-center ${
                        habit.isCompleted
                          ? 'bg-teal-300 hover:bg-teal-400 text-white'
                          : 'border-2 border-warm-gray-300 hover:border-teal-300'
                      }`}
                    >
                      {habit.isCompleted && <Check className="w-3 h-3" />}
                    </Button>
                    <span className={`font-medium ${
                      habit.isCompleted 
                        ? 'text-warm-gray-700' 
                        : 'text-warm-gray-500'
                    }`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getStreakDots(habit.streak)}
                    </div>
                    <span className="text-xs text-warm-gray-500 ml-2">
                      {habit.streak} days
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => window.location.href = '/habits'}
              className="w-full mt-6 bg-gradient-to-r from-teal-300 to-sage-300 hover:from-teal-400 hover:to-sage-400 text-white py-3 rounded-xl font-medium transition-all"
            >
              View All Habits
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-warm-gray-500 mb-4">
              No habits yet. Start building healthy mindfulness habits!
            </p>
            <Button 
              onClick={() => window.location.href = '/habits'}
              className="bg-teal-300 hover:bg-teal-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
