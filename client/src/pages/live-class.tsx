import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  Share, 
  LogOut,
  Send,
  Crown
} from "lucide-react";

export default function LiveClass() {
  const { user } = useAuth();
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Teacher", message: "Welcome to the Advanced React Patterns class!", isTeacher: true },
    { id: 2, sender: "Alex Chen", message: "Great explanation! Thanks for the demo.", isTeacher: false },
    { id: 3, sender: "Sarah Kim", message: "Could you show the useCallback example again?", isTeacher: false },
  ]);

  const participants = [
    { id: 1, name: "John Smith", role: "Teacher", isTeacher: true },
    { id: 2, name: "Alex Chen", role: "Student", isTeacher: false, handRaised: true },
    { id: 3, name: "Sarah Kim", role: "Student", isTeacher: false },
    { id: 4, name: "Mike Johnson", role: "Student", isTeacher: false },
  ];

  useEffect(() => {
    // WebSocket connection for live chat would be implemented here
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // const socket = new WebSocket(wsUrl);
    // socket.onopen = () => {
    //   socket.send(JSON.stringify({
    //     type: 'join_class',
    //     userId: user?.id,
    //     classId: 'current-class-id'
    //   }));
    // };
    
    return () => {
      // socket.close();
    };
  }, [user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: user?.firstName + " " + user?.lastName || "You",
        message: chatMessage,
        isTeacher: user?.role === 'teacher'
      }]);
      setChatMessage("");
    }
  };

  const toggleRaiseHand = () => {
    setHandRaised(!handRaised);
  };

  return (
    <div className="min-h-screen pt-16 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Live Class: Advanced React Patterns</h1>
        <p className="text-muted-foreground">with John Smith • 45 students online</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Video Area */}
        <div className="lg:col-span-3">
          <Card className="glass overflow-hidden mb-6">
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {/* Teacher video stream placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">JS</span>
                  </div>
                  <h3 className="text-white text-xl font-semibold">John Smith</h3>
                  <p className="text-blue-200">Teaching Advanced React Patterns</p>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <Button
                  size="sm"
                  variant={isAudioMuted ? "destructive" : "secondary"}
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                >
                  {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isVideoOff ? "destructive" : "secondary"}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={handRaised ? "default" : "outline"}
                  onClick={toggleRaiseHand}
                  className={handRaised ? "bg-blue-500" : ""}
                >
                  <Hand className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <Badge variant="destructive" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  LIVE
                </Badge>
              </div>
            </div>
          </Card>

          {/* Class Controls */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Hand className="w-4 h-4 mr-2" />
                    {handRaised ? "Lower Hand" : "Raise Hand"}
                  </Button>
                  <Button variant="outline" className="glass">
                    <Share className="w-4 h-4 mr-2" />
                    Share Screen
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Duration: 45:30</span>
                  <Button variant="destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Class
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat and Participants */}
        <div className="space-y-6">
          {/* Chat */}
          <Card className="glass h-96">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Class Chat</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="px-4 h-64 overflow-y-auto space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <div className={`font-semibold ${message.isTeacher ? 'text-purple-400' : 'text-blue-400'}`}>
                      {message.sender}
                      {message.isTeacher && <Crown className="w-3 h-3 inline ml-1 text-yellow-400" />}
                    </div>
                    <div className="text-muted-foreground">{message.message}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 glass text-sm"
                  />
                  <Button type="submit" size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Participants ({participants.length})</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 max-h-64 overflow-y-auto space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{participant.name}</div>
                    <div className="text-xs text-muted-foreground">{participant.role}</div>
                  </div>
                  {participant.isTeacher && <Crown className="w-4 h-4 text-yellow-400" />}
                  {participant.handRaised && <Hand className="w-4 h-4 text-blue-400" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
