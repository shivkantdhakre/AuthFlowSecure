import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  AlertTriangle,
  UserPlus,
  Flag,
  TrendingUp,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="flex min-h-screen pt-16">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management tools</p>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="text-white" />
                </div>
                <span className="text-2xl font-bold">{(stats as any)?.totalUsers || 0}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Users</h3>
              <div className="text-xs text-green-400 mt-1">↗ +12% this month</div>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" />
                </div>
                <span className="text-2xl font-bold">{(stats as any)?.totalClasses || 0}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Classes</h3>
              <div className="text-xs text-green-400 mt-1">↗ +8% this month</div>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-white" />
                </div>
                <span className="text-2xl font-bold">$125,890</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Monthly Revenue</h3>
              <div className="text-xs text-green-400 mt-1">↗ +15% this month</div>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="text-white" />
                </div>
                <span className="text-2xl font-bold">8</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Pending Reports</h3>
              <div className="text-xs text-red-400 mt-1">Requires attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Alex Thompson</div>
                    <div className="text-xs text-muted-foreground">alex@example.com</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Student</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Latest Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">Inappropriate Content</span>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Reported by user for offensive language in class chat</div>
                  <div className="text-xs text-muted-foreground mt-1">30 minutes ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <UserPlus className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
                    <div className="text-sm font-semibold">Manage Users</div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/admin/reports">
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Flag className="w-8 h-8 text-red-400 mb-2 mx-auto" />
                    <div className="text-sm font-semibold">Review Reports</div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/admin/payments">
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-green-400 mb-2 mx-auto" />
                    <div className="text-sm font-semibold">Payment Analytics</div>
                  </CardContent>
                </Card>
              </Link>
              
              <Card className="hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Settings className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
                  <div className="text-sm font-semibold">System Settings</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
