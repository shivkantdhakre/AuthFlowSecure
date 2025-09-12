import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CalendarDays, Clock, Users, Eye, Ban, CheckCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Class, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ClassWithTeacher extends Class {
  teacher: User;
  enrollmentCount: number;
}

export function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  
  const { data: classes, isLoading } = useQuery<ClassWithTeacher[]>({
    queryKey: ["/api/admin/classes"],
  });

  const updateClassMutation = useMutation({
    mutationFn: async ({ classId, updates }: { classId: string; updates: Partial<Class> }) => {
      return apiRequest("PATCH", `/api/admin/classes/${classId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/classes"] });
      toast({
        title: "Success",
        description: "Class updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    },
  });

  const filteredClasses = classes?.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'live' && classItem.isLive) ||
      (statusFilter === 'scheduled' && !classItem.isLive && new Date(classItem.date) > new Date()) ||
      (statusFilter === 'completed' && !classItem.isLive && new Date(classItem.date) <= new Date());
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (classItem: Class) => {
    if (classItem.isLive) {
      return <Badge className="bg-red-500 hover:bg-red-600">Live</Badge>;
    } else if (new Date(classItem.date) > new Date()) {
      return <Badge variant="secondary">Scheduled</Badge>;
    } else {
      return <Badge variant="outline">Completed</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
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
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Class Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Monitor and manage all classes on the platform</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search classes or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-total-classes">
                  {classes?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600" data-testid="stat-live-classes">
                  {classes?.filter(c => c.isLive).length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600" data-testid="stat-scheduled-classes">
                  {classes?.filter(c => !c.isLive && new Date(c.date) > new Date()).length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600" data-testid="stat-total-enrollments">
                  {classes?.reduce((sum, c) => sum + c.enrollmentCount, 0) || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classes List */}
          {!filteredClasses || filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-classes">
                  {searchQuery || statusFilter ? "No classes found" : "No classes yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery || statusFilter 
                    ? "Try adjusting your search or filters"
                    : "Classes will appear here as teachers create them"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredClasses.map((classItem) => (
                <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(classItem)}
                          <Badge variant="outline" data-testid={`badge-subject-${classItem.id}`}>
                            {classItem.subject}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2" data-testid={`text-class-title-${classItem.id}`}>
                          {classItem.title}
                        </CardTitle>
                        <CardDescription data-testid={`text-class-description-${classItem.id}`}>
                          {classItem.description}
                        </CardDescription>
                      </div>
                    </div>
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
                        <p className="font-medium text-sm" data-testid={`text-teacher-name-${classItem.id}`}>
                          {classItem.teacher.firstName} {classItem.teacher.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400" data-testid={`text-teacher-email-${classItem.id}`}>
                          {classItem.teacher.email}
                        </p>
                      </div>
                    </div>

                    {/* Class Details */}
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
                        <span data-testid={`text-class-enrollment-${classItem.id}`}>
                          {classItem.enrollmentCount}/{classItem.maxStudents} enrolled
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
                      {classItem.isLive && (
                        <Button variant="outline" size="sm" data-testid={`button-monitor-${classItem.id}`}>
                          Monitor Live Class
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto text-red-600 hover:text-red-700" 
                        data-testid={`button-suspend-${classItem.id}`}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Suspend
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