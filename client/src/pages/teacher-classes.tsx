import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Users, Eye, Edit, Trash2 } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher-sidebar";
import { Class } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";

export function TeacherClasses() {
  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ["/api/teacher/classes"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TeacherSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading classes...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TeacherSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your classes and view enrollments</p>
          </div>

          {classes && classes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-classes">No classes yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create your first class to start teaching
                </p>
                <Button asChild data-testid="button-create-first-class">
                  <Link href="/teacher/create">Create Your First Class</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {classes?.map((classItem) => (
                <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2" data-testid={`text-class-title-${classItem.id}`}>
                          {classItem.title}
                        </CardTitle>
                        <CardDescription data-testid={`text-class-description-${classItem.id}`}>
                          {classItem.description}
                        </CardDescription>
                      </div>
                      <Badge variant={classItem.isLive ? "default" : "secondary"} data-testid={`badge-status-${classItem.id}`}>
                        {classItem.isLive ? "Live" : "Scheduled"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <span data-testid={`text-class-date-${classItem.id}`}>
                          {format(new Date(classItem.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        <span data-testid={`text-class-duration-${classItem.id}`}>
                          {classItem.duration} mins
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2" />
                        <span data-testid={`text-class-capacity-${classItem.id}`}>
                          0/{classItem.maxStudents} enrolled
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-lg font-semibold text-green-600" data-testid={`text-class-price-${classItem.id}`}>
                          ${classItem.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-view-${classItem.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-edit-${classItem.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" data-testid={`button-delete-${classItem.id}`}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}