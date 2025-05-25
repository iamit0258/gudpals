
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "astrologer";
  timestamp: Date;
}

const AstrologyChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [astrologer, setAstrologer] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load astrologer data from localStorage
  useEffect(() => {
    const storedAstrologer = localStorage.getItem("selectedAstrologer");
    if (storedAstrologer) {
      setAstrologer(JSON.parse(storedAstrologer));
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now().toString(),
        text: `Hello! I'm ${JSON.parse(storedAstrologer).name}. How can I help you with your astrological questions today?`,
        sender: "astrologer",
        timestamp: new Date()
      } as Message;
      
      setMessages([welcomeMessage]);
    } else {
      // No astrologer selected, redirect back
      toast({
        title: "Error",
        description: "No astrologer selected. Please select an astrologer first.",
        variant: "destructive"
      });
      navigate("/astrology");
    }
  }, [navigate, toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Save chat history to localStorage
    const chatHistory = JSON.parse(localStorage.getItem("astrologyChats") || "{}");
    if (!chatHistory[astrologer?.id]) {
      chatHistory[astrologer?.id] = [];
    }
    chatHistory[astrologer?.id].push(userMessage);
    localStorage.setItem("astrologyChats", JSON.stringify(chatHistory));

    // Simulate astrologer response after a delay
    setTimeout(() => {
      const responses = [
        "I see the stars aligning in your favor. This is a good time for new beginnings.",
        "Mercury is in retrograde, which might explain the communication challenges you're experiencing.",
        "Your birth chart suggests a strong influence from Jupiter, bringing opportunities for growth.",
        "The position of Venus indicates positive developments in your relationships soon.",
        "Based on your zodiac sign, I would recommend focusing on self-care during this lunar cycle.",
        "The celestial patterns suggest a period of reflection would be beneficial for you right now."
      ];
      
      const astrologerMessage: Message = {
        id: Date.now().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "astrologer",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, astrologerMessage]);
      setIsTyping(false);
      
      // Save astrologer response to chat history
      chatHistory[astrologer?.id].push(astrologerMessage);
      localStorage.setItem("astrologyChats", JSON.stringify(chatHistory));
    }, 1500 + Math.random() * 1000);
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2 p-0 text-white" onClick={() => navigate("/astrology")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            {astrologer && (
              <>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold mr-3">
                  {astrologer.initials}
                </div>
                <div>
                  <h2 className="font-medium text-lg">{astrologer?.name}</h2>
                  <p className="text-xs text-white/80">{astrologer?.specialty}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "astrologer" && astrologer && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0 mt-1">
                    {astrologer.initials}
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      message.sender === "user" ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {new Intl.DateTimeFormat("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).format(message.timestamp)}
                  </p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 ml-2 mt-1 bg-gray-300">
                    <div className="text-sm">You</div>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0 mt-1">
                  {astrologer?.initials}
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-green-600 hover:bg-green-700"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AstrologyChat;
