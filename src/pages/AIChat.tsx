import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Bot, User, AlertTriangle, Home } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIChat = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isUrgent = searchParams.get("urgent") === "true";

  const location = useLocation();
  const phq9Score = location.state?.phq9Score;
  const gad7Score = location.state?.gad7Score;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCrisis, setIsCrisis] = useState(isUrgent);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: isUrgent 
        ? "I understand you're in crisis. I'm here to help you right now. How are you feeling at this moment? Please know that you're safe and we can work through this together."
        : t('chat.welcome'),
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createSession = async () => {
      if (user && !sessionId) {
        const { data, error } = await supabase
          .from("chat_sessions")
          .insert({ user_id: user.id, title: "New Chat Session" })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating chat session:", error);
        } else if (data) {
          setSessionId(data.id);
          console.log("Chat session created:", data.id);
        }
      }
    };
    createSession();
  }, [user, sessionId]);

  const getAIResponse = async (userMessage: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat-handler", {
        body: { 
          userMessage,
          phqScore: phq9Score,
          gadScore: gad7Score,
        },
      });

      if (error) throw error;
      
      if (data.escalate) {
        setIsCrisis(true);
      }

      return data.content || "I'm having trouble responding. Please check your connection or try again.";

    } catch (error) {
      console.error('Error invoking AI Chat function:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again. If you're in crisis, please call 1075 immediately.";
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessageContent = inputMessage;
    const userMessage: Message = { id: Date.now().toString(), content: userMessageContent, sender: "user", timestamp: new Date() };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    await supabase.from("chat_messages").insert({ session_id: sessionId, content: userMessageContent, sender: 'user' });

    const aiContent = await getAIResponse(userMessageContent);
    const aiResponse: Message = { id: (Date.now() + 1).toString(), content: aiContent, sender: "ai", timestamp: new Date() };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);

    await supabase.from("chat_messages").insert({ session_id: sessionId, content: aiContent, sender: 'ai' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="p-2">
                <Home className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">{t('chat.title')}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Banner */}
      {isCrisis && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Crisis Support Active</span>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="destructive" size="sm" onClick={() => window.open("tel:1075")}>Call 1075 Now</Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              {message.sender === "ai" && (
                <div className="bg-primary p-2 rounded-full shadow-soft self-start"><Bot className="w-4 h-4 text-primary-foreground" /></div>
              )}
              <Card className={`max-w-[80%] ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
              {message.sender === "user" && (
                <div className="bg-muted p-2 rounded-full self-start"><User className="w-4 h-4 text-muted-foreground" /></div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="bg-primary p-2 rounded-full shadow-soft"><Bot className="w-4 h-4 text-primary-foreground" /></div>
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isCrisis ? "Please contact a professional." : t('chat.placeholder')}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
              disabled={isTyping || isCrisis}
            />
            <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping || isCrisis} className="bg-gradient-to-r from-primary to-secondary">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;