import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, BookOpen, Send, Lightbulb } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Reflect() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reflectionText, setReflectionText] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const { data: dailyPrompt, isLoading: promptLoading } = useQuery({
    queryKey: ["/api/daily-prompt"],
  });

  const { data: reflections, isLoading: reflectionsLoading } = useQuery({
    queryKey: ["/api/reflections"],
  });

  const createReflectionMutation = useMutation({
    mutationFn: async (data: { content: string; promptId: number; mood?: number }) => {
      const response = await apiRequest("POST", "/api/reflections", data);
      return response.json();
    },
    onSuccess: () => {
      setReflectionText("");
      setSelectedMood(null);
      queryClient.invalidateQueries({ queryKey: ["/api/reflections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/daily"] });
      if (dailyPrompt) {
        apiRequest("POST", `/api/prompts/${dailyPrompt.id}/use`);
      }
      toast({
        title: "Reflection saved",
        description: "Your mindful reflection has been recorded.",
      });
    },
  });

  const handleSubmitReflection = () => {
    if (!reflectionText.trim() || !dailyPrompt) return;

    createReflectionMutation.mutate({
      content: reflectionText,
      promptId: dailyPrompt.id,
      mood: selectedMood || undefined,
    });
  };

  const moodEmojis = [
    { value: 1, emoji: "😔", label: "Difficult" },
    { value: 2, emoji: "😐", label: "Okay" },
    { value: 3, emoji: "🙂", label: "Good" },
    { value: 4, emoji: "😊", label: "Great" },
    { value: 5, emoji: "😄", label: "Amazing" },
  ];

  return (
    <div className="pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Daily Prompt Section */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-coral-200 to-coral-300 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-coral-600" />
              </div>
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {promptLoading ? (
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-xl"></div>
              </div>
            ) : dailyPrompt ? (
              <div className="bg-gradient-to-r from-teal-50 to-sage-50 rounded-xl p-4">
                <p className="text-warm-gray-700 leading-relaxed font-light">
                  "{dailyPrompt.content}"
                </p>
                <span className="text-sm text-warm-gray-500 mt-2 block">
                  {dailyPrompt.category}
                </span>
              </div>
            ) : (
              <p className="text-warm-gray-500">No prompt available today.</p>
            )}
          </CardContent>
        </Card>

        {/* Reflection Input */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-teal-500" />
              Your Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Take a moment to reflect on the prompt above. There's no right or wrong answer - just let your thoughts flow..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="min-h-32 resize-none border-warm-gray-200 focus:border-teal-300"
            />
            
            {/* Mood Selector */}
            <div>
              <p className="text-sm font-medium text-warm-gray-700 mb-2">
                How are you feeling right now?
              </p>
              <div className="flex justify-between">
                {moodEmojis.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center p-2 h-auto ${
                      selectedMood === mood.value 
                        ? 'bg-teal-100 border-teal-300 text-teal-700' 
                        : 'hover:bg-teal-50'
                    }`}
                  >
                    <span className="text-xl mb-1">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmitReflection}
              disabled={!reflectionText.trim() || createReflectionMutation.isPending}
              className="w-full bg-teal-300 hover:bg-teal-400 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {createReflectionMutation.isPending ? "Saving..." : "Save Reflection"}
            </Button>
          </CardContent>
        </Card>

        {/* Previous Reflections */}
        <Card className="mindful-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-sage-500" />
              Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reflectionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : reflections && reflections.length > 0 ? (
              <div className="space-y-4">
                {reflections.slice(0, 5).map((reflection: any, index: number) => (
                  <div key={reflection.id}>
                    <div className="text-xs text-warm-gray-500 mb-1">
                      {new Date(reflection.createdAt).toLocaleDateString()}
                      {reflection.mood && (
                        <span className="ml-2">
                          {moodEmojis.find(m => m.value === reflection.mood)?.emoji}
                        </span>
                      )}
                    </div>
                    <p className="text-warm-gray-700 text-sm leading-relaxed">
                      {reflection.content}
                    </p>
                    {index < Math.min(reflections.length - 1, 4) && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
                {reflections.length > 5 && (
                  <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700">
                    View all reflections ({reflections.length})
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-warm-gray-500 text-center py-8">
                Your reflections will appear here as you write them. Start your mindfulness journey above!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
