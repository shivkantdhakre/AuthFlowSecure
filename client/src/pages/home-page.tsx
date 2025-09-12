import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Video, 
  GraduationCap, 
  TrendingUp, 
  Rocket, 
  Presentation 
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Learn with the{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Future
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join live interactive classes, connect with expert teachers, and accelerate your learning journey with cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {user ? (
              user.role === 'student' ? (
                <Link href="/student">
                  <Button size="lg" className="glass-strong bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Rocket className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : user.role === 'teacher' ? (
                <Link href="/teacher">
                  <Button size="lg" className="glass-strong bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Presentation className="w-5 h-5 mr-2" />
                    Teacher Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button size="lg" className="glass-strong bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    Admin Panel
                  </Button>
                </Link>
              )
            ) : (
              <>
                <Link href="/auth">
                  <Button size="lg" className="glass-strong bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Learning
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline" className="glass">
                    <Presentation className="w-5 h-5 mr-2" />
                    Teach Online
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card className="glass hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Video className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Live Interactive Classes</h3>
                <p className="text-muted-foreground">Join real-time classes with video, chat, and interactive features. Raise your hand and get personalized attention.</p>
              </CardContent>
            </Card>

            <Card className="glass hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Expert Teachers</h3>
                <p className="text-muted-foreground">Learn from verified professionals with ratings, reviews, and proven track records in their subjects.</p>
              </CardContent>
            </Card>

            <Card className="glass hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
                <p className="text-muted-foreground">Monitor your learning journey with detailed analytics, streaks, and achievement badges.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <Card className="glass p-12">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by learners worldwide</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">2K+</div>
                <div className="text-muted-foreground">Expert Teachers</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">100K+</div>
                <div className="text-muted-foreground">Classes Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">4.9★</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
