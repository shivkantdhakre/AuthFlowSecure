import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Navbar } from "@/components/navbar";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import { StudentBrowse } from "@/pages/student-browse";
import { StudentEnrolled } from "@/pages/student-enrolled";
import { StudentLibrary } from "@/pages/student-library";
import { StudentProgress } from "@/pages/student-progress";
import { StudentLive } from "@/pages/student-live";
import TeacherDashboard from "@/pages/teacher-dashboard";
import { TeacherClasses } from "@/pages/teacher-classes";
import { TeacherContent } from "@/pages/teacher-content";
import { TeacherStudents } from "@/pages/teacher-students";
import { TeacherAnalytics } from "@/pages/teacher-analytics";
import CreateClass from "@/pages/create-class";
import AdminDashboard from "@/pages/admin-dashboard";
import { AdminUsers } from "@/pages/admin-users";
import { AdminClasses } from "@/pages/admin-classes";
import { AdminPayments } from "@/pages/admin-payments";
import { AdminReports } from "@/pages/admin-reports";
import LiveClass from "@/pages/live-class";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Student Routes */}
      <ProtectedRoute path="/student/browse" component={StudentBrowse} requiredRole="student" />
      <ProtectedRoute path="/student/enrolled" component={StudentEnrolled} requiredRole="student" />
      <ProtectedRoute path="/student/library" component={StudentLibrary} requiredRole="student" />
      <ProtectedRoute path="/student/progress" component={StudentProgress} requiredRole="student" />
      <ProtectedRoute path="/student/live" component={StudentLive} requiredRole="student" />
      <ProtectedRoute path="/student" component={StudentDashboard} requiredRole="student" />
      
      {/* Teacher Routes */}
      <ProtectedRoute path="/teacher/classes" component={TeacherClasses} requiredRole="teacher" />
      <ProtectedRoute path="/teacher/content" component={TeacherContent} requiredRole="teacher" />
      <ProtectedRoute path="/teacher/students" component={TeacherStudents} requiredRole="teacher" />
      <ProtectedRoute path="/teacher/analytics" component={TeacherAnalytics} requiredRole="teacher" />
      <ProtectedRoute path="/teacher/create" component={CreateClass} requiredRole="teacher" />
      <ProtectedRoute path="/teacher" component={TeacherDashboard} requiredRole="teacher" />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin/users" component={AdminUsers} requiredRole="admin" />
      <ProtectedRoute path="/admin/classes" component={AdminClasses} requiredRole="admin" />
      <ProtectedRoute path="/admin/payments" component={AdminPayments} requiredRole="admin" />
      <ProtectedRoute path="/admin/reports" component={AdminReports} requiredRole="admin" />
      <ProtectedRoute path="/admin" component={AdminDashboard} requiredRole="admin" />
      
      {/* Live Class Route */}
      <ProtectedRoute path="/live/:classId" component={LiveClass} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Navbar />
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
