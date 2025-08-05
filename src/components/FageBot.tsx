import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const FageBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "¡Bienvenido! Soy FageBot, tu asistente en el mundo Fagesas. Escríbeme para comenzar.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const text = userMessage.toLowerCase();
    
    if (text.includes("hola") || text.includes("hello")) {
      return "¡Hola! Soy FageBot, tu asistente de Fagesas. ¿Quieres que te muestre el portal completo?";
    }
    
    if (text.includes("rifa") || text.includes("tómbola") || text.includes("tombola")) {
      return "🎟 Puedes participar en las rifas desde la sección Colectivo Tómbola. ¡Hay premios increíbles esperándote!";
    }
    
    if (text.includes("casino") || text.includes("apuesta")) {
      return "🎰 FageCasino está listo para que explores apuestas deportivas y juegos. ¡Las cuotas están actualizadas en tiempo real!";
    }
    
    if (text.includes("stream") || text.includes("tv") || text.includes("video")) {
      return "📺 FageStream te permite ver deportes y entretenimiento en vivo. ¡No te pierdas ningún evento!";
    }
    
    if (text.includes("wallet") || text.includes("cripto") || text.includes("fagecoin")) {
      return "💰 FageWallet está preparado para manejar FageCoin y pagos del ecosistema. ¡Tu monedero digital!";
    }
    
    if (text.includes("ayuda") || text.includes("help")) {
      return "Puedo ayudarte con:\n• 🎟 Colectivo Tómbola - Rifas y sorteos\n• 🎰 FageCasino - Apuestas deportivas\n• 📺 FageStream - Entretenimiento\n• 💰 FageWallet - Pagos y FageCoin\n\n¿Sobre qué quieres saber más?";
    }
    
    return "Soy FageBot y estoy aquí para guiarte en el mundo de Fagesas. ¿Hay algo específico en lo que pueda ayudarte?";
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: Message = {
        content: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-cyber transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-card border-border shadow-cyber flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-fagesas-card">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-foreground">FageBot</h3>
                <p className="text-xs text-muted-foreground">Asistente Fagesas</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg font-medium ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-fagesas-card text-foreground border border-fagesas-border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-fagesas-card text-foreground border border-fagesas-border p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-fagesas-card">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-background border-fagesas-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};