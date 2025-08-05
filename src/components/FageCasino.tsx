import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, DollarSign } from "lucide-react";

interface SportEvent {
  id: number;
  sport: string;
  event: string;
  time: string;
  odds: Record<string, number>;
}

export const FageCasino = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);

  // Simulated API data (as per your PHP example)
  useEffect(() => {
    const mockEvents: SportEvent[] = [
      {
        id: 1,
        sport: "Fútbol",
        event: "Barcelona vs Real Madrid",
        time: "2025-08-05 20:00",
        odds: {
          local: 1.85,
          empate: 3.20,
          visitante: 2.10
        }
      },
      {
        id: 2,
        sport: "Tenis",
        event: "Nadal vs Djokovic",
        time: "2025-08-06 16:00",
        odds: {
          nadal: 2.00,
          djokovic: 1.70
        }
      },
      {
        id: 3,
        sport: "UFC",
        event: "McGregor vs Poirier",
        time: "2025-08-07 22:00",
        odds: {
          mcgregor: 1.95,
          poirier: 1.95
        }
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "fútbol": return "⚽";
      case "tenis": return "🎾";
      case "ufc": return "🥊";
      default: return "🏆";
    }
  };

  const placeBet = (eventId: number, betType: string, odds: number) => {
    setSelectedBet(`Evento ${eventId} - ${betType} (${odds})`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-foreground mb-4">
            🎰 FageCasino
          </h1>
          <p className="text-muted-foreground text-lg">
            Apuestas deportivas en tiempo real
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <TrendingUp className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">Live</h3>
            <p className="text-muted-foreground">Eventos en Vivo</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Activity className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">{events.length}</h3>
            <p className="text-muted-foreground">Eventos Disponibles</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <DollarSign className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">1.85x</h3>
            <p className="text-muted-foreground">Mejor Cuota</p>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="bg-fagesas-card border-fagesas-border hover:border-primary transition-all duration-300">
              <div className="p-6">
                {/* Event Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSportIcon(event.sport)}</span>
                    <div>
                      <Badge className="bg-primary text-primary-foreground mb-2">
                        {event.sport}
                      </Badge>
                      <h3 className="font-orbitron font-bold text-lg text-foreground">
                        {event.event}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        📅 {event.time}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white animate-pulse">
                    LIVE
                  </Badge>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(event.odds).map(([betType, odds]) => (
                    <Button
                      key={betType}
                      onClick={() => placeBet(event.id, betType, odds)}
                      className="bg-secondary hover:bg-primary hover:text-primary-foreground border border-fagesas-border transition-all duration-300 p-4 h-auto flex flex-col"
                      variant="outline"
                    >
                      <span className="text-xs text-muted-foreground uppercase mb-1">
                        {betType}
                      </span>
                      <span className="font-orbitron font-bold text-lg">
                        {odds.toFixed(2)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Bet */}
        {selectedBet && (
          <Card className="mt-8 bg-fagesas-card border-primary p-6">
            <h3 className="font-orbitron font-bold text-xl text-primary mb-4">
              🎯 Apuesta Seleccionada
            </h3>
            <p className="text-foreground mb-4">
              Has seleccionado: <strong>{selectedBet}</strong>
            </p>
            <p className="text-muted-foreground mb-4">
              En un futuro, aquí podrás ingresar el monto y confirmar tu apuesta usando FageWallet.
            </p>
            <div className="flex space-x-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled
              >
                Confirmar Apuesta
              </Button>
              <Button 
                onClick={() => setSelectedBet(null)}
                variant="outline"
                className="border-fagesas-border"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* API Info */}
        <Card className="mt-8 bg-fagesas-card border-fagesas-border p-6">
          <h4 className="font-orbitron font-bold text-primary mb-2">
            📡 Fagesas Sports API
          </h4>
          <p className="text-sm text-muted-foreground">
            Datos simulados del backend PHP. En producción se conectará con APIs deportivas reales.
          </p>
        </Card>
      </div>
    </div>
  );
};