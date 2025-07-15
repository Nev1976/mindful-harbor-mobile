import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReflectionModal from "./reflection-modal";

export default function DailyPromptCard() {
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["/api/daily-prompt"],
  });

  if (isLoading) {
    return (
      <Card className="mindful-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-medium text-warm-gray-800">Today's Reflection</span>
            <div className="w-10 h-10 bg-gradient-to-br from-coral-200 to-coral-300 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-coral-600" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-xl p-4 mb-4">
              <div className="h-16 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prompt) {
    return (
      <Card className="mindful-card">
        <CardContent className="pt-6">
          <p className="text-warm-gray-500 text-center">
            No prompt available today. Check back tomorrow!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mindful-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-medium text-warm-gray-800">Today's Reflection</span>
            <div className="w-10 h-10 bg-gradient-to-br from-coral-200 to-coral-300 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-coral-600" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-teal-50 to-sage-50 rounded-xl p-4 mb-4">
            <p className="text-warm-gray-700 leading-relaxed font-light">
              "{prompt.content}"
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray-500">{prompt.category}</span>
            <Button 
              onClick={() => setIsReflectionOpen(true)}
              className="bg-teal-300 hover:bg-teal-400 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Begin Reflection
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReflectionModal
        prompt={prompt}
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
      />
    </>
  );
}
