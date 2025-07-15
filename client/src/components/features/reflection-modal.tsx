import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReflectionModalProps {
  prompt: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReflectionModal({ prompt, isOpen, onClose }: ReflectionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reflectionText, setReflectionText] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const createReflectionMutation = useMutation({
    mutationFn: async (data: { content: string; promptId: number; mood?: number }) => {
      const response = await apiRequest("POST", "/api/reflections", data);
      return response.json();
    },
    onSuccess: () => {
      setReflectionText("");
      setSelectedMood(null);
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/reflections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/daily"] });
      if (prompt) {
        apiRequest("POST", `/api/prompts/${prompt.id}/use`);
      }
      toast({
        title: "Reflection saved",
        description: "Your mindful reflection has been recorded.",
      });
    },
  });

  const handleSubmitReflection = () => {
    if (!reflectionText.trim() || !prompt) return;

    createReflectionMutation.mutate({
      content: reflectionText,
      promptId: prompt.id,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Your Reflection</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Prompt Display */}
          <div className="bg-gradient-to-r from-teal-50 to-sage-50 rounded-xl p-4">
            <p className="text-warm-gray-700 leading-relaxed font-light text-sm">
              "{prompt?.content}"
            </p>
          </div>

          {/* Reflection Input */}
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

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReflection}
              disabled={!reflectionText.trim() || createReflectionMutation.isPending}
              className="flex-1 bg-teal-300 hover:bg-teal-400 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {createReflectionMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
