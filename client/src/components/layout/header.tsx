import { Heart, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-teal-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-300 to-sage-300 rounded-full flex items-center justify-center">
              <Heart className="text-white text-sm w-4 h-4" />
            </div>
            <h1 className="text-lg font-medium text-warm-gray-800">
              Mindful Moments
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 rounded-full hover:bg-teal-50 transition-colors"
          >
            <UserCircle className="text-teal-400 text-xl w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
