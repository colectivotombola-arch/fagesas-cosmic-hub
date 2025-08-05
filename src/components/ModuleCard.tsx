import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export const ModuleCard = ({ title, icon, description, onClick, className }: ModuleCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer bg-fagesas-card border-fagesas-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-cyber p-6",
        className
      )}
    >
      <div className="text-center space-y-4">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-orbitron font-bold text-xl text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Card>
  );
};