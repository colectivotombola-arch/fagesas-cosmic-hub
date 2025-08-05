// API Configuration and Services for Fagesas Platform
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tudominio.com/api' 
  : 'http://localhost:3000/api';

// API Response Interfaces
export interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  message?: string;
  source?: string;
  data?: T;
  // Additional fields that PHP endpoints return
  eventos?: SportEvent[];
  usuarios?: User[];
  saldo_restante?: number;
  nuevo_saldo?: number;
  ganancia?: number;
  [key: string]: any; // Allow additional dynamic properties
}

export interface SportEvent {
  id: number;
  deporte: string;
  evento: string;
  hora: string;
  cuotas: Record<string, number>;
  estado: 'activo' | 'finalizado' | 'suspendido';
}

export interface User {
  id: number;
  nombre: string;
  usuario: string;
  saldo: number;
  referidos: number;
}

export interface BetRequest {
  usuario: string;
  evento: string;
  monto: number;
  apuesta?: string;
}

export interface BetResult {
  evento: string;
  ganador: string;
  cuota: number;
}

export interface RechargeRequest {
  usuario: string;
  monto: number;
}

// API Service Functions
export class FagesasAPI {
  
  static async fetchEvents(): Promise<SportEvent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/index.php`);
      const data: ApiResponse = await response.json();
      
      if (data.status === 'ok' && data.eventos) {
        return data.eventos;
      }
      
      // Fallback to mock data if API is not available
      return this.getMockEvents();
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return this.getMockEvents();
    }
  }

  static async fetchUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios.php`);
      const data: ApiResponse = await response.json();
      
      if (data.status === 'ok' && data.usuarios) {
        return data.usuarios;
      }
      
      return this.getMockUsers();
    } catch (error) {
      console.warn('Users API not available, using mock data:', error);
      return this.getMockUsers();
    }
  }

  static async placeBet(betData: BetRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/apuestas.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Bet placement error:', error);
      return {
        status: 'error',
        message: 'No se pudo procesar la apuesta. API no disponible.',
      };
    }
  }

  static async rechargeBalance(rechargeData: RechargeRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/recargar.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rechargeData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Recharge error:', error);
      return {
        status: 'error',
        message: 'No se pudo procesar la recarga. API no disponible.',
      };
    }
  }

  static async checkResult(evento: string, apuesta: string, monto: number): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams({
        evento,
        apuesta,
        monto: monto.toString(),
      });
      
      const response = await fetch(`${API_BASE_URL}/resultados.php?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Result check error:', error);
      return {
        status: 'error',
        message: 'No se pudo verificar el resultado. API no disponible.',
      };
    }
  }

  // Mock Data Fallbacks
  private static getMockEvents(): SportEvent[] {
    return [
      {
        id: 1,
        deporte: "Fútbol",
        evento: "Barcelona vs Real Madrid",
        hora: "2025-08-05 20:00",
        cuotas: { local: 1.85, empate: 3.20, visitante: 2.10 },
        estado: "activo"
      },
      {
        id: 2,
        deporte: "Tenis",
        evento: "Nadal vs Djokovic",
        hora: "2025-08-06 16:00",
        cuotas: { nadal: 2.00, djokovic: 1.70 },
        estado: "activo"
      },
      {
        id: 3,
        deporte: "UFC",
        evento: "McGregor vs Poirier",
        hora: "2025-08-07 22:00",
        cuotas: { mcgregor: 1.95, poirier: 1.95 },
        estado: "activo"
      },
      {
        id: 4,
        deporte: "Fútbol",
        evento: "Liverpool vs Manchester City",
        hora: "2025-08-08 18:30",
        cuotas: { local: 2.30, empate: 3.10, visitante: 1.90 },
        estado: "activo"
      },
      {
        id: 5,
        deporte: "Basketball",
        evento: "Lakers vs Warriors",
        hora: "2025-08-09 21:00",
        cuotas: { lakers: 1.75, warriors: 2.05 },
        estado: "activo"
      }
    ];
  }

  private static getMockUsers(): User[] {
    return [
      {
        id: 1,
        nombre: "Carlos Mendoza",
        usuario: "carlos123",
        saldo: 100.00,
        referidos: 2
      },
      {
        id: 2,
        nombre: "Ana Torres",
        usuario: "ana2025",
        saldo: 250.50,
        referidos: 5
      },
      {
        id: 3,
        nombre: "Luis García",
        usuario: "lgarcia",
        saldo: 75.75,
        referidos: 0
      }
    ];
  }
}

// Real-time connection utilities
export class FagesasWebSocket {
  private static ws: WebSocket | null = null;
  private static listeners: Map<string, Function[]> = new Map();

  static connect() {
    if (typeof window === 'undefined') return;
    
    try {
      this.ws = new WebSocket('wss://tudominio.com/ws');
      
      this.ws.onopen = () => {
        console.log('🚀 Fagesas WebSocket connected');
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.notifyListeners(data.type, data);
      };
      
      this.ws.onclose = () => {
        console.log('📡 Fagesas WebSocket disconnected');
        // Reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };
    } catch (error) {
      console.log('WebSocket not available, using polling instead');
    }
  }

  static subscribe(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  static unsubscribe(eventType: string, callback: Function) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private static notifyListeners(eventType: string, data: any) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

// Initialize WebSocket connection
if (typeof window !== 'undefined') {
  FagesasWebSocket.connect();
}