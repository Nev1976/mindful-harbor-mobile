import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, Wind, Heart, Sunrise, Footprints, Moon } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const iconMap: { [key: string]: any } = {
  sunrise: Sunrise,
  footprints: Footprints,
  moon: Moon,
  wind: Wind,
  heart: Heart,
};

export default function Habits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    icon: "heart"
  });

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

  const createHabitMutation = useMutation({
    mutationFn: async (habitData: typeof newHabit) => {
      const response = await apiRequest("POST", "/api/habits", habitData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      setIsCreateDialogOpen(false);
      setNewHabit({ name: "", description: "", icon: "heart" });
      toast({
        title: "Habit created",
        description: "Your new mindfulness habit has been added.",
      });
    },
  });

  const handleToggleHabit = (habitId: number) => {
    toggleHabitMutation.mutate(habitId);
  };

  const handleCreateHabit = () => {
    if (!newHabit.name.trim()) return;
    createHabitMutation.mutate(newHabit);
  };

  const getStreakDots = (streak: number) => {
    const dots = [];
    const maxDots = 7;
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

  return (
    <div className="pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Habit Tracker Card */}
        <Card className="mindful-card mb-6">
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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
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
            ) : habits && habits.length > 0 ? (
              <div className="space-y-4">
                {habits.map((habit: any) => {
                  const IconComponent = iconMap[habit.icon] || Heart;
                  return (
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
                        <div>
                          <span className={`font-medium ${
                            habit.isCompleted 
                              ? 'text-warm-gray-700' 
                              : 'text-warm-gray-500'
                          }`}>
                            {habit.name}
                          </span>
                          {habit.description && (
                            <p className="text-xs text-warm-gray-400">
                              {habit.description}
                            </p>
                          )}
                        </div>
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
                  );
                })}

                {/* Add Custom Habit Button */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6 bg-gradient-to-r from-teal-300 to-sage-300 hover:from-teal-400 hover:to-sage-400 text-white py-3 rounded-xl font-medium transition-all">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Habit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Habit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Habit Name</Label>
                        <Input
                          id="name"
                          value={newHabit.name}
                          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                          placeholder="e.g., Morning meditation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                          id="description"
                          value={newHabit.description}
                          onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                          placeholder="Brief description of your habit"
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <div className="flex space-x-2 mt-2">
                          {Object.entries(iconMap).map(([iconName, IconComponent]) => (
                            <Button
                              key={iconName}
                              variant={newHabit.icon === iconName ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewHabit({ ...newHabit, icon: iconName })}
                              className="w-10 h-10 p-0"
                            >
                              <IconComponent className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateHabit}
                          disabled={!newHabit.name.trim() || createHabitMutation.isPending}
                          className="flex-1 bg-teal-300 hover:bg-teal-400"
                        >
                          {createHabitMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-warm-gray-500 mb-4">
                  No habits yet. Create your first mindfulness habit to get started!
                </p>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal-300 hover:bg-teal-400 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Habit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Habit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Habit Name</Label>
                        <Input
                          id="name"
                          value={newHabit.name}
                          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                          placeholder="e.g., Morning meditation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                          id="description"
                          value={newHabit.description}
                          onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                          placeholder="Brief description of your habit"
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <div className="flex space-x-2 mt-2">
                          {Object.entries(iconMap).map(([iconName, IconComponent]) => (
                            <Button
                              key={iconName}
                              variant={newHabit.icon === iconName ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewHabit({ ...newHabit, icon: iconName })}
                              className="w-10 h-10 p-0"
                            >
                              <IconComponent className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateHabit}
                          disabled={!newHabit.name.trim() || createHabitMutation.isPending}
                          className="flex-1 bg-teal-300 hover:bg-teal-400"
                        >
                          {createHabitMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
