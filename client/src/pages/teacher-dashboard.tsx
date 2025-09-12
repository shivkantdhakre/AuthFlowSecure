import { TeacherSidebar } from "@/components/teacher-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star, 
  Plus, 
  Upload, 
  TrendingUp, 
  Video,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  const { data: classes } = useQuery({
    queryKey: ["/api/teacher/classes"],
  });

  return (
    <div className="flex min-h-screen pt-16">
      <TeacherSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes and track your teaching performance</p>
        </div>

        {/* Teacher Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" />
                </div>
                <span className="text-2xl font-bold">{classes?.length || 0}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Classes</h3>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Users className="text-white" />
                </div>
                <span className="text-2xl font-bold">340</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Students</h3>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-white" />
                </div>
                <span className="text-2xl font-bold">$2,850</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Monthly Earnings</h3>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Star className="text-white" />
                </div>
                <span className="text-2xl font-bold">4.8</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Average Rating</h3>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/teacher/create">
            <Card className="glass hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-6 text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="text-white text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Create New Class</h3>
                <p className="text-sm text-muted-foreground">Schedule a new live class or upload course content</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/teacher/content">
            <Card className="glass hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-6 text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="text-white text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Upload Content</h3>
                <p className="text-sm text-muted-foreground">Add notes, videos, and course materials</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/teacher/analytics">
            <Card className="glass hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-6 text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-white text-xl" />
                </div>
                <h3 className="font-semibold mb-2">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Track student engagement and performance</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Upcoming Classes */}
        <Card className="glass mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Classes</CardTitle>
              <Link href="/teacher/classes">
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 glass rounded-xl hover:scale-105 transition-transform">
                <div className="text-center mr-4">
                  <div className="text-lg font-bold">3:00</div>
                  <div className="text-sm text-muted-foreground">PM</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Advanced React Patterns</h3>
                  <p className="text-sm text-muted-foreground">25 students enrolled</p>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-blue-500">Live in 2 hours</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Video className="w-4 h-4 mr-2" />
                    Start Class
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Student Activity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-border rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">Sarah Johnson</span>
                    <span className="text-muted-foreground"> completed Python Basics</span>
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-sm">5.0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
