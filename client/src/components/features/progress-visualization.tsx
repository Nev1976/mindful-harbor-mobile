import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressVisualization() {
  const { data: dailyProgress } = useQuery({
    queryKey: ["/api/progress/daily"],
  });

  const { data: reflections } = useQuery({
    queryKey: ["/api/reflections"],
  });

  // Calculate progress data
  const currentStreak = 7; // This would be calculated from progress data
  const weeklyCompletion = dailyProgress ? 
    Math.round((dailyProgress.habitsCompleted / Math.max(dailyProgress.totalHabits, 1)) * 100) : 60;
  
  const totalReflections = reflections?.length || 23;
  const totalMicroMoments = dailyProgress?.microMomentsCount || 47;
  const totalKindnessActs = 12; // This would come from habit completions

  const CircularProgress = ({ percentage, color, children }: { 
    percentage: number; 
    color: string; 
    children: React.ReactNode;
  }) => {
    const circumference = 2 * Math.PI * 15.9155;
    const strokeDasharray = `${(percentage / 100) * circumference}, ${circumference}`;
    
    return (
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  return (
    <Card className="mindful-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-warm-gray-800">
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <CircularProgress percentage={75} color="#4DD0E1">
              <span className="text-sm font-medium text-warm-gray-800">
                {currentStreak}
              </span>
            </CircularProgress>
            <p className="text-sm text-warm-gray-600">Day Streak</p>
          </div>

          <div className="text-center">
            <CircularProgress percentage={weeklyCompletion} color="#81C784">
              <span className="text-sm font-medium text-warm-gray-800">
                {weeklyCompletion}%
              </span>
            </CircularProgress>
            <p className="text-sm text-warm-gray-600">This Week</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-warm-gray-100 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray-600">Reflections completed</span>
            <span className="font-medium text-warm-gray-800">{totalReflections}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray-600">Micro-moments appreciated</span>
            <span className="font-medium text-warm-gray-800">{totalMicroMoments}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray-600">Acts of kindness</span>
            <span className="font-medium text-warm-gray-800">{totalKindnessActs}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
