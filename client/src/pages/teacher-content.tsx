import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Video, Image, Upload, Search, Filter, Download, Trash2 } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher-sidebar";
import { Content } from "@shared/schema";

export function TeacherContent() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/teacher/content"],
  });

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
      case "video": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pdf": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "slide": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TeacherSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading content library...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Library</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your educational materials and resources</p>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" data-testid="button-filter">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button data-testid="button-upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Content
            </Button>
          </div>

          {!content || content.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-content">No content yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Upload videos, PDFs, slides, and other materials for your classes
                </p>
                <Button data-testid="button-upload-first">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {content?.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getContentTypeColor(item.type)}`}>
                        {getContentIcon(item.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" data-testid={`text-content-title-${item.id}`}>
                            {item.title}
                          </h3>
                          <Badge className={getContentTypeColor(item.type)} data-testid={`badge-type-${item.id}`}>
                            {item.type.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {item.content && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2" data-testid={`text-content-description-${item.id}`}>
                            {item.content}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-content-date-${item.id}`}>
                            Uploaded {new Date(item.createdAt!).toLocaleDateString()}
                          </span>
                          
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" data-testid={`button-download-${item.id}`}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" data-testid={`button-delete-content-${item.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
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