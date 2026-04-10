import { useState, useMemo } from "react";
import { Search, Plus, Star, MoreHorizontal, Power, Edit, Trash2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Proveedor {
  id: number;
  nombre: string;
  ruc: string;
  telefono: string;
  tipo: string;
  calificacion: number;
  diasCredito: number;
  ultimoIngreso: string;
  insumos: string;
  estado: "Activo" | "Inactivo";
}

const proveedoresData: Proveedor[] = [
  { id: 1, nombre: "Distribuidora El Mercado", ruc: "20123456789", telefono: "987654321", tipo: "Abarrotes", calificacion: 4.5, diasCredito: 7, ultimoIngreso: "28/03/2026", insumos: "Abarrotes", estado: "Activo" },
  { id: 2, nombre: "Carnes Premium SAC", ruc: "20456789123", telefono: "912345678", tipo: "Carnes", calificacion: 4.8, diasCredito: 5, ultimoIngreso: "02/04/2026", insumos: "Carnes", estado: "Activo" },
  { id: 3, nombre: "Mariscos del Norte", ruc: "20567891234", telefono: "923456789", tipo: "Mariscos", calificacion: 4.6, diasCredito: 3, ultimoIngreso: "01/04/2026", insumos: "Mariscos", estado: "Activo" },
  { id: 4, nombre: "Verduras Frescas Chimbote", ruc: "20678912345", telefono: "934567891", tipo: "Verduras", calificacion: 4.3, diasCredito: 2, ultimoIngreso: "05/04/2026", insumos: "Verduras", estado: "Activo" },
  { id: 5, nombre: "Lácteos Andinos", ruc: "20789123456", telefono: "945678912", tipo: "Lácteos", calificacion: 4.4, diasCredito: 7, ultimoIngreso: "20/03/2026", insumos: "Lácteos", estado: "Inactivo" },
  { id: 6, nombre: "Distribuidora Central", ruc: "20891234567", telefono: "956789123", tipo: "Abarrotes", calificacion: 4.2, diasCredito: 10, ultimoIngreso: "30/03/2026", insumos: "Abarrotes", estado: "Activo" },
];

const tipos = ["Todos", "Abarrotes", "Carnes", "Mariscos", "Verduras", "Lácteos"];
const estados = ["Todos", "Activo", "Inactivo"];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-warning text-warning" />
      <span className="text-sm font-medium text-foreground">{rating}</span>
    </div>
  );
};

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const filtered = useMemo(() => {
    return proveedores.filter((p) => {
      const matchName = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = filterTipo === "Todos" || p.tipo === filterTipo;
      const matchEstado = filterEstado === "Todos" || p.estado === filterEstado;
      return matchName && matchTipo && matchEstado;
    });
  }, [proveedores, searchTerm, filterTipo, filterEstado]);

  const toggleEstado = (id: number) => {
    setProveedores((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">Almacén</p>
            <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Añadir proveedor
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border bg-card"
            />
          </div>
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((t) => (
                <SelectItem key={t} value={t}>{t === "Todos" ? "Todos los tipos" : t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((e) => (
                <SelectItem key={e} value={e}>{e === "Todos" ? "Todos los estados" : e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">RUC</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Insumos</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Calificación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Días crédito</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Último ingreso</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-border transition-colors duration-150 hover:bg-background/60 ${
                      i % 2 === 1 ? "bg-background/30" : ""
                    } ${p.estado === "Inactivo" ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{p.nombre}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{p.ruc}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {p.telefono}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="rounded-full text-xs font-medium">
                        {p.tipo}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.insumos}</td>
                    <td className="px-4 py-3"><StarRating rating={p.calificacion} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.diasCredito === 0 ? "text-destructive" : "text-foreground"}`}>
                        {p.diasCredito === 0 ? "Inmediato" : `${p.diasCredito} días`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.ultimoIngreso}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`rounded-full text-xs font-semibold ${
                          p.estado === "Activo"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                        variant="outline"
                      >
                        {p.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-dropdown">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toggleEstado(p.id)}>
                            <Power className="h-4 w-4" />
                            {p.estado === "Activo" ? "Desactivar" : "Activar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                            <Trash2 className="h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                      No se encontraron proveedores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs text-text-tertiary">
          Mostrando {filtered.length} de {proveedores.length} proveedores
        </p>
      </div>
    </div>
  );
};

export default Proveedores;
