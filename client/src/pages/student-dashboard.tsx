import { StudentSidebar } from "@/components/student-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Book, CheckCircle, Flame, Clock, Play, Download } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  
  const { data: enrollments } = useQuery({
    queryKey: ["/api/enrollments"],
  });

  const { data: classes } = useQuery({
    queryKey: ["/api/classes"],
  });

  return (
    <div className="flex min-h-screen pt-16">
      <StudentSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {user?.firstName}
            </span>! 👋
          </h1>
          <p className="text-muted-foreground">Continue your learning journey and explore new classes.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Book className="text-white" />
                </div>
                <span className="text-2xl font-bold">{Array.isArray(enrollments) ? enrollments.length : 0}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Enrolled Classes</h3>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-white" />
                </div>
                <span className="text-2xl font-bold">8</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Completed Lessons</h3>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Flame className="text-white" />
                </div>
                <span className="text-2xl font-bold">15</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Day Streak</h3>
            </CardContent>
          </Card>

          <Card className="glass hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Clock className="text-white" />
                </div>
                <span className="text-2xl font-bold">45</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Hours Learned</h3>
            </CardContent>
          </Card>
        </div>

        {/* Recent Classes */}
        <Card className="glass mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Classes</CardTitle>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 glass rounded-xl hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Book className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Advanced React Patterns</h3>
                  <p className="text-sm text-muted-foreground">by John Smith</p>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-blue-500">Live Tomorrow</Badge>
                    <span className="text-xs text-muted-foreground ml-2">3:00 PM - 4:30 PM</span>
                  </div>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  Join
                </Button>
              </div>

              <div className="flex items-center p-4 glass rounded-xl hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Python for Data Science</h3>
                  <p className="text-sm text-muted-foreground">by Sarah Johnson</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="secondary">Completed</Badge>
                    <span className="text-xs text-muted-foreground ml-2">Yesterday</span>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Resources
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border border-border rounded-xl">
                <div className="text-center mr-4">
                  <div className="text-lg font-bold">3:00</div>
                  <div className="text-sm text-muted-foreground">PM</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Machine Learning Fundamentals</h3>
                  <p className="text-sm text-muted-foreground">with Dr. Michael Chen</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Join
                  </Button>
                  <Button size="sm" variant="outline">
                    🔔
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
