import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Sparkles, Clock, Star } from "lucide-react";

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "suggestion" | "welcome";
}

interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
}

export const FageBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "¡Hola! 👋 Soy FageBot, tu asistente inteligente del ecosistema Fagesas.\n\n¿En qué puedo ayudarte hoy? Puedo guiarte por todos nuestros servicios:",
      sender: "bot",
      timestamp: new Date(),
      type: "welcome",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    { label: "🎟 Ver Rifas", icon: "🎟", action: () => handleQuickAction("Quiero ver las rifas disponibles") },
    { label: "🎰 Ir al Casino", icon: "🎰", action: () => handleQuickAction("Llévame al casino") },
    { label: "📺 Ver Streams", icon: "📺", action: () => handleQuickAction("Quiero ver streams en vivo") },
    { label: "💰 Mi Wallet", icon: "💰", action: () => handleQuickAction("Revisar mi wallet") },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (message: string) => {
    setInputValue(message);
    sendMessage(message);
    setShowSuggestions(false);
  };

  const getBotResponse = (userMessage: string): string => {
    const text = userMessage.toLowerCase();
    
    // Respuestas más avanzadas y contextuales
    if (text.includes("hola") || text.includes("hello") || text.includes("hi")) {
      return "¡Hola! 👋 ¡Qué gusto verte por aquí! Soy FageBot, tu asistente personal del ecosistema Fagesas.\n\n¿Qué te gustaría hacer hoy? Puedo ayudarte a navegar por todas nuestras plataformas o responder cualquier pregunta que tengas. 🌟";
    }
    
    if (text.includes("rifa") || text.includes("tómbola") || text.includes("tombola")) {
      return "🎟 ¡Excelente elección! En Colectivo Tómbola tienes:\n\n• Rifas activas con premios increíbles 🏆\n• Diferentes precios de boletos 💵\n• Sorteos exclusivos cada semana 🗓️\n• Sistema transparente y seguro 🔒\n\n¿Te gustaría que te muestre las rifas disponibles ahora mismo?";
    }
    
    if (text.includes("casino") || text.includes("apuesta") || text.includes("deporte")) {
      return "🎰 ¡FageCasino te está esperando! Aquí encontrarás:\n\n• Apuestas deportivas en tiempo real ⚽\n• Las mejores cuotas del mercado 📈\n• Eventos de fútbol, tenis, UFC y más 🥊\n• Sistema de apuestas seguro y confiable 🛡️\n\n¿Quieres ver los eventos deportivos en vivo?";
    }
    
    if (text.includes("stream") || text.includes("tv") || text.includes("video") || text.includes("vivo")) {
      return "📺 ¡FageStream tiene contenido increíble para ti!\n\n• Deportes en vivo 24/7 ⚽\n• Entretenimiento exclusivo 🎬\n• Streams de alta calidad 4K 📱\n• Chat interactivo con la comunidad 💬\n\n¿Te gustaría explorar los streams disponibles?";
    }
    
    if (text.includes("wallet") || text.includes("cripto") || text.includes("fagecoin") || text.includes("dinero")) {
      return "💰 ¡FageWallet es tu puerta al futuro financiero!\n\n• Gestiona tus FageCoins 🪙\n• Intercambia criptomonedas 🔄\n• Pagos seguros y rápidos ⚡\n• Historial completo de transacciones 📊\n\n¿Quieres revisar tu balance actual?";
    }
    
    if (text.includes("ayuda") || text.includes("help") || text.includes("información")) {
      return "🤖 ¡Estoy aquí para ayudarte! Estas son mis especialidades:\n\n🎟 **Colectivo Tómbola** - Rifas y sorteos exclusivos\n🎰 **FageCasino** - Apuestas deportivas premium\n📺 **FageStream** - Entretenimiento y deportes en vivo\n💰 **FageWallet** - Tu monedero digital avanzado\n\n¿Hay algo específico que te interese explorar?";
    }
    
    if (text.includes("gracias") || text.includes("thanks")) {
      return "¡De nada! 😊 Es un placer ayudarte. Recuerda que estoy aquí 24/7 para cualquier cosa que necesites en el ecosistema Fagesas.\n\n¿Hay algo más en lo que pueda asistirte hoy?";
    }
    
    if (text.includes("precio") || text.includes("costo") || text.includes("cuánto")) {
      return "💵 En Fagesas manejamos diferentes opciones:\n\n• Rifas desde $10 FGC 🎟️\n• Apuestas mínimas desde $5 FGC 🎰\n• Streams gratuitos y premium 📺\n• Transacciones sin comisión 💰\n\n¿Te interesa algún servicio en particular?";
    }
    
    if (text.includes("seguro") || text.includes("confiable") || text.includes("seguridad")) {
      return "🔒 ¡La seguridad es nuestra prioridad #1!\n\n• Encriptación de nivel bancario 🛡️\n• Auditorías regulares de seguridad ✅\n• Soporte 24/7 especializado 👨‍💻\n• Sistema anti-fraude avanzado 🚫\n\nTu dinero y datos están completamente protegidos.";
    }
    
    // Respuestas más inteligentes por defecto
    const responses = [
      "🌟 Interesante pregunta. Como experto en Fagesas, te recomiendo explorar nuestros módulos principales. ¿Hay alguno que te llame la atención?",
      "🚀 ¡Excelente! Estás en el lugar correcto para vivir la experiencia Fagesas completa. ¿Por dónde te gustaría empezar?",
      "💡 Te entiendo perfectamente. Fagesas tiene exactamente lo que buscas. ¿Quieres que te guíe paso a paso?",
      "⭐ ¡Genial! Me encanta ayudar a los usuarios de Fagesas. Cuéntame más sobre lo que necesitas.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = (customMessage?: string) => {
    const messageToSend = customMessage || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      content: messageToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate more realistic bot thinking with variable delay
    const thinkingTime = Math.random() * 1000 + 800; // 800-1800ms
    setTimeout(() => {
      const botResponse: Message = {
        content: getBotResponse(messageToSend),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Enhanced Chat Bubble with Pulse Effect */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 w-16 rounded-full bg-gradient-cyber hover:shadow-glow transition-all duration-500 hover:scale-110 animate-pulse"
            size="icon"
          >
            <Bot className="h-8 w-8 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
          </Button>
          <div className="absolute -top-12 right-0 bg-fagesas-card border border-fagesas-border rounded-lg px-3 py-1 text-xs text-foreground whitespace-nowrap animate-fade-in">
            💬 ¡Pregúntame algo!
          </div>
        </div>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border-border shadow-glow flex flex-col z-50 animate-scale-in">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-fagesas-card to-fagesas-card/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-cyber rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-foreground flex items-center gap-1">
                  FageBot <Sparkles className="h-3 w-3 text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  En línea • Asistente IA
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-background">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user" 
                      ? "bg-primary" 
                      : "bg-gradient-cyber"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="flex flex-col space-y-1">
                    <div
                      className={`p-3 rounded-2xl font-medium transition-all duration-200 hover:shadow-md ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-fagesas-card text-foreground border border-fagesas-border rounded-bl-md shadow-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`flex items-center space-x-1 text-xs text-muted-foreground ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}>
                      <Clock className="h-3 w-3" />
                      <span>{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {showSuggestions && messages.length === 1 && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-muted-foreground text-center">Acciones rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="text-left justify-start h-auto p-3 border-fagesas-border hover:bg-fagesas-card hover:border-primary transition-all duration-200"
                    >
                      <span className="mr-2">{action.icon}</span>
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-cyber rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-fagesas-card text-foreground border border-fagesas-border p-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">FageBot está escribiendo...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 border-t border-border bg-fagesas-card/50 backdrop-blur-sm">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje a FageBot..."
                  disabled={isTyping}
                  className="bg-background border-fagesas-border text-foreground placeholder:text-muted-foreground pr-10 focus:border-primary transition-colors"
                />
                {inputValue && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Badge variant="secondary" className="text-xs px-1">
                      {inputValue.length}
                    </Badge>
                  </div>
                )}
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-cyber hover:shadow-glow text-primary-foreground transition-all duration-200 hover:scale-105"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Status Bar */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                FageBot está en línea
              </span>
              <span>Respuesta promedio: ~1s</span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};