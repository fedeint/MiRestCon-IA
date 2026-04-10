import { AlertTriangle, ChefHat, CheckCircle } from "lucide-react";

interface AutomaticBlockProps {
  cajaAbierta: boolean;
  platosHoy: number;
}

export const AutomaticBlock = ({ cajaAbierta, platosHoy }: AutomaticBlockProps) => {
  return (
    <div className="mb-4 animate-fade-in">
      <div className="flex gap-3">
        {/* Estado de caja */}
        <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border ${
          cajaAbierta
            ? "bg-success-bg border-success/20"
            : "bg-warning-bg border-warning/20"
        }`}>
          {cajaAbierta ? (
            <CheckCircle className="w-4 h-4 text-success shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
          )}
          <span className="text-sm font-medium text-foreground">
            {cajaAbierta
              ? "Caja abierta — funcionamiento normal"
              : "No hay caja abierta hoy. Las salidas no se registrarán hasta que se abra caja."}
          </span>
        </div>

        {/* Platos enviados */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-card border-border">
          <ChefHat className="w-4 h-4 text-primary shrink-0" />
          <div className="text-sm">
            <span className="font-bold text-foreground">{platosHoy}</span>
            <span className="text-muted-foreground ml-1">platos a cocina hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
