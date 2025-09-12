import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  BookOpen, 
  Plus, 
  FolderOpen, 
  Users, 
  BarChart3 
} from "lucide-react";

const sidebarItems = [
  { href: "/teacher", icon: Home, label: "Dashboard" },
  { href: "/teacher/classes", icon: BookOpen, label: "My Classes" },
  { href: "/teacher/create", icon: Plus, label: "Create Class" },
  { href: "/teacher/content", icon: FolderOpen, label: "Content Library" },
  { href: "/teacher/students", icon: Users, label: "Students" },
  { href: "/teacher/analytics", icon: BarChart3, label: "Analytics" },
];

export function TeacherSidebar() {
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
