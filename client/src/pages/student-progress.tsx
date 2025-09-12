import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, TrendingUp, Award, Clock, CheckCircle, Star } from "lucide-react";
import { StudentSidebar } from "@/components/student-sidebar";
import { Class, User, Enrollment } from "@shared/schema";

interface ProgressData {
  totalEnrolled: number;
  totalCompleted: number;
  totalHoursLearned: number;
  averageRating: number;
  completionRate: number;
  recentActivity: Array<{
    type: 'enrollment' | 'completion' | 'rating';
    className: string;
    timestamp: string;
    value?: number;
  }>;
  enrolledClasses: Array<{
    id: string;
    title: string;
    teacher: User;
    enrollment: Enrollment;
    progress: number;
    duration: number;
  }>;
}

export function StudentProgress() {
  const { data: progressData, isLoading } = useQuery<ProgressData>({
    queryKey: ["/api/student/progress"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StudentSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading your progress...</div>
          </div>
        </main>
      </div>
    );
  }

  const mockProgress: ProgressData = progressData || {
    totalEnrolled: 0,
    totalCompleted: 0,
    totalHoursLearned: 0,
    averageRating: 0,
    completionRate: 0,
    recentActivity: [],
    enrolledClasses: []
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StudentSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Progress</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Track your learning journey and achievements</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes Enrolled</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-enrolled">
                  {mockProgress.totalEnrolled}
                </div>
                <p className="text-xs text-muted-foreground">Total enrollments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-completed">
                  {mockProgress.totalCompleted}
                </div>
                <p className="text-xs text-muted-foreground">Successfully finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-hours">
                  {mockProgress.totalHoursLearned}h
                </div>
                <p className="text-xs text-muted-foreground">Time invested</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-rating">
                  {mockProgress.averageRating > 0 ? mockProgress.averageRating.toFixed(1) : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Your ratings</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Classes Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Current Classes
                </CardTitle>
                <CardDescription>Your progress in enrolled classes</CardDescription>
              </CardHeader>
              <CardContent>
                {mockProgress.enrolledClasses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-current-classes">
                    No classes in progress
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockProgress.enrolledClasses.map((classItem) => (
                      <div key={classItem.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1" data-testid={`progress-class-title-${classItem.id}`}>
                              {classItem.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs" data-testid={`progress-teacher-avatar-${classItem.id}`}>
                                  {classItem.teacher.firstName[0]}{classItem.teacher.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600 dark:text-gray-300" data-testid={`progress-teacher-name-${classItem.id}`}>
                                {classItem.teacher.firstName} {classItem.teacher.lastName}
                              </span>
                            </div>
                          </div>
                          <Badge 
                            variant={classItem.enrollment.completed ? "default" : "secondary"}
                            data-testid={`progress-status-${classItem.id}`}
                          >
                            {classItem.enrollment.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span data-testid={`progress-percentage-${classItem.id}`}>
                              {classItem.progress}%
                            </span>
                          </div>
                          <Progress value={classItem.progress} className="h-2" />
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400" data-testid={`progress-duration-${classItem.id}`}>
                          Duration: {classItem.duration} minutes
                        </p>
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
                  <Award className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                {mockProgress.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-recent-activity">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockProgress.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <Badge 
                            variant={activity.type === 'completion' ? 'default' : activity.type === 'rating' ? 'secondary' : 'outline'}
                            data-testid={`activity-badge-${index}`}
                          >
                            {activity.type}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" data-testid={`activity-description-${index}`}>
                            {activity.type === 'enrollment' && `Enrolled in ${activity.className}`}
                            {activity.type === 'completion' && `Completed ${activity.className}`}
                            {activity.type === 'rating' && `Rated ${activity.className}`}
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

          {/* Overall Completion Rate */}
          {mockProgress.totalEnrolled > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Overall Completion Rate</CardTitle>
                <CardDescription>Your success rate across all enrolled classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold" data-testid="text-completion-rate">
                    {mockProgress.completionRate.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {mockProgress.totalCompleted} of {mockProgress.totalEnrolled} classes completed
                  </span>
                </div>
                <Progress value={mockProgress.completionRate} className="h-3" />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}