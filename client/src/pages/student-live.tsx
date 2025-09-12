import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, MicOff, VideoOff, Hand, MessageCircle, Users, Settings } from "lucide-react";
import { StudentSidebar } from "@/components/student-sidebar";
import { Class, User, Message } from "@shared/schema";
import { Link } from "wouter";

interface LiveClass extends Class {
  teacher: User;
  participantCount: number;
  messages: Message[];
}

export function StudentLive() {
  const [message, setMessage] = useState("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);

  const { data: liveClasses, isLoading } = useQuery<LiveClass[]>({
    queryKey: ["/api/classes/live"],
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message via WebSocket
      setMessage("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StudentSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading live classes...</div>
          </div>
        </main>
      </div>
    );
  }

  // Show available live classes if not in a specific class
  if (!liveClasses || liveClasses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StudentSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Join ongoing live classes</p>
            </div>

            <Card>
              <CardContent className="text-center py-12">
                <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-live-classes">No live classes</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  There are no live classes at the moment. Check your enrolled classes for upcoming sessions.
                </p>
                <Button asChild data-testid="button-my-classes">
                  <Link href="/student/enrolled">View My Classes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Show list of available live classes
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StudentSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Join ongoing live classes</p>
          </div>

          <div className="grid gap-6">
            {liveClasses.map((liveClass) => (
              <Card key={liveClass.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-500 hover:bg-red-600 animate-pulse" data-testid={`badge-live-${liveClass.id}`}>
                          LIVE
                        </Badge>
                        <Badge variant="outline" data-testid={`badge-subject-${liveClass.id}`}>
                          {liveClass.subject}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2" data-testid={`text-class-title-${liveClass.id}`}>
                        {liveClass.title}
                      </CardTitle>
                      <CardDescription data-testid={`text-class-description-${liveClass.id}`}>
                        {liveClass.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback data-testid={`avatar-teacher-${liveClass.id}`}>
                            {liveClass.teacher.firstName[0]}{liveClass.teacher.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm" data-testid={`text-teacher-name-${liveClass.id}`}>
                            {liveClass.teacher.firstName} {liveClass.teacher.lastName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span data-testid={`text-participant-count-${liveClass.id}`}>
                          {liveClass.participantCount} participants
                        </span>
                      </div>
                    </div>

                    <Button size="lg" className="bg-red-500 hover:bg-red-600" data-testid={`button-join-${liveClass.id}`}>
                      <Video className="w-4 h-4 mr-2" />
                      Join Live Class
                    </Button>
                  </div>

                  {/* Live Class Interface (when joining) */}
                  <div className="hidden border-t pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Video Area */}
                      <div className="lg:col-span-3">
                        <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Video stream will appear here</p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            variant={isAudioOn ? "default" : "destructive"}
                            size="sm"
                            onClick={() => setIsAudioOn(!isAudioOn)}
                            data-testid="button-toggle-audio"
                          >
                            {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant={isVideoOn ? "default" : "destructive"}
                            size="sm"
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            data-testid="button-toggle-video"
                          >
                            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant={handRaised ? "default" : "outline"}
                            size="sm"
                            onClick={() => setHandRaised(!handRaised)}
                            data-testid="button-raise-hand"
                          >
                            <Hand className={`w-4 h-4 ${handRaised ? 'text-yellow-500' : ''}`} />
                          </Button>
                          <Button variant="outline" size="sm" data-testid="button-settings">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Chat */}
                      <div className="lg:col-span-1">
                        <Card className="h-96">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <ScrollArea className="h-60 px-4">
                              <div className="space-y-3">
                                {liveClass.messages?.map((msg, index) => (
                                  <div key={index} className="text-sm" data-testid={`message-${index}`}>
                                    <span className="font-semibold">Student:</span>
                                    <p className="text-gray-600 dark:text-gray-300">{msg.message}</p>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                            <div className="flex gap-2 p-4 border-t">
                              <Input
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                data-testid="input-chat-message"
                              />
                              <Button size="sm" onClick={handleSendMessage} data-testid="button-send-message">
                                Send
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}