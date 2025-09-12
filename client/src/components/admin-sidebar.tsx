import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  CreditCard, 
  Flag 
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", icon: BarChart3, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/classes", icon: BookOpen, label: "Classes" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/reports", icon: Flag, label: "Reports" },
];

export function AdminSidebar() {
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
