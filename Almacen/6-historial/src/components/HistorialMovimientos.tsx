import { useState, useMemo } from "react";
import { Clock, Search, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type TipoMovimiento = "entrada" | "salida_manual" | "salida_automatica";

interface Movimiento {
  id: number;
  fecha: string; // dd/mm/aaaa – hh:mm
  ingrediente: string;
  tipo: TipoMovimiento;
  cantidad: string;
  stockAnterior: string;
  stockPosterior: string;
  motivo: string;
  usuario: string;
  notas: string;
}

const MOVIMIENTOS: Movimiento[] = [
  { id: 1, fecha: "05/04/2026 – 18:40", ingrediente: "Tomate", tipo: "salida_automatica", cantidad: "-2 kg", stockAnterior: "17 kg", stockPosterior: "15 kg", motivo: "Consumo cocina", usuario: "Sistema", notas: "-" },
  { id: 2, fecha: "05/04/2026 – 17:25", ingrediente: "Arroz", tipo: "entrada", cantidad: "+10 kg", stockAnterior: "37 kg", stockPosterior: "47 kg", motivo: "Compra proveedor", usuario: "Admin", notas: "-" },
  { id: 3, fecha: "05/04/2026 – 16:10", ingrediente: "Pollo entero", tipo: "salida_manual", cantidad: "-3 kg", stockAnterior: "27.9 kg", stockPosterior: "24.9 kg", motivo: "Merma", usuario: "Admin", notas: "Producto vencido" },
  { id: 4, fecha: "05/04/2026 – 14:32", ingrediente: "Aceite vegetal", tipo: "entrada", cantidad: "+5 lt", stockAnterior: "8.1 lt", stockPosterior: "13.1 lt", motivo: "Reposición", usuario: "Admin", notas: "-" },
  { id: 5, fecha: "04/04/2026 – 19:05", ingrediente: "Limón", tipo: "salida_automatica", cantidad: "-1.2 kg", stockAnterior: "10 kg", stockPosterior: "8.8 kg", motivo: "Consumo cocina", usuario: "Sistema", notas: "-" },
  { id: 6, fecha: "04/04/2026 – 18:20", ingrediente: "Azúcar", tipo: "entrada", cantidad: "+5 kg", stockAnterior: "10 kg", stockPosterior: "15 kg", motivo: "Compra", usuario: "Admin", notas: "-" },
  { id: 7, fecha: "04/04/2026 – 16:45", ingrediente: "Pescado fresco", tipo: "salida_manual", cantidad: "-2 kg", stockAnterior: "15.2 kg", stockPosterior: "13.2 kg", motivo: "Ajuste", usuario: "Admin", notas: "-" },
  { id: 8, fecha: "03/04/2026 – 13:15", ingrediente: "Tallarín", tipo: "salida_automatica", cantidad: "-1 kg", stockAnterior: "11 kg", stockPosterior: "10 kg", motivo: "Consumo cocina", usuario: "Sistema", notas: "-" },
  { id: 9, fecha: "03/04/2026 – 11:30", ingrediente: "Cebolla", tipo: "entrada", cantidad: "+8 kg", stockAnterior: "15.6 kg", stockPosterior: "23.6 kg", motivo: "Compra proveedor", usuario: "Admin", notas: "-" },
  { id: 10, fecha: "02/04/2026 – 09:50", ingrediente: "Corazón de res", tipo: "salida_manual", cantidad: "-2 kg", stockAnterior: "12 kg", stockPosterior: "10 kg", motivo: "Merma", usuario: "Admin", notas: "-" },
];

const TIPO_CONFIG: Record<TipoMovimiento, { label: string; bg: string; text: string }> = {
  entrada: { label: "Entrada", bg: "bg-success/10", text: "text-success" },
  salida_manual: { label: "Salida manual", bg: "bg-destructive/10", text: "text-destructive" },
  salida_automatica: { label: "Salida automática", bg: "bg-info/10", text: "text-info" },
};

const ITEMS_PER_PAGE = 5;

export default function HistorialMovimientos() {
  const [buscar, setBuscar] = useState("");
  const [tipo, setTipo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [page, setPage] = useState(1);

  const usuarios = useMemo(() => [...new Set(MOVIMIENTOS.map((m) => m.usuario))], []);

  const filtered = useMemo(() => {
    return MOVIMIENTOS.filter((m) => {
      if (buscar && !m.ingrediente.toLowerCase().includes(buscar.toLowerCase())) return false;
      if (tipo && m.tipo !== tipo) return false;
      if (usuario && m.usuario !== usuario) return false;
      // Simple date filtering based on dd/mm/yyyy format
      if (desde || hasta) {
        const parts = m.fecha.split(" – ")[0].split("/");
        const mDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
        if (desde) {
          const d = new Date(desde);
          if (mDate < d) return false;
        }
        if (hasta) {
          const d = new Date(hasta);
          if (mDate > d) return false;
        }
      }
      return true;
    });
  }, [buscar, tipo, usuario, desde, hasta]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const limpiar = () => {
    setBuscar("");
    setTipo("");
    setUsuario("");
    setDesde("");
    setHasta("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Historial de Movimientos</h1>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-card p-4 md:p-5 mb-5 border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Desde</label>
              <input
                type="date"
                value={desde}
                onChange={(e) => { setDesde(e.target.value); setPage(1); }}
                className="w-full h-11 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Hasta</label>
              <input
                type="date"
                value={hasta}
                onChange={(e) => { setHasta(e.target.value); setPage(1); }}
                className="w-full h-11 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => { setTipo(e.target.value); setPage(1); }}
                className="w-full h-11 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              >
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="salida_manual">Salida manual</option>
                <option value="salida_automatica">Salida automática</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Usuario</label>
              <select
                value={usuario}
                onChange={(e) => { setUsuario(e.target.value); setPage(1); }}
                className="w-full h-11 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              >
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Buscar ingrediente</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={buscar}
                  onChange={(e) => { setBuscar(e.target.value); setPage(1); }}
                  placeholder="Ingrediente..."
                  className="w-full h-11 pl-9 pr-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={limpiar}
                className="w-full h-11 px-4 rounded-xl border border-border bg-secondary text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Ingrediente</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Cantidad</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Motivo</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Usuario</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Notas</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium">No hay movimientos registrados</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((m, i) => {
                    const config = TIPO_CONFIG[m.tipo];
                    return (
                      <tr
                        key={m.id}
                        className={`border-t border-border hover:bg-secondary/40 transition-colors ${i % 2 === 1 ? "bg-secondary/20" : ""}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{m.fecha}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{m.ingrediente}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{m.cantidad}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-muted-foreground">{m.stockAnterior}</span>
                          <ArrowRight className="w-3 h-3 inline mx-1.5 text-muted-foreground/60" />
                          <span className="font-semibold text-foreground">{m.stockPosterior}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{m.motivo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.usuario}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.notas}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {filtered.length} movimiento{filtered.length !== 1 ? "s" : ""} · Página {currentPage} de {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      p === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
