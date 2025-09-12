import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, MessageCircle, MoreHorizontal } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher-sidebar";
import { User, Enrollment } from "@shared/schema";
import { useState } from "react";

interface StudentWithEnrollment extends User {
  enrollment: Enrollment;
  className: string;
}

export function TeacherStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: students, isLoading } = useQuery<StudentWithEnrollment[]>({
    queryKey: ["/api/teacher/students"],
  });

  const filteredStudents = students?.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TeacherSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading students...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Students</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">View and manage students enrolled in your classes</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students by name, email, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-students"
              />
            </div>
          </div>

          {!filteredStudents || filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-students">
                  {searchQuery ? "No students found" : "No students yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery 
                    ? "Try adjusting your search terms"
                    : "Students will appear here once they enroll in your classes"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredStudents?.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback data-testid={`avatar-${student.id}`}>
                          {student.firstName[0]}{student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`text-student-name-${student.id}`}>
                            {student.firstName} {student.lastName}
                          </h3>
                          <Badge 
                            variant={student.enrollment.completed ? "default" : "secondary"}
                            data-testid={`badge-status-${student.id}`}
                          >
                            {student.enrollment.completed ? "Completed" : "Enrolled"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2" data-testid={`text-student-email-${student.id}`}>
                          {student.email}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span data-testid={`text-class-name-${student.id}`}>
                            Class: {student.className}
                          </span>
                          <span data-testid={`text-enrollment-date-${student.id}`}>
                            Enrolled: {new Date(student.enrollment.enrolledAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" data-testid={`button-email-${student.id}`}>
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-message-${student.id}`}>
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-more-${student.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredStudents && filteredStudents.length > 0 && (
            <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
              <p data-testid="text-student-count">
                Showing {filteredStudents.length} of {students?.length} students
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}