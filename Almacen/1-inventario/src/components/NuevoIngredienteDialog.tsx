import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { categoriasUnicas, type ItemInventario } from "@/data/inventario";

const unidades = ["kg", "lt", "und"];

interface Props {
  onAgregar: (item: ItemInventario) => void;
  codigosExistentes: string[];
}

export default function NuevoIngredienteDialog({ onAgregar, codigosExistentes }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    categoria: "",
    unidad: "",
    ubicacion: "",
    stockInicial: "",
    stockMinimo: "",
    costoUnitario: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({ codigo: "", nombre: "", categoria: "", unidad: "", ubicacion: "", stockInicial: "", stockMinimo: "", costoUnitario: "" });
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.codigo.trim()) e.codigo = "Requerido";
    else if (codigosExistentes.includes(form.codigo.trim().toUpperCase())) e.codigo = "Código ya existe";
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.categoria) e.categoria = "Requerido";
    if (!form.unidad) e.unidad = "Requerido";
    if (!form.ubicacion) e.ubicacion = "Requerido";
    if (!form.stockInicial || Number(form.stockInicial) < 0) e.stockInicial = "Debe ser ≥ 0";
    if (!form.stockMinimo || Number(form.stockMinimo) < 0) e.stockMinimo = "Debe ser ≥ 0";
    if (!form.costoUnitario || Number(form.costoUnitario) <= 0) e.costoUnitario = "Debe ser > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (!validate()) return;
    const stock = Number(form.stockInicial);
    const minimo = Number(form.stockMinimo);
    let estado: ItemInventario["estado"] = "OK";
    if (stock <= minimo * 0.5) estado = "Critico";
    else if (stock <= minimo) estado = "Bajo";

    onAgregar({
      codigo: form.codigo.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      ubicacion: form.ubicacion,
      stock,
      unidad: form.unidad,
      stockMinimo: minimo,
      costoUnitario: Number(form.costoUnitario),
      ultimoIngreso: null,
      estado,
    });
    resetForm();
    setOpen(false);
  };

  const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-label text-foreground">{label}</Label>
      {children}
      {error && <p className="text-caption text-critical">{error}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Ingrediente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-xl shadow-elevated animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-h3">Nuevo Ingrediente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <Field id="codigo" label="Código" error={errors.codigo}>
              <Input id="codigo" placeholder="INS050" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} className="h-11 rounded-md" />
            </Field>
            <Field id="nombre" label="Nombre" error={errors.nombre}>
              <Input id="nombre" placeholder="Nombre del ingrediente" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="h-11 rounded-md" />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field id="categoria" label="Categoría" error={errors.categoria}>
              <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                <SelectTrigger id="categoria" className="h-11 rounded-md"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {categoriasUnicas.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field id="unidad" label="Unidad" error={errors.unidad}>
              <Select value={form.unidad} onValueChange={(v) => setForm({ ...form, unidad: v })}>
                <SelectTrigger id="unidad" className="h-11 rounded-md"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field id="ubicacion" label="Ubicación" error={errors.ubicacion}>
              <Select value={form.ubicacion} onValueChange={(v) => setForm({ ...form, ubicacion: v })}>
                <SelectTrigger id="ubicacion" className="h-11 rounded-md"><SelectValue placeholder="Estante..." /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => `Estante ${i + 1}`).map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field id="stockInicial" label="Stock Inicial" error={errors.stockInicial}>
              <Input id="stockInicial" type="number" min="0" step="0.1" placeholder="0" value={form.stockInicial} onChange={(e) => setForm({ ...form, stockInicial: e.target.value })} className="h-11 rounded-md" />
            </Field>
            <Field id="stockMinimo" label="Stock Mínimo" error={errors.stockMinimo}>
              <Input id="stockMinimo" type="number" min="0" step="0.1" placeholder="0" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} className="h-11 rounded-md" />
            </Field>
            <Field id="costoUnitario" label="Costo Unitario (S/)" error={errors.costoUnitario}>
              <Input id="costoUnitario" type="number" min="0" step="0.01" placeholder="0.00" value={form.costoUnitario} onChange={(e) => setForm({ ...form, costoUnitario: e.target.value })} className="h-11 rounded-md" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancelar</Button>
          <Button onClick={handleGuardar}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
