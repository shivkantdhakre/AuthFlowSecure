import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, University, Presentation } from "lucide-react";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  // Redirect if already logged in
  if (user) {
    switch (user.role) {
      case 'student':
        return <Redirect to="/student" />;
      case 'teacher':
        return <Redirect to="/teacher" />;
      case 'admin':
        return <Redirect to="/admin" />;
      default:
        return <Redirect to="/" />;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      registerMutation.mutate({
        ...formData,
        role,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-20">
      <Card className="glass-strong w-full max-w-md hover:scale-105 transition-transform">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to EduStream</h2>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          {!isLogin && (
            <div className="space-y-4 mb-8">
              <Label>Choose your role</Label>
              <RadioGroup value={role} onValueChange={setRole}>
                <div className="flex items-center space-x-2 p-4 glass rounded-xl">
                  <RadioGroupItem value="student" id="student" />
                  <label htmlFor="student" className="flex items-center cursor-pointer flex-1">
                    <University className="text-blue-400 mr-3" />
                    <div>
                      <div className="font-semibold">Student</div>
                      <div className="text-sm text-muted-foreground">Join classes and learn</div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 p-4 glass rounded-xl">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <label htmlFor="teacher" className="flex items-center cursor-pointer flex-1">
                    <Presentation className="text-purple-400 mr-3" />
                    <div>
                      <div className="font-semibold">Teacher</div>
                      <div className="text-sm text-muted-foreground">Create and teach classes</div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="glass"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="glass"
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="glass"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={formData.password}
                onChange={handleInputChange}
                className="glass"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? 
                (loginMutation.isPending ? "Signing In..." : "Sign In") :
                (registerMutation.isPending ? "Creating Account..." : "Create Account")
              }
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>

          {/* Demo Credentials */}
          <Card className="mt-8 glass">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Demo Credentials:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Student: student@demo.com / demo123</div>
                <div>Teacher: teacher@demo.com / demo123</div>
                <div>Admin: admin@demo.com / admin123</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
