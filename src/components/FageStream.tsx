import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Calendar, Star } from "lucide-react";

interface StreamEvent {
  id: number;
  title: string;
  category: string;
  viewers: number;
  rating: number;
  thumbnail: string;
  isLive: boolean;
  startTime?: string;
}

export const FageStream = () => {
  const [selectedStream, setSelectedStream] = useState<number | null>(null);

  const streams: StreamEvent[] = [
    {
      id: 1,
      title: "Champions League Final",
      category: "Deportes",
      viewers: 12543,
      rating: 4.8,
      thumbnail: "🏆",
      isLive: true
    },
    {
      id: 2,
      title: "UFC 300 Preliminares",
      category: "Deportes",
      viewers: 8921,
      rating: 4.6,
      thumbnail: "🥊",
      isLive: true
    },
    {
      id: 3,
      title: "NBA All-Star Game",
      category: "Deportes",
      viewers: 0,
      rating: 4.9,
      thumbnail: "🏀",
      isLive: false,
      startTime: "2025-08-06 21:00"
    },
    {
      id: 4,
      title: "Esports Masters",
      category: "Gaming",
      viewers: 5432,
      rating: 4.7,
      thumbnail: "🎮",
      isLive: true
    },
    {
      id: 5,
      title: "Concierto Rock Festival",
      category: "Música",
      viewers: 0,
      rating: 4.5,
      thumbnail: "🎸",
      isLive: false,
      startTime: "2025-08-07 20:00"
    },
    {
      id: 6,
      title: "Documental Naturaleza",
      category: "Documentales",
      viewers: 1234,
      rating: 4.3,
      thumbnail: "🌿",
      isLive: true
    }
  ];

  const categories = ["Todos", "Deportes", "Gaming", "Música", "Documentales"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredStreams = streams.filter(stream => 
    selectedCategory === "Todos" || stream.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Deportes": return "⚽";
      case "Gaming": return "🎮";
      case "Música": return "🎵";
      case "Documentales": return "📺";
      default: return "🎬";
    }
  };

  const formatViewers = (viewers: number) => {
    if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(1)}k`;
    }
    return viewers.toString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-foreground mb-4">
            📺 FageStream
          </h1>
          <p className="text-muted-foreground text-lg">
            Entretenimiento en vivo 24/7
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Play className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">
              {streams.filter(s => s.isLive).length}
            </h3>
            <p className="text-muted-foreground">En Vivo</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Users className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">
              {formatViewers(streams.reduce((acc, s) => acc + s.viewers, 0))}
            </h3>
            <p className="text-muted-foreground">Espectadores</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Calendar className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">
              {streams.filter(s => !s.isLive).length}
            </h3>
            <p className="text-muted-foreground">Programados</p>
          </Card>
          
          <Card className="bg-fagesas-card border-fagesas-border p-6 text-center">
            <Star className="mx-auto mb-2 text-primary" size={32} />
            <h3 className="font-orbitron font-bold text-xl text-foreground">4.6</h3>
            <p className="text-muted-foreground">Rating Promedio</p>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "border-fagesas-border hover:border-primary"
              }`}
            >
              {getCategoryIcon(category)} {category}
            </Button>
          ))}
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStreams.map((stream) => (
            <Card key={stream.id} className="bg-fagesas-card border-fagesas-border hover:border-primary transition-all duration-300 hover:shadow-cyber">
              <div className="p-6">
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <div className="w-full h-32 bg-fagesas-border rounded-lg flex items-center justify-center text-6xl">
                    {stream.thumbnail}
                  </div>
                  {stream.isLive && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                  {!stream.isLive && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                      📅 PROGRAMADO
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {stream.category}
                  </Badge>
                  
                  <h3 className="font-orbitron font-bold text-lg text-foreground">
                    {stream.title}
                  </h3>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-primary" />
                      <span className="text-foreground">
                        {stream.isLive ? formatViewers(stream.viewers) : stream.startTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-foreground">{stream.rating}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-orbitron"
                    onClick={() => setSelectedStream(stream.id)}
                  >
                    {stream.isLive ? "▶ Ver Ahora" : "⏰ Recordar"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Stream */}
        {selectedStream && (
          <Card className="mt-8 bg-fagesas-card border-primary p-6">
            <h3 className="font-orbitron font-bold text-xl text-primary mb-4">
              🎬 Stream Seleccionado
            </h3>
            <p className="text-foreground mb-4">
              Has seleccionado el stream #{selectedStream}. 
              En un futuro, aquí se integrará el reproductor de video en tiempo real.
            </p>
            <div className="flex space-x-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled
              >
                Abrir Reproductor
              </Button>
              <Button 
                onClick={() => setSelectedStream(null)}
                variant="outline"
                className="border-fagesas-border"
              >
                Cerrar
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};