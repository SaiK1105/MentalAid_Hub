import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Bot, User, AlertTriangle, Heart, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import.meta.env.VITE_GEMINI_API_KEY;
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  riskLevel?: "low" | "medium" | "high";
}

const AIChat = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isUrgent = searchParams.get("urgent") === "true";
  
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
  const [riskAssessment, setRiskAssessment] = useState<"low" | "medium" | "high" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const riskKeywords = {
    high: ["suicide", "kill myself", "end it all", "not worth living", "hurt myself"],
    medium: ["depressed", "anxious", "panic", "can't cope", "overwhelming"],
    low: ["stressed", "worried", "tired", "sad", "confused"]
  };

  const assessRisk = (message: string): "low" | "medium" | "high" => {
    const lowerMessage = message.toLowerCase();
    
    for (const keyword of riskKeywords.high) {
      if (lowerMessage.includes(keyword)) return "high";
    }
    for (const keyword of riskKeywords.medium) {
      if (lowerMessage.includes(keyword)) return "medium";
    }
    return "low";
  };

  const getAIResponse = async (userMessage: string, risk: "low" | "medium" | "high"): Promise<string> => {
    // Correctly use the API key provided by the environment
    const apiKey = "";
    
    const systemPrompts = {
      high: "You are a crisis counselor. The user is expressing thoughts of self-harm or suicide. Respond with immediate care, validation, and clear direction to emergency resources. Always mention calling 1075 (India crisis line) or emergency services. Be empathetic but directive about seeking immediate help.",
      medium: "You are a mental health supporter. The user is experiencing significant distress (anxiety, depression, panic). Provide coping strategies, grounding techniques, and emotional validation. Offer practical breathing exercises or mindfulness techniques.",
      low: "You are a supportive counselor. The user is dealing with everyday stress and worries. Provide validation, gentle guidance, and stress management techniques. Ask thoughtful follow-up questions to understand their situation better."
    };

    try {
      const payload = {
          contents: [{
            parts: [{
              text: `${systemPrompts[risk]}\n\nUser message: ${userMessage}\n\nRespond with empathy and appropriate guidance based on the risk level.`
            }]
          }],
          tools: [{ "google_search": {} }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I'm here to listen. Can you tell me more about what you're experiencing?";
    } catch (error) {
      console.error('AI API Error:', error);
      // Fallback responses for when API fails
      const fallbackResponses = {
        high: "I hear that you're in a lot of pain right now. Your life has value and you matter. Please reach out to the crisis hotline at 1075 or emergency services immediately. I'm also here to talk - can you tell me if you're in a safe place right now?",
        medium: "I understand you're going through a difficult time. These feelings can be overwhelming, but you don't have to face them alone. Let's work on some coping strategies together. Take a deep breath with me - in for 4, hold for 4, out for 4.",
        low: "I hear you, and your feelings are completely valid. Stress and worry are normal responses to life's challenges. Let's explore some strategies that might help. What usually helps you feel calmer?"
      };
      return fallbackResponses[risk];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Assess risk level
    const risk = assessRisk(inputMessage);
    setRiskAssessment(risk);

    // Get AI response
    try {
      const aiContent = await getAIResponse(inputMessage, risk);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: "ai",
        timestamp: new Date(),
        riskLevel: risk
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact emergency services at 1075 if you're in crisis.",
        sender: "ai",
        timestamp: new Date(),
        riskLevel: risk
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRiskBadgeColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "high": return "destructive";
      case "medium": return "outline";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="p-2"
              >
                <Home className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">{t('chat.title')}</h1>
              </div>
            </div>
            {riskAssessment && (
              <Badge variant={getRiskBadgeColor(riskAssessment)}>
                {riskAssessment.toUpperCase()} RISK
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Crisis Banner */}
      {(isUrgent || riskAssessment === "high") && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Crisis Support Active</span>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => window.open("tel:1075")}
              >
                Call 1075 Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <div className="bg-primary p-2 rounded-full shadow-soft">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <Card className={`max-w-[80%] ${
                message.sender === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card"
              }`}>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.riskLevel && (
                      <Badge 
                        variant={getRiskBadgeColor(message.riskLevel)}
                        className="text-xs"
                      >
                        {message.riskLevel}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {message.sender === "user" && (
                <div className="bg-muted p-2 rounded-full">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="bg-primary p-2 rounded-full shadow-soft">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
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
              placeholder={t('chat.placeholder')}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Suggestions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("I'm feeling overwhelmed")}
              disabled={isTyping}
            >
              I'm overwhelmed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("I need coping strategies")}
              disabled={isTyping}
            >
              Need coping strategies
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("I'm having a panic attack")}
              disabled={isTyping}
            >
              Having panic attack
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
// Correctly use the API key provided by the environment