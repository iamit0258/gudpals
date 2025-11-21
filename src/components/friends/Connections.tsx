
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Phone, Video, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const mockConnections = [
  {
    id: "1",
    name: {
      en: "Sunil Patil",
      hi: "सुनील पाटिल"
    },
    status: "online",
    lastSeen: "Active now"
  },
];

const Connections = () => {
  const [connections, setConnections] = useState(mockConnections);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState({});

  const handleMessage = (id, name) => {
    const displayName = typeof name === 'object' ? (language === 'en' ? name.en : name.hi) : name;
    
    // Initialize messages for this connection if not already done
    if (!messages[id]) {
      setMessages(prev => ({
        ...prev,
        [id]: []
      }));
    }
    setCurrentChat({id, name: displayName});
    setChatOpen(true);
  };

  const handleVoiceCall = (name) => {
    const displayName = typeof name === 'object' ? (language === 'en' ? name.en : name.hi) : name;
    toast({
      title: t("calling"),
      description: `${t("voice_calling")} ${displayName}...`,
    });
  };

  const handleVideoCall = (name) => {
    const displayName = typeof name === 'object' ? (language === 'en' ? name.en : name.hi) : name;
    toast({
      title: t("video_calling"),
      description: `${t("video_calling")} ${displayName}...`,
    });
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !currentChat) return;
    
    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => ({
      ...prev,
      [currentChat.id]: [...(prev[currentChat.id] || []), newMessage]
    }));
    
    setMessageInput("");
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        text: `Hello! This is an automated response from ${currentChat.name}.`,
        sender: 'other',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => ({
        ...prev,
        [currentChat.id]: [...(prev[currentChat.id] || []), replyMessage]
      }));
    }, 1000);
  };

  const filteredConnections = connections.filter(connection => {
    const nameToCheck = typeof connection.name === 'object' 
      ? (language === 'en' ? connection.name.en : connection.name.hi) 
      : connection.name;
    
    return nameToCheck.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helper function to get the correct name to display based on language
  const getDisplayName = (nameObj) => {
    if (typeof nameObj === 'object') {
      return language === 'en' ? nameObj.en : nameObj.hi;
    }
    return nameObj || '';
  };

  // Helper function to get initials safely
  const getInitial = (nameObj) => {
    const displayName = getDisplayName(nameObj);
    return displayName ? displayName.charAt(0).toUpperCase() : 'U';
  };

  // Format timestamp for chat
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder={t("search_friends")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredConnections.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>{t("no_matches_found")}</p>
        </div>
      ) : (
        filteredConnections.map((connection) => (
          <Card key={connection.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="text-white bg-gradient-to-br from-green-500 to-blue-500">
                      {getInitial(connection.name)}
                    </AvatarFallback>
                  </Avatar>
                  {connection.status === "online" && (
                    <span className="absolute bottom-0 right-4 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {getDisplayName(connection.name)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {connection.status === "online" ? t("active_now") : connection.lastSeen}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-dhayan-teal hover:bg-dhayan-teal/10 rounded-full h-9 w-9 p-0"
                    onClick={() => handleMessage(connection.id, connection.name)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-dhayan-purple hover:bg-dhayan-purple/10 rounded-full h-9 w-9 p-0"
                    onClick={() => handleVoiceCall(connection.name)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-dhayan-orange hover:bg-dhayan-orange/10 rounded-full h-9 w-9 p-0"
                    onClick={() => handleVideoCall(connection.name)}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b pb-2">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 h-8 w-8 p-0" 
                onClick={() => setChatOpen(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>{currentChat?.name}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 min-h-[300px]">
            {currentChat && (messages[currentChat.id]?.length > 0 ? (
              messages[currentChat.id].map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  {t("start_conversation")}
                </p>
              </div>
            ))}
          </div>
          
          <DialogFooter className="flex-shrink-0 border-t pt-2">
            <div className="flex w-full items-center gap-2">
              <Input 
                placeholder={t("type_message")}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="sm"
                onClick={sendMessage}
                disabled={!messageInput.trim()}
              >
                {t("send")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connections;
