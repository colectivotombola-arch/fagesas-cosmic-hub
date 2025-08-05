import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Wifi, 
  RefreshCw,
  Eye,
  Database,
  Zap
} from "lucide-react";
import { useRealTimeEvents, useUsers, useWallet, useRealTimeStats } from "@/hooks/useFagesasAPI";

export const LiveDashboard = () => {
  const { events, loading: eventsLoading, refetch: refetchEvents } = useRealTimeEvents();
  const { users, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const { rechargeBalance, loading: walletLoading } = useWallet();
  const stats = useRealTimeStats();

  const [rechargeUser, setRechargeUser] = useState("");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetchEvents();
      refetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchEvents, refetchUsers]);

  const handleRecharge = async () => {
    if (!rechargeUser || !rechargeAmount) return;
    
    await rechargeBalance({
      usuario: rechargeUser,
      monto: parseFloat(rechargeAmount)
    });

    // Clear form and refresh users
    setRechargeUser("");
    setRechargeAmount("");
    refetchUsers();
  };

  const totalBalance = users.reduce((sum, user) => sum + user.saldo, 0);
  const avgBalance = users.length > 0 ? totalBalance / users.length : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-foreground mb-4">
            📊 Dashboard en Vivo
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitoreo y administración del ecosistema Fagesas
          </p>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Badge className={`${stats.serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center gap-1`}>
              <Wifi className="h-3 w-3" />
              {stats.serverStatus === 'online' ? 'API EN LÍNEA' : 'API OFFLINE'}
            </Badge>
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-primary" size={32} />
              <Badge className="bg-blue-500 text-white">LIVE</Badge>
            </div>
            <h3 className="font-orbitron font-bold text-2xl text-foreground">{stats.activeUsers}</h3>
            <p className="text-muted-foreground">Usuarios Activos</p>
          </Card>

          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="text-primary" size={32} />
              <Badge className="bg-green-500 text-white">+{Math.floor(Math.random() * 5)}</Badge>
            </div>
            <h3 className="font-orbitron font-bold text-2xl text-foreground">{stats.totalBets}</h3>
            <p className="text-muted-foreground">Apuestas Totales</p>
          </Card>

          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-primary" size={32} />
              <Badge className="bg-yellow-500 text-white">FGC</Badge>
            </div>
            <h3 className="font-orbitron font-bold text-2xl text-foreground">${stats.totalVolume.toFixed(0)}</h3>
            <p className="text-muted-foreground">Volumen Total</p>
          </Card>

          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-primary" size={32} />
              <Badge className="bg-purple-500 text-white">{events.length}</Badge>
            </div>
            <h3 className="font-orbitron font-bold text-2xl text-foreground">{events.length}</h3>
            <p className="text-muted-foreground">Eventos Activos</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Panel */}
          <Card className="bg-fagesas-card border-fagesas-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron font-bold text-xl text-foreground flex items-center gap-2">
                  <Database className="text-primary" />
                  Eventos Deportivos
                </h2>
                <Button onClick={refetchEvents} variant="outline" size="sm" disabled={eventsLoading}>
                  <RefreshCw className={`h-4 w-4 ${eventsLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {eventsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Cargando eventos...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 bg-background border border-fagesas-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{event.evento}</h3>
                        <Badge className={`${event.estado === 'activo' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                          {event.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.deporte} • {event.hora}</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(event.cuotas).map(([tipo, cuota]) => (
                          <Badge key={tipo} variant="outline" className="text-xs">
                            {tipo}: {cuota}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Users & Wallet Panel */}
          <Card className="bg-fagesas-card border-fagesas-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron font-bold text-xl text-foreground flex items-center gap-2">
                  <Users className="text-primary" />
                  Gestión de Usuarios
                </h2>
                <Button onClick={refetchUsers} variant="outline" size="sm" disabled={usersLoading}>
                  <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-background border border-fagesas-border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="font-orbitron font-bold text-primary">{users.length}</p>
                </div>
                <div className="p-3 bg-background border border-fagesas-border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Saldo Promedio</p>
                  <p className="font-orbitron font-bold text-primary">{avgBalance.toFixed(2)} FGC</p>
                </div>
              </div>

              {/* Recharge Form */}
              <div className="space-y-4 mb-6 p-4 bg-background border border-fagesas-border rounded-lg">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Recarga Rápida
                </h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Usuario"
                    value={rechargeUser}
                    onChange={(e) => setRechargeUser(e.target.value)}
                    className="bg-fagesas-card border-fagesas-border"
                  />
                  <Input
                    type="number"
                    placeholder="Monto FGC"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="bg-fagesas-card border-fagesas-border"
                  />
                  <Button
                    onClick={handleRecharge}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!rechargeUser || !rechargeAmount || walletLoading}
                  >
                    {walletLoading ? "Procesando..." : "Recargar Saldo"}
                  </Button>
                </div>
              </div>

              {/* Users List */}
              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Cargando usuarios...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-background border border-fagesas-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{user.nombre}</p>
                        <p className="text-sm text-muted-foreground">@{user.usuario}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-orbitron font-bold text-primary">{user.saldo} FGC</p>
                        <p className="text-xs text-muted-foreground">{user.referidos} referidos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* API Status */}
        <Card className="mt-8 bg-fagesas-card border-fagesas-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-orbitron font-bold text-primary mb-2 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado de la API Fagesas
              </h3>
              <p className="text-sm text-muted-foreground">
                Conexión en tiempo real con Hostinger. Auto-refresh cada 30 segundos.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500 text-white">
                <Eye className="h-3 w-3 mr-1" />
                Monitoreando
              </Badge>
              <Badge variant="outline">
                Última actualización: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};