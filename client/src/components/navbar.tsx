import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { GraduationCap, Bell, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              EduStream
            </span>
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              {user.role === 'student' && (
                <Link href="/student" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              )}
              {user.role === 'teacher' && (
                <Link href="/teacher" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="glass">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
