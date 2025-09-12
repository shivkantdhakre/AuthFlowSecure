import { TeacherSidebar } from "@/components/teacher-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { insertClassSchema, type InsertClass } from "@shared/schema";
import { CalendarDays, Clock, Users, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { z } from "zod";

const createClassSchema = insertClassSchema.extend({
  dateString: z.string().min(1, "Date is required"),
  timeString: z.string().min(1, "Time is required"),
}).omit({ teacherId: true, date: true });

type CreateClassForm = z.infer<typeof createClassSchema>;

export default function CreateClass() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<CreateClassForm>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      price: "0",
      maxStudents: 20,
      duration: 60,
      dateString: "",
      timeString: "",
      isLive: false,
    },
  });

  const createClassMutation = useMutation({
    mutationFn: async (data: CreateClassForm) => {
      const { dateString, timeString, ...classData } = data;
      const datetime = new Date(`${dateString}T${timeString}`);
      
      return apiRequest("POST", "/api/classes", {
        ...classData,
        date: datetime.toISOString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Class created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/classes"] });
      setLocation("/teacher");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create class",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateClassForm) => {
    createClassMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen pt-16">
      <TeacherSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-8">
          <Link href="/teacher">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create New Class</h1>
          <p className="text-muted-foreground">Schedule a new live class for your students</p>
        </div>

        <Card className="glass max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Class Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Advanced React Patterns" 
                          {...field} 
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what students will learn in this class..."
                          rows={3}
                          {...field}
                          value={field.value || ""}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-subject">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="programming">Programming</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="data-science">Data Science</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="0" 
                            {...field}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Max Students
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="20" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-max-students"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Duration (minutes)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="60" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-duration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateString"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            data-testid="input-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeString"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field}
                            data-testid="input-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600" 
                    disabled={createClassMutation.isPending}
                    data-testid="button-create-class"
                  >
                    {createClassMutation.isPending ? "Creating..." : "Create Class"}
                  </Button>
                  <Link href="/teacher">
                    <Button variant="outline" data-testid="button-cancel">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}