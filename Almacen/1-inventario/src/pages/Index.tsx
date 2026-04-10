import { useState, useMemo, useCallback } from "react";
import { inventarioData, categoriasUnicas, type ItemInventario, type EstadoStock } from "@/data/inventario";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search, Package, AlertTriangle, AlertCircle, CheckCircle2, BoxesIcon } from "lucide-react";
import { SummaryCard } from "@/components/SummaryCard";
import NuevoIngredienteDialog from "@/components/NuevoIngredienteDialog";
import UniversalInput from "@/components/UniversalInput";
import { toast } from "@/hooks/use-toast";

type SortField = "codigo" | "nombre" | "stock" | "stockMinimo" | "estado" | "categoria" | "costoUnitario" | "ubicacion" | "ultimoIngreso";
type SortDir = "asc" | "desc";

const estadoOrder: Record<EstadoStock, number> = { Critico: 0, Bajo: 1, OK: 2 };

const estadoBadge: Record<EstadoStock, { className: string; icon: React.ReactNode }> = {
  OK: {
    className: "bg-success-bg text-success border-success/20",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Bajo: {
    className: "bg-warning-bg text-warning border-warning/20",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  Critico: {
    className: "bg-critical-bg text-critical border-critical/20 animate-pulse",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

export default function Index() {
  const [datos, setDatos] = useState<ItemInventario[]>(() => [...inventarioData]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleAgregar = useCallback((item: ItemInventario) => {
    setDatos((prev) => [...prev, item]);
  }, []);

  const items = useMemo(() => {
    let filtered = datos.filter((item) => {
      const matchBusqueda =
        !busqueda ||
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.codigo.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = categoriaFiltro === "todas" || item.categoria === categoriaFiltro;
      return matchBusqueda && matchCategoria;
    });

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "codigo": cmp = a.codigo.localeCompare(b.codigo); break;
        case "nombre": cmp = a.nombre.localeCompare(b.nombre); break;
        case "stock": cmp = a.stock - b.stock; break;
        case "stockMinimo": cmp = a.stockMinimo - b.stockMinimo; break;
        case "costoUnitario": cmp = a.costoUnitario - b.costoUnitario; break;
        case "categoria": cmp = a.categoria.localeCompare(b.categoria); break;
        case "ubicacion": cmp = (a.ubicacion || "").localeCompare(b.ubicacion || ""); break;
        case "ultimoIngreso": cmp = (a.ultimoIngreso || "").localeCompare(b.ultimoIngreso || ""); break;
        case "estado": cmp = estadoOrder[a.estado] - estadoOrder[b.estado]; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [datos, busqueda, categoriaFiltro, sortField, sortDir]);

  const resumen = useMemo(() => {
    const total = datos.length;
    const criticos = datos.filter((i) => i.estado === "Critico").length;
    const bajos = datos.filter((i) => i.estado === "Bajo").length;
    const ok = datos.filter((i) => i.estado === "OK").length;
    return { total, criticos, bajos, ok };
  }, [datos]);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer select-none hover:bg-muted/60 transition-colors whitespace-nowrap text-caption font-semibold uppercase tracking-wider text-muted-foreground"
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-primary" : "text-muted-foreground/30"}`} />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-foreground">Inventario</h1>
          <p className="text-label text-muted-foreground mt-1">Estado actual del almacén</p>
        </div>
        <NuevoIngredienteDialog
          onAgregar={handleAgregar}
          codigosExistentes={datos.map((d) => d.codigo)}
        />
      </div>

      {/* Universal Input */}
      <UniversalInput
        onSubmit={({ text, audioBlob, imageFile }) => {
          toast({
            title: "Entrada recibida",
            description: text
              ? `Texto: "${text.substring(0, 60)}${text.length > 60 ? "..." : ""}"`
              : audioBlob
              ? "Audio recibido — listo para procesamiento IA"
              : "Imagen recibida — lista para procesamiento IA",
          });
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total productos" value={resumen.total} variant="default" icon={BoxesIcon} />
        <SummaryCard label="Stock OK" value={resumen.ok} variant="success" icon={CheckCircle2} />
        <SummaryCard label="Stock bajo" value={resumen.bajos} variant="warning" icon={AlertTriangle} />
        <SummaryCard label="Crítico" value={resumen.criticos} variant="critical" icon={AlertCircle} />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 border-0 bg-secondary rounded-md h-10"
          />
        </div>
        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-full sm:w-[260px] h-10 rounded-md">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {categoriasUnicas.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <SortableHeader field="codigo">Código</SortableHeader>
                <SortableHeader field="nombre">Nombre</SortableHeader>
                <SortableHeader field="categoria">Categoría</SortableHeader>
                <SortableHeader field="ubicacion">Ubicación</SortableHeader>
                <SortableHeader field="stock">Stock</SortableHeader>
                <SortableHeader field="stockMinimo">Mínimo</SortableHeader>
                <SortableHeader field="costoUnitario">Costo</SortableHeader>
                <SortableHeader field="ultimoIngreso">Último ingreso</SortableHeader>
                <SortableHeader field="estado">Estado</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, i) => (
                  <TableRow
                    key={item.codigo}
                    className={`hover:bg-background transition-colors ${i % 2 === 1 ? "bg-[#FAFBFC]" : ""}`}
                  >
                    <TableCell className="font-mono text-caption text-muted-foreground">{item.codigo}</TableCell>
                    <TableCell className="font-semibold text-foreground text-sm">{item.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-caption font-normal rounded-full">
                        {item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.ubicacion}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-sm">{item.stock}</span>
                      <span className="text-muted-foreground text-caption ml-1">{item.unidad}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.stockMinimo}</TableCell>
                    <TableCell className="text-sm">S/ {item.costoUnitario.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.ultimoIngreso || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-1 rounded-full border text-caption font-semibold ${estadoBadge[item.estado].className}`}>
                        {estadoBadge[item.estado].icon}
                        {item.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-border px-4 py-3 text-caption text-muted-foreground">
          Mostrando {items.length} de {datos.length} productos
        </div>
      </div>
    </div>
  );
}
