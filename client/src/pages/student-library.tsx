import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Image, Search, Download, BookOpen, Play } from "lucide-react";
import { StudentSidebar } from "@/components/student-sidebar";
import { Content } from "@shared/schema";

interface ContentWithClass extends Content {
  className: string;
}

export function StudentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: content, isLoading } = useQuery<ContentWithClass[]>({
    queryKey: ["/api/student/library"],
  });

  const filteredContent = content?.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const videoContent = filteredContent?.filter(item => item.type === 'video');
  const pdfContent = filteredContent?.filter(item => item.type === 'pdf');
  const slideContent = filteredContent?.filter(item => item.type === 'slide');
  const noteContent = filteredContent?.filter(item => item.type === 'note');

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

  const renderContentGrid = (items: ContentWithClass[] | undefined, emptyMessage: string) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500" data-testid="text-no-content">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${getContentTypeColor(item.type)}`}>
                  {getContentIcon(item.type)}
                </div>
                <Badge variant="outline" data-testid={`badge-type-${item.id}`}>
                  {item.type.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-lg" data-testid={`text-content-title-${item.id}`}>
                {item.title}
              </CardTitle>
              <CardDescription data-testid={`text-class-name-${item.id}`}>
                From: {item.className}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {item.content && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3" data-testid={`text-content-description-${item.id}`}>
                  {item.content}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-content-date-${item.id}`}>
                  {new Date(item.createdAt!).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  {item.type === 'video' ? (
                    <Button size="sm" data-testid={`button-play-${item.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  ) : (
                    <Button size="sm" data-testid={`button-view-${item.id}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" data-testid={`button-download-${item.id}`}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StudentSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading your library...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Library</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Access materials from your enrolled classes</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search content, classes, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          {!content || content.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-library">No content available</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Content from your enrolled classes will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({filteredContent?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="videos" data-testid="tab-videos">
                  Videos ({videoContent?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="pdfs" data-testid="tab-pdfs">
                  PDFs ({pdfContent?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="slides" data-testid="tab-slides">
                  Slides ({slideContent?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="notes" data-testid="tab-notes">
                  Notes ({noteContent?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {renderContentGrid(filteredContent, 
                  searchQuery ? "No content found matching your search" : "No content available"
                )}
              </TabsContent>

              <TabsContent value="videos">
                {renderContentGrid(videoContent, "No video content available")}
              </TabsContent>

              <TabsContent value="pdfs">
                {renderContentGrid(pdfContent, "No PDF content available")}
              </TabsContent>

              <TabsContent value="slides">
                {renderContentGrid(slideContent, "No slide content available")}
              </TabsContent>

              <TabsContent value="notes">
                {renderContentGrid(noteContent, "No notes available")}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}