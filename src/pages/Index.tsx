import { useState } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { FageBot } from "@/components/FageBot";
import { ColectivoTombola } from "@/components/ColectivoTombola";
import { FageCasino } from "@/components/FageCasino";
import { FageStream } from "@/components/FageStream";
import { FageWallet } from "@/components/FageWallet";

type Module = "home" | "tombola" | "casino" | "stream" | "wallet";

const Index = () => {
  const [currentModule, setCurrentModule] = useState<Module>("home");

  const modules = [
    {
      id: "tombola" as Module,
      title: "Colectivo Tómbola",
      icon: "🎟",
      description: "Participa en rifas exclusivas y gana increíbles premios"
    },
    {
      id: "casino" as Module,
      title: "FageCasino",
      icon: "🎰",
      description: "Apuestas deportivas en tiempo real con las mejores cuotas"
    },
    {
      id: "stream" as Module,
      title: "FageStream",
      icon: "📺",
      description: "Entretenimiento y deportes en vivo 24/7"
    },
    {
      id: "wallet" as Module,
      title: "FageWallet",
      icon: "💰",
      description: "Tu monedero digital para FageCoins y criptomonedas"
    }
  ];

  const renderCurrentModule = () => {
    switch (currentModule) {
      case "tombola":
        return <ColectivoTombola />;
      case "casino":
        return <FageCasino />;
      case "stream":
        return <FageStream />;
      case "wallet":
        return <FageWallet />;
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-6xl mx-auto text-center">
              {/* Main Header */}
              <div className="mb-16">
                <h1 className="font-orbitron text-6xl font-bold text-foreground mb-6 bg-gradient-cyber bg-clip-text text-transparent">
                  🌐 FAGESAS
                </h1>
                <p className="text-xl text-muted-foreground font-orbitron">
                  Bienvenido al Mundo Central
                </p>
                <div className="w-24 h-1 bg-gradient-cyber mx-auto mt-6 rounded-full"></div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    title={module.title}
                    icon={module.icon}
                    description={module.description}
                    onClick={() => setCurrentModule(module.id)}
                  />
                ))}
              </div>

              {/* Additional Info */}
              <div className="bg-fagesas-card border border-fagesas-border rounded-xl p-8 max-w-2xl mx-auto">
                <h2 className="font-orbitron text-2xl font-bold text-primary mb-4">
                  🚀 Ecosistema Completo
                </h2>
                <p className="text-muted-foreground mb-6">
                  Explora todas las funcionalidades del mundo Fagesas. Desde rifas y apuestas
                  hasta streaming y tu monedero digital personal.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span>🔐 Seguro</span>
                  <span>⚡ Rápido</span>
                  <span>🌟 Innovador</span>
                  <span>🤖 IA Integrada</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Back button for modules */}
      {currentModule !== "home" && (
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => setCurrentModule("home")}
            className="bg-fagesas-card border border-fagesas-border hover:border-primary text-foreground px-4 py-2 rounded-lg font-orbitron transition-all duration-300 hover:shadow-cyber"
          >
            ← Volver al Portal
          </button>
        </div>
      )}
      
      {renderCurrentModule()}
      <FageBot />
    </>
  );
};

export default Index;
