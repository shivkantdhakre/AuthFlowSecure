import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Video, Image, Upload, Search, Filter, Download, Trash2, Plus, Sparkles } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher-sidebar";
import { Content } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function TeacherContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    content: "",
    type: "pdf" as const,
    file: null as File | null
  });
  const { toast } = useToast();
  
  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/teacher/content"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest("POST", "/api/teacher/content", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/content"] });
      setUploadDialogOpen(false);
      setUploadForm({ title: "", content: "", type: "pdf", file: null });
      toast({ title: "Success", description: "Content uploaded successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload content", variant: "destructive" });
    }
  });

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.file) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("content", uploadForm.content);
    formData.append("type", uploadForm.type);
    formData.append("file", uploadForm.file);

    uploadMutation.mutate(formData);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-5 h-5" />;
      case "pdf": return <FileText className="w-5 h-5" />;
      case "slide": return <Image className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-gradient-to-br from-blue-500/20 to-blue-600/30 text-blue-300 border border-blue-500/20";
      case "pdf": return "bg-gradient-to-br from-red-500/20 to-red-600/30 text-red-300 border border-red-500/20";
      case "slide": return "bg-gradient-to-br from-green-500/20 to-green-600/30 text-green-300 border border-green-500/20";
      default: return "bg-gradient-to-br from-gray-500/20 to-gray-600/30 text-gray-300 border border-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <TeacherSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="glass-strong rounded-2xl p-8 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary animate-pulse" />
                <div className="text-lg font-medium">Loading content library...</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TeacherSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="glass-strong rounded-3xl p-6 hover-lift">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Content Library
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">Manage your educational materials and resources</p>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search your amazing content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg glass border-2 hover:border-primary/50 transition-all duration-300"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 glass hover:glass-strong hover-lift" data-testid="button-filter">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover-lift shadow-lg" data-testid="button-upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Content
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong border-primary/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Upload Educational Content
                  </DialogTitle>
                  <DialogDescription>
                    Share knowledge with your students by uploading videos, PDFs, slides, and more.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      placeholder="e.g., Introduction to React Hooks"
                      className="glass border-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="content"
                      value={uploadForm.content}
                      onChange={(e) => setUploadForm({...uploadForm, content: e.target.value})}
                      placeholder="Brief description of the content..."
                      className="glass border-primary/20 min-h-20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type" className="text-sm font-medium">Content Type</Label>
                    <Select value={uploadForm.type} onValueChange={(value) => setUploadForm({...uploadForm, type: value as any})}>
                      <SelectTrigger className="glass border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="slide">Presentation/Slides</SelectItem>
                        <SelectItem value="note">Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file" className="text-sm font-medium">File *</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                      className="glass border-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                      accept=".pdf,.mp4,.pptx,.docx,.txt"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setUploadDialogOpen(false)}
                    className="glass hover:glass-strong"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Content"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!content || content.length === 0 ? (
            <div className="glass-strong rounded-3xl p-12 text-center hover-lift">
              <div className="relative inline-block mb-6">
                <Upload className="w-20 h-20 mx-auto text-primary/70" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" data-testid="text-no-content">
                No content yet
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                Start building your educational library! Upload videos, PDFs, slides, and other materials for your classes.
              </p>
              <Button 
                onClick={() => setUploadDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover-lift shadow-xl px-8 py-3 text-lg" 
                data-testid="button-upload-first"
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload Your First Content
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {content?.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content?.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((item) => (
                <div key={item.id} className="glass-strong rounded-2xl p-6 hover-lift border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl ${getContentTypeColor(item.type)} shadow-lg`}>
                      {getContentIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent" data-testid={`text-content-title-${item.id}`}>
                          {item.title}
                        </h3>
                        <Badge className={`${getContentTypeColor(item.type)} shadow-sm font-medium px-3 py-1`} data-testid={`badge-type-${item.id}`}>
                          {item.type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {item.content && (
                        <p className="text-muted-foreground mb-4 line-clamp-2 text-base leading-relaxed" data-testid={`text-content-description-${item.id}`}>
                          {item.content}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full" data-testid={`text-content-date-${item.id}`}>
                          📅 {new Date(item.createdAt!).toLocaleDateString()}
                        </span>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="glass hover:glass-strong hover-lift" data-testid={`button-download-${item.id}`}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="glass hover:bg-destructive/20 text-destructive hover:text-destructive hover-lift" data-testid={`button-delete-content-${item.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}