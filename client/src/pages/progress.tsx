import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Heart, Target, Award } from "lucide-react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Progress() {
  const { data: dailyProgress } = useQuery({
    queryKey: ["/api/progress/daily"],
  });

  const { data: reflections } = useQuery({
    queryKey: ["/api/reflections"],
  });

  // Calculate progress data
  const currentStreak = 7; // This would be calculated from daily progress data
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
    <div className="pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Main Progress Card */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-teal-500" />
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

            <div className="mt-6 pt-6 border-t border-warm-gray-100 space-y-3">
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

        {/* Weekly Overview */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-sage-500" />
              This Week's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-warm-gray-500 mb-1">{day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    index < 5 ? 'bg-teal-100 text-teal-600' : 'bg-warm-gray-100 text-warm-gray-400'
                  }`}>
                    {index < 5 ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-warm-gray-600 text-center">
              5 out of 7 days completed this week
            </p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-coral-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-warm-gray-800">First Week Complete</h4>
                  <p className="text-xs text-warm-gray-600">Completed 7 days of mindfulness</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg">
                <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-medium text-warm-gray-800">Reflection Master</h4>
                  <p className="text-xs text-warm-gray-600">Completed 20 daily reflections</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-coral-50 rounded-lg">
                <div className="w-10 h-10 bg-coral-200 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-coral-600" />
                </div>
                <div>
                  <h4 className="font-medium text-warm-gray-800">Kindness Champion</h4>
                  <p className="text-xs text-warm-gray-600">Performed 10 acts of kindness</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card className="mindful-card">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-light text-warm-gray-800 mb-2">
                {Math.round((totalReflections + totalMicroMoments + totalKindnessActs) / 3)}
              </div>
              <p className="text-sm text-warm-gray-600 mb-4">
                Average daily mindfulness activities
              </p>
              <div className="w-full bg-warm-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-300 to-sage-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: '73%' }}
                ></div>
              </div>
              <p className="text-xs text-warm-gray-500 mt-2">
                73% of monthly mindfulness goal achieved
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
