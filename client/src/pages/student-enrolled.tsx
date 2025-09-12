import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock, Video, BookOpen, Star } from "lucide-react";
import { StudentSidebar } from "@/components/student-sidebar";
import { Class, User, Enrollment } from "@shared/schema";
import { Link } from "wouter";

interface EnrolledClass extends Class {
  teacher: User;
  enrollment: Enrollment;
  progress?: number;
}

export function StudentEnrolled() {
  const { data: enrolledClasses, isLoading } = useQuery<EnrolledClass[]>({
    queryKey: ["/api/student/enrolled"],
  });

  const upcomingClasses = enrolledClasses?.filter(c => new Date(c.date) > new Date() && !c.enrollment.completed);
  const completedClasses = enrolledClasses?.filter(c => c.enrollment.completed);
  const inProgressClasses = enrolledClasses?.filter(c => !c.enrollment.completed && new Date(c.date) <= new Date());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StudentSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading your classes...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StudentSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Track your learning journey</p>
          </div>

          {!enrolledClasses || enrolledClasses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-enrolled">No enrolled classes</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start learning by browsing and enrolling in classes
                </p>
                <Button asChild data-testid="button-browse-classes">
                  <Link href="/student/browse">Browse Classes</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Classes */}
              {upcomingClasses && upcomingClasses.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Classes</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingClasses.map((classItem) => (
                      <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" data-testid={`badge-subject-${classItem.id}`}>
                              {classItem.subject}
                            </Badge>
                            <Badge variant="secondary" data-testid={`badge-upcoming-${classItem.id}`}>
                              Upcoming
                            </Badge>
                          </div>
                          <CardTitle className="text-lg" data-testid={`text-class-title-${classItem.id}`}>
                            {classItem.title}
                          </CardTitle>
                          <CardDescription data-testid={`text-class-description-${classItem.id}`}>
                            {classItem.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback data-testid={`avatar-teacher-${classItem.id}`}>
                                {classItem.teacher.firstName[0]}{classItem.teacher.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium" data-testid={`text-teacher-name-${classItem.id}`}>
                                {classItem.teacher.firstName} {classItem.teacher.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <CalendarDays className="w-4 h-4 mr-2" />
                              <span data-testid={`text-class-date-${classItem.id}`}>
                                {new Date(classItem.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4 mr-2" />
                              <span data-testid={`text-class-time-${classItem.id}`}>
                                {new Date(classItem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          <Button className="w-full" data-testid={`button-join-${classItem.id}`}>
                            <Video className="w-4 h-4 mr-2" />
                            Join Class
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* In Progress Classes */}
              {inProgressClasses && inProgressClasses.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">In Progress</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {inProgressClasses.map((classItem) => (
                      <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" data-testid={`badge-subject-${classItem.id}`}>
                              {classItem.subject}
                            </Badge>
                            <Badge className="bg-blue-500 hover:bg-blue-600" data-testid={`badge-progress-${classItem.id}`}>
                              In Progress
                            </Badge>
                          </div>
                          <CardTitle className="text-lg" data-testid={`text-class-title-${classItem.id}`}>
                            {classItem.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span data-testid={`text-progress-${classItem.id}`}>
                                {classItem.progress || 0}%
                              </span>
                            </div>
                            <Progress value={classItem.progress || 0} className="h-2" />
                          </div>
                          
                          <Button className="w-full" data-testid={`button-continue-${classItem.id}`}>
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Completed Classes */}
              {completedClasses && completedClasses.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Completed</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {completedClasses.map((classItem) => (
                      <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" data-testid={`badge-subject-${classItem.id}`}>
                              {classItem.subject}
                            </Badge>
                            <Badge variant="default" data-testid={`badge-completed-${classItem.id}`}>
                              Completed
                            </Badge>
                          </div>
                          <CardTitle className="text-lg" data-testid={`text-class-title-${classItem.id}`}>
                            {classItem.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback data-testid={`avatar-teacher-${classItem.id}`}>
                                {classItem.teacher.firstName[0]}{classItem.teacher.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium" data-testid={`text-teacher-name-${classItem.id}`}>
                                {classItem.teacher.firstName} {classItem.teacher.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Button variant="outline" size="sm" data-testid={`button-review-${classItem.id}`}>
                              <Star className="w-4 h-4 mr-2" />
                              Leave Review
                            </Button>
                            <Button variant="outline" size="sm" data-testid={`button-view-content-${classItem.id}`}>
                              View Content
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}