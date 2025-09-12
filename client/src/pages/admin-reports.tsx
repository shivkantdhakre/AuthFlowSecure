import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, BookOpen, DollarSign, Calendar, Download, RefreshCw } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useState } from "react";

interface PlatformReports {
  overview: {
    totalUsers: number;
    totalClasses: number;
    totalRevenue: number;
    activeTeachers: number;
    completionRate: number;
    userGrowth: number;
    revenueGrowth: number;
  };
  userEngagement: {
    dailyActiveUsers: number;
    averageSessionDuration: number;
    classCompletionRate: number;
    repeatEnrollmentRate: number;
  };
  teacherPerformance: Array<{
    teacherId: string;
    teacherName: string;
    totalClasses: number;
    totalStudents: number;
    averageRating: number;
    totalRevenue: number;
  }>;
  popularClasses: Array<{
    classId: string;
    title: string;
    enrollmentCount: number;
    completionRate: number;
    averageRating: number;
    revenue: number;
  }>;
  revenueBreakdown: {
    bySubject: Array<{
      subject: string;
      revenue: number;
      percentage: number;
    }>;
    byMonth: Array<{
      month: string;
      revenue: number;
      growth: number;
    }>;
  };
}

export function AdminReports() {
  const [reportPeriod, setReportPeriod] = useState("month");
  const [reportType, setReportType] = useState("overview");

  const { data: reports, isLoading } = useQuery<PlatformReports>({
    queryKey: ["/api/admin/reports", reportPeriod],
  });

  const mockReports: PlatformReports = reports || {
    overview: {
      totalUsers: 0,
      totalClasses: 0,
      totalRevenue: 0,
      activeTeachers: 0,
      completionRate: 0,
      userGrowth: 0,
      revenueGrowth: 0
    },
    userEngagement: {
      dailyActiveUsers: 0,
      averageSessionDuration: 0,
      classCompletionRate: 0,
      repeatEnrollmentRate: 0
    },
    teacherPerformance: [],
    popularClasses: [],
    revenueBreakdown: {
      bySubject: [],
      byMonth: []
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading reports...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Reports</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Analytics and insights for platform performance</p>
              </div>
              <div className="flex gap-2">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-32" data-testid="select-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" data-testid="button-refresh">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-users">
                  {mockReports.overview.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockReports.overview.userGrowth > 0 ? '+' : ''}{mockReports.overview.userGrowth}% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-classes">
                  {mockReports.overview.totalClasses}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockReports.overview.activeTeachers} active teachers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-revenue">
                  ${mockReports.overview.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockReports.overview.revenueGrowth > 0 ? '+' : ''}{mockReports.overview.revenueGrowth}% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-completion-rate">
                  {mockReports.overview.completionRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Average class completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Top Performing Teachers
                </CardTitle>
                <CardDescription>Teachers with highest engagement and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {mockReports.teacherPerformance.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-teacher-data">
                    No teacher performance data available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockReports.teacherPerformance.slice(0, 5).map((teacher) => (
                      <div key={teacher.teacherId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium" data-testid={`teacher-name-${teacher.teacherId}`}>
                            {teacher.teacherName}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span data-testid={`teacher-classes-${teacher.teacherId}`}>
                              {teacher.totalClasses} classes
                            </span>
                            <span data-testid={`teacher-students-${teacher.teacherId}`}>
                              {teacher.totalStudents} students
                            </span>
                            <span data-testid={`teacher-rating-${teacher.teacherId}`}>
                              {teacher.averageRating.toFixed(1)}★
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600" data-testid={`teacher-revenue-${teacher.teacherId}`}>
                            ${teacher.totalRevenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Most Popular Classes
                </CardTitle>
                <CardDescription>Classes with highest enrollment and completion</CardDescription>
              </CardHeader>
              <CardContent>
                {mockReports.popularClasses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-class-data">
                    No class performance data available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockReports.popularClasses.slice(0, 5).map((classItem) => (
                      <div key={classItem.classId} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium" data-testid={`class-title-${classItem.classId}`}>
                            {classItem.title}
                          </h4>
                          <Badge variant="outline" data-testid={`class-rating-${classItem.classId}`}>
                            {classItem.averageRating.toFixed(1)}★
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-4">
                            <span data-testid={`class-enrollments-${classItem.classId}`}>
                              {classItem.enrollmentCount} enrolled
                            </span>
                            <span data-testid={`class-completion-${classItem.classId}`}>
                              {classItem.completionRate.toFixed(1)}% completed
                            </span>
                          </div>
                          <p className="font-semibold text-green-600" data-testid={`class-revenue-${classItem.classId}`}>
                            ${classItem.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          {mockReports.revenueBreakdown.bySubject.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Revenue by Subject
                </CardTitle>
                <CardDescription>Revenue distribution across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockReports.revenueBreakdown.bySubject.map((subject) => (
                    <div key={subject.subject} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize" data-testid={`subject-name-${subject.subject}`}>
                          {subject.subject}
                        </h4>
                        <Badge variant="outline" data-testid={`subject-percentage-${subject.subject}`}>
                          {subject.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-green-600" data-testid={`subject-revenue-${subject.subject}`}>
                        ${subject.revenue.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Engagement */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Engagement Metrics
              </CardTitle>
              <CardDescription>Platform usage and engagement statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" data-testid="engagement-daily-users">
                    {mockReports.userEngagement.dailyActiveUsers}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Daily Active Users</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" data-testid="engagement-session-duration">
                    {mockReports.userEngagement.averageSessionDuration}m
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Avg Session Duration</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" data-testid="engagement-completion-rate">
                    {mockReports.userEngagement.classCompletionRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Class Completion Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" data-testid="engagement-repeat-rate">
                    {mockReports.userEngagement.repeatEnrollmentRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Repeat Enrollment Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}