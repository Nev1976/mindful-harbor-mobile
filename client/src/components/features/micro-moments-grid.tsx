import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Leaf, Heart, Cloud, Sun } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const iconMap: { [key: string]: any } = {
  leaf: Leaf,
  heart: Heart,
  cloud: Cloud,
  sun: Sun,
};

const colorMap: { [key: string]: string } = {
  gratitude: "border-sage-100 hover:shadow-lg",
  kindness: "border-coral-100 hover:shadow-lg", 
  breathing: "border-teal-100 hover:shadow-lg",
  awareness: "border-warm-gray-200 hover:shadow-lg",
};

const bgColorMap: { [key: string]: string } = {
  gratitude: "from-sage-200 to-sage-300",
  kindness: "from-coral-200 to-coral-300",
  breathing: "from-teal-200 to-teal-300", 
  awareness: "from-warm-gray-200 to-warm-gray-300",
};

const iconColorMap: { [key: string]: string } = {
  gratitude: "text-sage-600",
  kindness: "text-coral-600",
  breathing: "text-teal-600",
  awareness: "text-warm-gray-600",
};

export default function MicroMomentsGrid() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: microMoments, isLoading } = useQuery({
    queryKey: ["/api/micro-moments"],
  });

  const completeMicroMomentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/micro-moments/complete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/daily"] });
      toast({
        title: "Micro moment completed",
        description: "Thank you for taking a mindful moment.",
      });
    },
  });

  const handleMicroMomentClick = (moment: any) => {
    completeMicroMomentMutation.mutate();
    // Could show a modal with guided instructions here
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl p-4 h-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {microMoments?.map((moment: any) => {
        const IconComponent = iconMap[moment.icon] || Heart;
        const borderColor = colorMap[moment.category] || colorMap.awareness;
        const bgGradient = bgColorMap[moment.category] || bgColorMap.awareness;
        const iconColor = iconColorMap[moment.category] || iconColorMap.awareness;

        return (
          <div
            key={moment.id}
            onClick={() => handleMicroMomentClick(moment)}
            className={`micro-moment-card ${borderColor} p-4 cursor-pointer`}
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${bgGradient} rounded-lg flex items-center justify-center mb-3`}>
              <IconComponent className={`w-4 h-4 ${iconColor}`} />
            </div>
            <h4 className="font-medium text-warm-gray-800 text-sm mb-1">
              {moment.title}
            </h4>
            <p className="text-xs text-warm-gray-600 leading-relaxed">
              {moment.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
