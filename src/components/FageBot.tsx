import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Sparkles, Clock, Star, Zap } from "lucide-react";
import { FagesasAPI } from "@/services/api";

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
      content: "¡Hola! 👋 Soy FageBot, tu asistente inteligente del ecosistema Fagesas.\n\n🚀 **Comandos disponibles:**\n• `eventos` - Ver eventos deportivos en vivo\n• `apostar [usuario] [evento] [monto]` - Realizar apuestas\n• `recargar [usuario] [monto]` - Recargar saldo\n• `usuarios` - Ver usuarios y saldos\n• `resultado [evento] [apuesta] [monto]` - Verificar resultados\n• `ayuda` - Ver todos los comandos\n\n¿Qué te gustaría hacer hoy? 🌟",
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
    { label: "🎯 Ver Eventos", icon: "🎯", action: () => handleQuickAction("eventos") },
    { label: "👥 Ver Usuarios", icon: "👥", action: () => handleQuickAction("usuarios") },
    { label: "🎰 Apostar", icon: "🎰", action: () => handleQuickAction("apostar carlos123 Barcelona 20") },
    { label: "💰 Recargar", icon: "💰", action: () => handleQuickAction("recargar carlos123 100") },
    { label: "🏆 Ver Resultado", icon: "🏆", action: () => handleQuickAction("resultado Barcelona Real 20") },
    { label: "❓ Ayuda", icon: "❓", action: () => handleQuickAction("ayuda") },
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

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const text = userMessage.toLowerCase();
    
    // Comandos de API en vivo
    if (text.startsWith("eventos") || text.includes("ver eventos")) {
      try {
        const events = await FagesasAPI.fetchEvents();
        let response = "🎯 **Eventos Deportivos en Vivo:**\n\n";
        events.slice(0, 3).forEach(event => {
          response += `⚽ **${event.evento}**\n`;
          response += `🕐 ${event.hora}\n`;
          response += `📊 Cuotas: ${Object.entries(event.cuotas).map(([k,v]) => `${k}(${v})`).join(', ')}\n\n`;
        });
        response += "¿Te interesa apostar en algún evento? Escribe 'apostar [usuario] [evento] [monto]'";
        return response;
      } catch (error) {
        return "❌ No pude cargar los eventos en este momento. La API puede no estar disponible.";
      }
    }

    if (text.startsWith("apostar ")) {
      const parts = text.split(" ");
      if (parts.length >= 4) {
        const [, usuario, evento, monto] = parts;
        try {
          const result = await FagesasAPI.placeBet({
            usuario,
            evento,
            monto: parseFloat(monto)
          });
          
          if (result.status === 'ok') {
            return `✅ **Apuesta registrada exitosamente!**\n\n💰 Monto: ${monto} FGC\n🎯 Evento: ${evento}\n💳 Saldo restante: ${result.saldo_restante || 'Consulta tu wallet'}\n\n¡Buena suerte! 🍀`;
          } else {
            return `❌ **Error en la apuesta:**\n${result.message}\n\nFormato correcto: apostar [usuario] [evento] [monto]`;
          }
        } catch (error) {
          return "❌ No pude procesar la apuesta. Verifica la conexión con la API.";
        }
      }
      return "📝 **Formato incorrecto.** Usa: apostar [usuario] [evento] [monto]\nEjemplo: apostar carlos123 Barcelona 25";
    }

    if (text.startsWith("recargar ")) {
      const parts = text.split(" ");
      if (parts.length >= 3) {
        const [, usuario, monto] = parts;
        try {
          const result = await FagesasAPI.rechargeBalance({
            usuario,
            monto: parseFloat(monto)
          });
          
          if (result.status === 'ok') {
            return `💰 **Recarga exitosa!**\n\n👤 Usuario: ${usuario}\n💵 Monto recargado: ${monto} FGC\n🏦 Nuevo saldo: ${result.nuevo_saldo || 'Actualizado'}\n\n¡Ya puedes seguir apostando! 🎰`;
          } else {
            return `❌ **Error en la recarga:**\n${result.message}`;
          }
        } catch (error) {
          return "❌ No pude procesar la recarga. Verifica la conexión con la API.";
        }
      }
      return "📝 **Formato incorrecto.** Usa: recargar [usuario] [monto]\nEjemplo: recargar carlos123 100";
    }

    if (text.startsWith("usuarios") || text.includes("ver usuarios")) {
      try {
        const users = await FagesasAPI.fetchUsers();
        let response = "👥 **Usuarios Registrados:**\n\n";
        users.forEach(user => {
          response += `👤 **${user.nombre}** (@${user.usuario})\n`;
          response += `💰 Saldo: ${user.saldo} FGC\n`;
          response += `👥 Referidos: ${user.referidos}\n\n`;
        });
        return response;
      } catch (error) {
        return "❌ No pude cargar los usuarios en este momento.";
      }
    }

    if (text.startsWith("resultado ")) {
      const parts = text.split(" ");
      if (parts.length >= 4) {
        const [, evento, apuesta, monto] = parts;
        try {
          const result = await FagesasAPI.checkResult(evento, apuesta, parseFloat(monto));
          
          if (result.status === 'ok') {
            const isWinner = result.ganancia && result.ganancia > 0;
            return `${isWinner ? '🏆' : '😔'} **${result.message}**\n\n🎯 Evento: ${evento}\n🎲 Tu apuesta: ${apuesta}\n💰 Monto apostado: ${monto} FGC\n${isWinner ? `🎉 Ganancia: ${result.ganancia} FGC` : '💔 Sin ganancia esta vez'}\n\n${isWinner ? '¡Felicitaciones!' : '¡Mejor suerte la próxima!'}`;
          } else {
            return `❌ **Error al verificar resultado:**\n${result.message}`;
          }
        } catch (error) {
          return "❌ No pude verificar el resultado. API no disponible.";
        }
      }
      return "📝 **Formato incorrecto.** Usa: resultado [evento] [apuesta] [monto]\nEjemplo: resultado Barcelona Real 25";
    }
    
    // Respuestas contextuales originales mejoradas
    if (text.includes("hola") || text.includes("hello") || text.includes("hi")) {
      return "¡Hola! 👋 ¡Qué gusto verte por aquí! Soy FageBot, tu asistente inteligente del ecosistema Fagesas.\n\n🚀 **Comandos disponibles:**\n• `eventos` - Ver eventos deportivos\n• `apostar [usuario] [evento] [monto]` - Realizar apuesta\n• `recargar [usuario] [monto]` - Recargar saldo\n• `usuarios` - Ver usuarios registrados\n• `resultado [evento] [apuesta] [monto]` - Verificar resultado\n\n¿Qué te gustaría hacer? 🌟";
    }
    
    if (text.includes("rifa") || text.includes("tómbola") || text.includes("tombola")) {
      return "🎟 ¡Excelente elección! En Colectivo Tómbola tienes:\n\n• Rifas activas con premios increíbles 🏆\n• Diferentes precios de boletos 💵\n• Sorteos exclusivos cada semana 🗓️\n• Sistema transparente y seguro 🔒\n\n¿Te gustaría que te muestre las rifas disponibles ahora mismo?";
    }
    
    if (text.includes("casino") || text.includes("apuesta") || text.includes("deporte")) {
      return "🎰 ¡FageCasino te está esperando! Aquí encontrarás:\n\n• Apuestas deportivas en tiempo real ⚽\n• Las mejores cuotas del mercado 📈\n• Eventos de fútbol, tenis, UFC y más 🥊\n• Sistema de apuestas seguro y confiable 🛡️\n\nEscribe `eventos` para ver las opciones disponibles o `apostar [usuario] [evento] [monto]` para apostar directamente.";
    }
    
    if (text.includes("wallet") || text.includes("cripto") || text.includes("fagecoin") || text.includes("dinero")) {
      return "💰 ¡FageWallet es tu puerta al futuro financiero!\n\n• Gestiona tus FageCoins 🪙\n• Intercambia criptomonedas 🔄\n• Pagos seguros y rápidos ⚡\n• Historial completo de transacciones 📊\n\nEscribe `recargar [usuario] [monto]` para recargar saldo o `usuarios` para ver balances.";
    }
    
    if (text.includes("ayuda") || text.includes("help") || text.includes("comandos")) {
      return "🤖 **Guía Completa de FageBot:**\n\n🎯 **Comandos de Apuestas:**\n• `eventos` - Lista eventos en vivo\n• `apostar carlos123 Barcelona 25` - Apuesta 25 FGC\n• `resultado Barcelona Real 25` - Verifica resultado\n\n💰 **Comandos de Wallet:**\n• `usuarios` - Ver usuarios y saldos\n• `recargar carlos123 100` - Recarga 100 FGC\n\n🎟 **Otras funciones:**\n• Preguntas sobre rifas, casino, streams\n• Información de seguridad y precios\n\n¿En qué puedo ayudarte específicamente?";
    }
    
    // Respuestas más inteligentes por defecto
    const responses = [
      "🌟 Interesante pregunta. Puedo ayudarte con comandos como `eventos`, `apostar`, `recargar` o `usuarios`. ¿Qué te gustaría hacer?",
      "🚀 ¡Perfecto! Estás en Fagesas, donde todo es posible. Escribe `ayuda` para ver todos mis comandos disponibles.",
      "💡 Te entiendo perfectamente. Fagesas tiene exactamente lo que buscas. ¿Quieres ver `eventos` deportivos o revisar `usuarios`?",
      "⭐ ¡Genial! Me encanta ayudar. Puedo ejecutar apuestas, recargas y más. Escribe `comandos` para ver todas las opciones.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async (customMessage?: string) => {
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

    try {
      // Get bot response (now async for API calls)
      const botResponseContent = await getBotResponse(messageToSend);
      
      // Realistic thinking delay
      const thinkingTime = Math.random() * 1000 + 500; 
      setTimeout(() => {
        const botResponse: Message = {
          content: botResponseContent,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, thinkingTime);
    } catch (error) {
      setTimeout(() => {
        const errorResponse: Message = {
          content: "❌ Lo siento, tuve un problema procesando tu mensaje. Por favor intenta de nuevo.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorResponse]);
        setIsTyping(false);
      }, 1000);
    }
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
                <p className="text-xs text-muted-foreground text-center">⚡ Comandos rápidos:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="text-left justify-start h-auto p-2 border-fagesas-border hover:bg-fagesas-card hover:border-primary transition-all duration-200"
                    >
                      <span className="mr-1 text-sm">{action.icon}</span>
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    API en vivo conectada
                  </Badge>
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