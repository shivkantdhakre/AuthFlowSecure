import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, CalendarDays, Clock, Users, Star } from "lucide-react";
import { StudentSidebar } from "@/components/student-sidebar";
import { Class, User } from "@shared/schema";

interface ClassWithTeacher extends Class {
  teacher: User;
}

export function StudentBrowse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  
  const { data: classes, isLoading } = useQuery<ClassWithTeacher[]>({
    queryKey: ["/api/classes/browse"],
  });

  const filteredClasses = classes?.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = !subjectFilter || classItem.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StudentSidebar />
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
      <StudentSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Classes</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Discover and enroll in live classes</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search classes, teachers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-48" data-testid="select-subject-filter">
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All subjects</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!filteredClasses || filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-classes">
                  {searchQuery || subjectFilter ? "No classes found" : "No classes available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery || subjectFilter 
                    ? "Try adjusting your search or filters"
                    : "Check back later for new classes"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses?.map((classItem) => (
                <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" data-testid={`badge-subject-${classItem.id}`}>
                        {classItem.subject}
                      </Badge>
                      {classItem.isLive && (
                        <Badge className="bg-red-500 hover:bg-red-600" data-testid={`badge-live-${classItem.id}`}>
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mb-2" data-testid={`text-class-title-${classItem.id}`}>
                      {classItem.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mb-4" data-testid={`text-class-description-${classItem.id}`}>
                      {classItem.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Teacher Info */}
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

                    {/* Class Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <span data-testid={`text-class-date-${classItem.id}`}>
                          {new Date(classItem.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        <span data-testid={`text-class-duration-${classItem.id}`}>
                          {classItem.duration} minutes
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2" />
                        <span data-testid={`text-class-capacity-${classItem.id}`}>
                          {classItem.maxStudents} max students
                        </span>
                      </div>
                    </div>

                    {/* Pricing and Enrollment */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600" data-testid={`text-class-price-${classItem.id}`}>
                        ${classItem.price}
                      </span>
                      <Button data-testid={`button-enroll-${classItem.id}`}>
                        Enroll Now
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