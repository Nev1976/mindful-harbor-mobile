import { Home, Heart, CheckCircle, TrendingUp, User } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/reflect", icon: Heart, label: "Reflect" },
    { path: "/habits", icon: CheckCircle, label: "Habits" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-warm-gray-200 z-40">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            return (
              <Link key={path} href={path}>
                <button
                  className={`flex flex-col items-center py-2 px-3 transition-colors ${
                    isActive 
                      ? 'text-teal-400' 
                      : 'text-warm-gray-400 hover:text-teal-400'
                  }`}
                >
                  <Icon className={`text-lg mb-1 ${isActive ? 'w-5 h-5' : 'w-5 h-5'}`} />
                  <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                    {label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
