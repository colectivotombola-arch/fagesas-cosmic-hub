import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Send, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from "lucide-react";

interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  currency: "FGC" | "BTC" | "ETH";
  date: string;
  status: "completed" | "pending" | "failed";
}

export const FageWallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // Mock wallet data
  const balances = {
    FGC: 1500.50,
    BTC: 0.025,
    ETH: 0.75
  };

  const transactions: Transaction[] = [
    {
      id: 1,
      type: "income",
      description: "Ganancia Rifa Gaming Master",
      amount: 250,
      currency: "FGC",
      date: "2025-08-04",
      status: "completed"
    },
    {
      id: 2,
      type: "expense",
      description: "Compra Ticket Crypto Bonanza",
      amount: 25,
      currency: "FGC",
      date: "2025-08-03",
      status: "completed"
    },
    {
      id: 3,
      type: "income",
      description: "Apuesta UFC - Ganancia",
      amount: 45.50,
      currency: "FGC",
      date: "2025-08-02",
      status: "completed"
    },
    {
      id: 4,
      type: "expense",
      description: "Transferencia a FageBot",
      amount: 0.001,
      currency: "BTC",
      date: "2025-08-01",
      status: "pending"
    },
    {
      id: 5,
      type: "income",
      description: "Recompensa FageStream",
      amount: 0.1,
      currency: "ETH",
      date: "2025-07-31",
      status: "completed"
    }
  ];

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "FGC": return "🪙";
      case "BTC": return "₿";
      case "ETH": return "Ξ";
      default: return "💰";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatBalance = (amount: number, currency: string) => {
    if (!showBalance) return "***.**";
    return currency === "FGC" ? amount.toLocaleString() : amount.toFixed(6);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-foreground mb-4">
            💰 FageWallet
          </h1>
          <p className="text-muted-foreground text-lg">
            Tu monedero digital del ecosistema Fagesas
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(balances).map(([currency, amount]) => (
            <Card key={currency} className="bg-fagesas-card border-fagesas-border hover:border-primary transition-all duration-300 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCurrencyIcon(currency)}</span>
                  <span className="font-orbitron font-bold text-lg text-foreground">{currency}</span>
                </div>
                <Button
                  onClick={() => setShowBalance(!showBalance)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-orbitron font-bold text-2xl text-primary">
                  {formatBalance(amount, currency)}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currency === "FGC" ? "FageCoins" : currency === "BTC" ? "Bitcoin" : "Ethereum"}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="text-center space-y-4">
              <Send className="mx-auto text-primary" size={32} />
              <h3 className="font-orbitron font-bold text-foreground">Enviar</h3>
              <div className="space-y-3">
                <Input 
                  placeholder="Dirección del destinatario"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-background border-fagesas-border"
                />
                <Input 
                  placeholder="Cantidad"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="bg-background border-fagesas-border"
                />
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Enviar FGC
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="text-center space-y-4">
              <Wallet className="mx-auto text-primary" size={32} />
              <h3 className="font-orbitron font-bold text-foreground">Recibir</h3>
              <div className="space-y-3">
                <div className="p-4 bg-background border border-fagesas-border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Tu dirección FGC:</p>
                  <p className="font-mono text-sm text-foreground break-all">
                    fg1x...k8j9n2m4p6q8r
                  </p>
                </div>
                <Button variant="outline" className="w-full border-fagesas-border">
                  Copiar Dirección
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-fagesas-card border-fagesas-border p-6">
            <div className="text-center space-y-4">
              <TrendingUp className="mx-auto text-primary" size={32} />
              <h3 className="font-orbitron font-bold text-foreground">Exchange</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Intercambia tus criptomonedas
                </p>
                <Button variant="outline" className="w-full border-fagesas-border" disabled>
                  Próximamente
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-fagesas-card border-fagesas-border">
          <div className="p-6">
            <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
              📋 Historial de Transacciones
            </h3>
            
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-background border border-fagesas-border rounded-lg hover:border-primary transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedTransaction(tx.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      tx.type === "income" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}>
                      {tx.type === "income" ? 
                        <ArrowDownRight className="text-green-500" size={20} /> :
                        <ArrowUpRight className="text-red-500" size={20} />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-orbitron font-bold ${
                        tx.type === "income" ? "text-green-500" : "text-red-500"
                      }`}>
                        {tx.type === "income" ? "+" : "-"}
                        {tx.amount} {getCurrencyIcon(tx.currency)}
                      </p>
                      <Badge className={`${getStatusColor(tx.status)} text-white text-xs`}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Selected Transaction Detail */}
        {selectedTransaction && (
          <Card className="mt-8 bg-fagesas-card border-primary p-6">
            <h3 className="font-orbitron font-bold text-xl text-primary mb-4">
              📄 Detalle de Transacción
            </h3>
            <p className="text-foreground mb-4">
              Transacción #{selectedTransaction} seleccionada. 
              Aquí se mostrarían los detalles completos incluyendo hash, confirmaciones, etc.
            </p>
            <Button 
              onClick={() => setSelectedTransaction(null)}
              variant="outline"
              className="border-fagesas-border"
            >
              Cerrar
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};