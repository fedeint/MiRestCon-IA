import { useState, useMemo } from "react";
import { Producto, EstadoFiltro, getEstado, ordenarPorUrgencia } from "./types";
import { productosIniciales } from "./data";
import { ProductoRow } from "./ProductoRow";
import { Search, Package, AlertTriangle, ArrowDownCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export function QueComprarPage() {
  const [productos] = useState<Producto[]>(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>("todos");

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => {
      const estado = getEstado(p);
      if (estado === "ok") return false;
      if (filtroEstado === "critico" && estado !== "critico") return false;
      if (filtroEstado === "bajo" && estado !== "bajo") return false;
      if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    });
    return ordenarPorUrgencia(lista);
  }, [productos, busqueda, filtroEstado]);

  const contadores = useMemo(() => {
    const necesitan = productos.filter((p) => getEstado(p) !== "ok");
    return {
      total: necesitan.length,
      criticos: necesitan.filter((p) => getEstado(p) === "critico").length,
      bajos: necesitan.filter((p) => getEstado(p) === "bajo").length,
    };
  }, [productos]);

  const filtros: { key: EstadoFiltro; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: contadores.total },
    { key: "critico", label: "Críticos", count: contadores.criticos },
    { key: "bajo", label: "Bajos", count: contadores.bajos },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary-gradient-from))] to-[hsl(var(--primary-gradient-to))] flex items-center justify-center shadow-sm">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Qué comprar</h1>
            <p className="text-sm text-muted-foreground">Productos que necesitan reposición inmediata</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryCard icon={<Package className="w-4 h-4" />} label="Por comprar" value={contadores.total} />
        <SummaryCard icon={<AlertTriangle className="w-4 h-4" />} label="Críticos" value={contadores.criticos} variant="destructive" />
        <SummaryCard icon={<ArrowDownCircle className="w-4 h-4" />} label="Bajos" value={contadores.bajos} variant="warning" />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltroEstado(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                filtroEstado === f.key
                  ? "bg-gradient-to-r from-[hsl(var(--primary-gradient-from))] to-[hsl(var(--primary-gradient-to))] text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-border"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock actual</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Consumo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Consumo pasado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cantidad sugerida</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Costo estimado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Proveedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Días de stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <ProductoRow
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </tbody>
          </table>
        </div>

        {productosFiltrados.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No hay productos que requieran reposición</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant?: "default" | "destructive" | "warning";
}) {
  const variantStyles = {
    default: "text-foreground",
    destructive: "text-destructive",
    warning: "text-warning",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
      <div className="flex items-center gap-2 mb-1">
        <span className={`${variantStyles[variant]}`}>{icon}</span>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${variantStyles[variant]}`}>{value}</p>
    </div>
  );
}
