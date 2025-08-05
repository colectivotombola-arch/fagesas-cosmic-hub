import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Trophy, Clock } from "lucide-react";

interface Rifa {
  id: number;
  name: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  endDate: string;
  status: "active" | "ended" | "coming";
}

export const ColectivoTombola = () => {
  const [selectedRifa, setSelectedRifa] = useState<number | null>(null);

  const rifas: Rifa[] = [
    {
      id: 1,
      name: "Rifa Gaming Master",
      prize: "PlayStation 5 + 3 Juegos",
      ticketPrice: 10,
      totalTickets: 100,
      soldTickets: 67,
      endDate: "2025-08-15",
      status: "active"
    },
    {
      id: 2,
      name: "Crypto Bonanza",
      prize: "0.5 Bitcoin",
      ticketPrice: 25,
      totalTickets: 50,
      soldTickets: 23,
      endDate: "2025-08-20",
      status: "active"
    },
    {
      id: 3,
      name: "Tech Bundle",
      prize: "iPhone 15 Pro + MacBook Air",
      ticketPrice: 50,
      totalTickets: 80,
      soldTickets: 45,
      endDate: "2025-08-25",
      status: "active"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "ended": return "bg-red-500";
      case "coming": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const calculateProgress = (sold: number, total: number) => {
    return (sold / total) * 100;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-foreground mb-4">
            🎟 Colectivo Tómbola
          </h1>
          <p className="text-muted-foreground text-lg">
            Participa en rifas exclusivas del ecosistema Fagesas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Ticket className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">156</h3>
            <p className="text-muted-foreground">Tickets Vendidos</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Trophy className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">3</h3>
            <p className="text-muted-foreground">Rifas Activas</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Clock className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">12</h3>
            <p className="text-muted-foreground">Días Restantes</p>
          </Card>
        </div>

        {/* Rifas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rifas.map((rifa) => (
            <Card key={rifa.id} className="bg-fagesas-card border-fagesas-border hover:border-primary transition-all duration-300 hover:shadow-cyber">
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <Badge 
                    className={`${getStatusColor(rifa.status)} text-white`}
                  >
                    {rifa.status === "active" ? "Activa" : rifa.status === "ended" ? "Finalizada" : "Próximamente"}
                  </Badge>
                  <span className="text-primary font-orbitron font-bold">#{rifa.id}</span>
                </div>

                {/* Prize */}
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-2">
                  {rifa.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-4">
                  🏆 {rifa.prize}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{rifa.soldTickets} vendidos</span>
                    <span>{rifa.totalTickets} total</span>
                  </div>
                  <div className="w-full bg-fagesas-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(rifa.soldTickets, rifa.totalTickets)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Price and Date */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Precio por ticket</p>
                    <p className="font-orbitron font-bold text-primary">{rifa.ticketPrice} FGC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Finaliza</p>
                    <p className="text-sm text-foreground">{rifa.endDate}</p>
                  </div>
                </div>

                {/* Buy Button */}
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-orbitron"
                  disabled={rifa.status !== "active"}
                  onClick={() => setSelectedRifa(rifa.id)}
                >
                  {rifa.status === "active" ? "Comprar Ticket" : "No Disponible"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Rifa Info */}
        {selectedRifa && (
          <Card className="mt-8 bg-fagesas-card border-primary p-6">
            <h3 className="font-orbitron font-bold text-xl text-primary mb-4">
              ¡Ticket Seleccionado!
            </h3>
            <p className="text-foreground">
              Has seleccionado participar en la rifa #{selectedRifa}. 
              En un futuro conectaremos con FageWallet para procesar el pago.
            </p>
            <Button 
              onClick={() => setSelectedRifa(null)}
              className="mt-4 bg-secondary hover:bg-secondary/90"
            >
              Cerrar
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};