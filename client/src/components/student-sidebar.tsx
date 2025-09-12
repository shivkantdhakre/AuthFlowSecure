import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Search, 
  Book, 
  Folder, 
  TrendingUp, 
  Video 
} from "lucide-react";

const sidebarItems = [
  { href: "/student", icon: Home, label: "Dashboard" },
  { href: "/student/browse", icon: Search, label: "Browse Classes" },
  { href: "/student/enrolled", icon: Book, label: "My Classes" },
  { href: "/student/library", icon: Folder, label: "Content Library" },
  { href: "/student/progress", icon: TrendingUp, label: "Progress" },
  { href: "/student/live", icon: Video, label: "Live Class" },
];

export function StudentSidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-card/60 backdrop-blur-lg border-r border-border p-6">
      <div className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "w-full flex items-center p-3 rounded-lg transition-colors",
                  "hover:bg-white/10",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
