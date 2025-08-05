import { useState, useEffect, useCallback } from 'react';
import { FagesasAPI, SportEvent, User, BetRequest, RechargeRequest, FagesasWebSocket } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Custom hook for real-time events
export const useRealTimeEvents = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await FagesasAPI.fetchEvents();
      setEvents(eventData);
      setLastUpdate(new Date());
    } catch (error) {
      toast({
        title: "Error de Conexión",
        description: "No se pudieron cargar los eventos deportivos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    
    // Subscribe to WebSocket updates
    const handleEventUpdate = (data: any) => {
      if (data.eventos) {
        setEvents(data.eventos);
        setLastUpdate(new Date());
        toast({
          title: "Eventos Actualizados",
          description: "Se han actualizado las cuotas en tiempo real",
        });
      }
    };
    
    FagesasWebSocket.subscribe('events_update', handleEventUpdate);
    
    return () => {
      clearInterval(interval);
      FagesasWebSocket.unsubscribe('events_update', handleEventUpdate);
    };
  }, [fetchEvents, toast]);

  return { events, loading, lastUpdate, refetch: fetchEvents };
};

// Custom hook for user management
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await FagesasAPI.fetchUsers();
      setUsers(userData);
    } catch (error) {
      toast({
        title: "Error de Usuarios",
        description: "No se pudieron cargar los datos de usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
};

// Custom hook for betting functionality
export const useBetting = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const placeBet = useCallback(async (betData: BetRequest) => {
    setLoading(true);
    try {
      const result = await FagesasAPI.placeBet(betData);
      
      if (result.status === 'ok') {
        toast({
          title: "🎯 Apuesta Exitosa",
          description: `${result.message} | Saldo restante: ${result.saldo_restante}`,
        });
        return { success: true, data: result };
      } else {
        toast({
          title: "Error en Apuesta",
          description: result.message || "No se pudo procesar la apuesta",
          variant: "destructive",
        });
        return { success: false, error: result.message };
      }
    } catch (error) {
      toast({
        title: "Error de Conexión",
        description: "No se pudo conectar con el servidor de apuestas",
        variant: "destructive",
      });
      return { success: false, error: "Connection error" };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkResult = useCallback(async (evento: string, apuesta: string, monto: number) => {
    setLoading(true);
    try {
      const result = await FagesasAPI.checkResult(evento, apuesta, monto);
      
      if (result.status === 'ok') {
        const isWinner = result.ganancia && result.ganancia > 0;
        toast({
          title: isWinner ? "🏆 ¡Ganaste!" : "😔 Apuesta Perdida",
          description: `${result.message}${result.ganancia ? ` | Ganancia: ${result.ganancia}` : ''}`,
          variant: isWinner ? "default" : "destructive",
        });
        return { success: true, data: result };
      } else {
        toast({
          title: "Error al Verificar",
          description: result.message || "No se pudo verificar el resultado",
          variant: "destructive",
        });
        return { success: false, error: result.message };
      }
    } catch (error) {
      toast({
        title: "Error de Verificación",
        description: "No se pudo verificar el resultado de la apuesta",
        variant: "destructive",
      });
      return { success: false, error: "Connection error" };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { placeBet, checkResult, loading };
};

// Custom hook for wallet operations
export const useWallet = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const rechargeBalance = useCallback(async (rechargeData: RechargeRequest) => {
    setLoading(true);
    try {
      const result = await FagesasAPI.rechargeBalance(rechargeData);
      
      if (result.status === 'ok') {
        toast({
          title: "💰 Recarga Exitosa",
          description: `${result.message} | Nuevo saldo: ${result.nuevo_saldo}`,
        });
        return { success: true, data: result };
      } else {
        toast({
          title: "Error en Recarga",
          description: result.message || "No se pudo procesar la recarga",
          variant: "destructive",
        });
        return { success: false, error: result.message };
      }
    } catch (error) {
      toast({
        title: "Error de Conexión",
        description: "No se pudo conectar con el servidor de pagos",
        variant: "destructive",
      });
      return { success: false, error: "Connection error" };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { rechargeBalance, loading };
};

// Custom hook for real-time stats and analytics
export const useRealTimeStats = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalBets: 0,
    totalVolume: 0,
    serverStatus: 'online' as 'online' | 'offline' | 'maintenance'
  });

  useEffect(() => {
    // Subscribe to real-time stats updates
    const handleStatsUpdate = (data: any) => {
      if (data.stats) {
        setStats(data.stats);
      }
    };

    FagesasWebSocket.subscribe('stats_update', handleStatsUpdate);

    // Mock real-time stats for demo
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 500) + 100,
        totalBets: prev.totalBets + Math.floor(Math.random() * 5),
        totalVolume: prev.totalVolume + Math.random() * 1000,
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
      FagesasWebSocket.unsubscribe('stats_update', handleStatsUpdate);
    };
  }, []);

  return stats;
};