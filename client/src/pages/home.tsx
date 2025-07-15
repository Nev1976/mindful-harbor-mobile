import { Heart, Plus } from "lucide-react";
import Header from "@/components/layout/header";
import DailyPromptCard from "@/components/features/daily-prompt-card";
import MicroMomentsGrid from "@/components/features/micro-moments-grid";
import HabitTracker from "@/components/features/habit-tracker";
import ProgressVisualization from "@/components/features/progress-visualization";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: dailyProgress } = useQuery({
    queryKey: ["/api/progress/daily"],
  });

  const currentStreak = 7; // This would come from progress data
  const userName = "Sarah"; // This would come from user data

  return (
    <div className="pb-20">
      <Header />
      
      <div className="max-w-md mx-auto">
        {/* Welcome Section */}
        <section className="px-4 py-6 animate-fade-in">
          <div className="mindful-gradient rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-300/20 to-sage-300/20 rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-light mb-2">
                Good {getTimeOfDay()}, {userName}
              </h2>
              <p className="text-teal-50 font-light leading-relaxed">
                Today is a new opportunity to find joy in the present moment. Let's cultivate happiness together.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-breathe"></div>
                <span className="text-sm text-teal-50">
                  Day {currentStreak} of your mindfulness journey
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Prompt */}
        <section className="px-4 pb-6 animate-slide-up">
          <DailyPromptCard />
        </section>

        {/* Micro Moments */}
        <section className="px-4 pb-6">
          <h3 className="text-lg font-medium text-warm-gray-800 mb-4">Micro Moments</h3>
          <MicroMomentsGrid />
        </section>

        {/* Habit Tracker */}
        <section className="px-4 pb-6">
          <HabitTracker />
        </section>

        {/* Progress Visualization */}
        <section className="px-4 pb-6">
          <ProgressVisualization />
        </section>

        {/* Quick Journal Access */}
        <section className="px-4 pb-20">
          <Button 
            className="w-full bg-gradient-to-r from-coral-300 to-coral-400 hover:from-coral-400 hover:to-coral-500 text-white py-4 rounded-xl font-medium shadow-lg transition-all"
            onClick={() => window.location.href = '/reflect'}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Open Journal</span>
            </div>
          </Button>
        </section>
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-teal-400 to-sage-400 hover:from-teal-500 hover:to-sage-500 text-white rounded-full shadow-lg animate-gentle-bounce hover:shadow-xl transition-shadow z-30"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
