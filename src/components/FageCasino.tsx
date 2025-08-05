import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, Activity, DollarSign, Clock, Zap, Wifi } from "lucide-react";
import { useRealTimeEvents, useBetting, useRealTimeStats } from "@/hooks/useFagesasAPI";

export const FageCasino = () => {
  const { events, loading, lastUpdate } = useRealTimeEvents();
  const { placeBet, loading: bettingLoading } = useBetting();
  const stats = useRealTimeStats();
  
  const [selectedBet, setSelectedBet] = useState<{ eventId: number; betType: string; odds: number } | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [username, setUsername] = useState("carlos123"); // In real app, get from auth context

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "fútbol": return "⚽";
      case "tenis": return "🎾";
      case "ufc": return "🥊";
      default: return "🏆";
    }
  };

  const handleBetSelection = (eventId: number, betType: string, odds: number) => {
    const selectedEvent = events.find(e => e.id === eventId);
    setSelectedBet({ eventId, betType, odds });
  };

  const handlePlaceBet = async () => {
    if (!selectedBet || !betAmount || !username) return;
    
    const selectedEvent = events.find(e => e.id === selectedBet.eventId);
    if (!selectedEvent) return;

    await placeBet({
      usuario: username,
      evento: selectedEvent.evento,
      monto: parseFloat(betAmount),
      apuesta: selectedBet.betType
    });

    // Reset form
    setSelectedBet(null);
    setBetAmount("");
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
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Badge className="bg-green-500 text-white flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              EN VIVO
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Actualizado: {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {stats.activeUsers} usuarios activos
            </Badge>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <TrendingUp className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">{events.length}</h3>
            <p className="text-muted-foreground">Eventos Live</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Activity className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">{stats.totalBets}</h3>
            <p className="text-muted-foreground">Apuestas Hoy</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <DollarSign className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">${stats.totalVolume.toFixed(0)}</h3>
            <p className="text-muted-foreground">Volumen Total</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Wifi className="mx-auto mb-2 text-green-500" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">{stats.activeUsers}</h3>
            <p className="text-muted-foreground">Usuarios Activos</p>
          </Card>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando eventos en vivo...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
            <Card key={event.id} className="bg-fagesas-card border-fagesas-border hover:border-primary transition-all duration-300">
              <div className="p-6">
                {/* Event Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSportIcon(event.deporte)}</span>
                    <div>
                      <Badge className="bg-primary text-primary-foreground mb-2">
                        {event.deporte}
                      </Badge>
                      <h3 className="font-orbitron font-bold text-lg text-foreground">
                        {event.evento}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        📅 {event.hora}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={`${event.estado === 'activo' ? 'bg-green-500' : 'bg-yellow-500'} text-white animate-pulse`}>
                      {event.estado === 'activo' ? 'LIVE' : 'PRÓXIMO'}
                    </Badge>
                  </div>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(event.cuotas).map(([betType, odds]) => (
                    <Button
                      key={betType}
                      onClick={() => handleBetSelection(event.id, betType, odds)}
                      className={`${
                        selectedBet?.eventId === event.id && selectedBet?.betType === betType
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary hover:bg-primary hover:text-primary-foreground border-fagesas-border'
                      } transition-all duration-300 p-4 h-auto flex flex-col`}
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
        )}

        {/* Selected Bet */}
        {selectedBet && (
          <Card className="mt-8 bg-fagesas-card border-primary p-6">
            <h3 className="font-orbitron font-bold text-xl text-primary mb-6">
              🎯 Confirmar Apuesta
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-foreground mb-4">
                  <span className="text-muted-foreground">Evento:</span><br />
                  <strong>{events.find(e => e.id === selectedBet.eventId)?.evento}</strong>
                </p>
                <p className="text-foreground mb-4">
                  <span className="text-muted-foreground">Apuesta:</span><br />
                  <strong>{selectedBet.betType} ({selectedBet.odds.toFixed(2)}x)</strong>
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Usuario</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background border-fagesas-border"
                    placeholder="Nombre de usuario"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Monto (FGC)</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-background border-fagesas-border"
                    placeholder="Cantidad a apostar"
                  />
                </div>
                
                {betAmount && (
                  <div className="p-3 bg-background border border-fagesas-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Ganancia potencial:</p>
                    <p className="font-orbitron font-bold text-primary text-lg">
                      {(parseFloat(betAmount) * selectedBet.odds).toFixed(2)} FGC
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Button 
                onClick={handlePlaceBet}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!betAmount || !username || bettingLoading}
              >
                {bettingLoading ? "Procesando..." : "Confirmar Apuesta"}
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

        {/* API Status */}
        <Card className="mt-8 bg-fagesas-card border-fagesas-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-orbitron font-bold text-primary mb-2">
                📡 Fagesas Live API
              </h4>
              <p className="text-sm text-muted-foreground">
                Conectado en tiempo real con Hostinger. Datos actualizados cada 30 segundos.
              </p>
            </div>
            <Badge className={`${stats.serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              {stats.serverStatus === 'online' ? 'EN LÍNEA' : 'FUERA DE LÍNEA'}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};