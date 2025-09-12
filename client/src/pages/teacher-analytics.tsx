import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, DollarSign, BookOpen, TrendingUp, Clock } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher-sidebar";

interface TeacherAnalytics {
  totalClasses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  popularClasses: Array<{
    id: string;
    title: string;
    enrollmentCount: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: 'enrollment' | 'completion' | 'rating';
    studentName: string;
    className: string;
    timestamp: string;
    value?: number;
  }>;
}

export function TeacherAnalytics() {
  const { data: analytics, isLoading } = useQuery<TeacherAnalytics>({
    queryKey: ["/api/teacher/analytics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TeacherSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading analytics...</div>
          </div>
        </main>
      </div>
    );
  }

  const mockAnalytics: TeacherAnalytics = analytics || {
    totalClasses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    completionRate: 0,
    popularClasses: [],
    recentActivity: []
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TeacherSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Track your teaching performance and student engagement</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-classes">
                  {mockAnalytics.totalClasses}
                </div>
                <p className="text-xs text-muted-foreground">Active and completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-students">
                  {mockAnalytics.totalStudents}
                </div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-revenue">
                  ${mockAnalytics.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">From all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-average-rating">
                  {mockAnalytics.averageRating > 0 ? mockAnalytics.averageRating.toFixed(1) : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Out of 5 stars</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Popular Classes
                </CardTitle>
                <CardDescription>Classes with the most enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                {mockAnalytics.popularClasses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-popular-classes">
                    No enrollment data yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockAnalytics.popularClasses.map((classItem) => (
                      <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium" data-testid={`popular-class-title-${classItem.id}`}>
                            {classItem.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300" data-testid={`popular-class-enrollment-${classItem.id}`}>
                            {classItem.enrollmentCount} students enrolled
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600" data-testid={`popular-class-revenue-${classItem.id}`}>
                            ${classItem.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest student interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {mockAnalytics.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-recent-activity">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockAnalytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <Badge 
                            variant={activity.type === 'enrollment' ? 'default' : activity.type === 'completion' ? 'secondary' : 'outline'}
                            data-testid={`activity-badge-${index}`}
                          >
                            {activity.type}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" data-testid={`activity-description-${index}`}>
                            <span className="font-medium">{activity.studentName}</span>
                            {activity.type === 'enrollment' && ' enrolled in '}
                            {activity.type === 'completion' && ' completed '}
                            {activity.type === 'rating' && ' rated '}
                            <span className="font-medium">{activity.className}</span>
                            {activity.type === 'rating' && activity.value && (
                              <span className="ml-1">({activity.value}/5 stars)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" data-testid={`activity-timestamp-${index}`}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}