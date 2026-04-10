import { useState, useMemo } from "react";
import { PackageOpen, Trash2, Plus } from "lucide-react";
import UniversalInput from "@/components/UniversalInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ingredientes, proveedores } from "@/data/ingredientes";

interface EntradaRegistro {
  id: string;
  hora: string;
  ingredienteId: number;
  ingredienteNombre: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  proveedorNombre: string;
  comprobante: string;
  quienIngresa: string;
  notas: string;
}

const hoyStr = new Date().toLocaleDateString("es-PE", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const Index = () => {
  const { toast } = useToast();
  const [entradas, setEntradas] = useState<EntradaRegistro[]>([]);

  // Form state
  const [ingredienteId, setIngredienteId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [costoUnitario, setCostoUnitario] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [comprobante, setComprobante] = useState("");
  const [quienIngresa] = useState("admin");
  const [notas, setNotas] = useState("");

  // Computed
  const costoTotal = useMemo(() => {
    const c = parseFloat(cantidad) || 0;
    const cu = parseFloat(costoUnitario) || 0;
    return c * cu;
  }, [cantidad, costoUnitario]);

  const resumen = useMemo(() => ({
    totalRegistros: entradas.length,
    montoTotal: entradas.reduce((sum, e) => sum + e.costoTotal, 0),
  }), [entradas]);

  const handleIngredienteChange = (val: string) => {
    setIngredienteId(val);
    const ing = ingredientes.find((i) => i.id.toString() === val);
    if (ing) setCostoUnitario(ing.costoUnitario.toFixed(2));
  };

  const registrarEntrada = () => {
    if (!ingredienteId || !cantidad || parseFloat(cantidad) <= 0) {
      toast({
        title: "Campos requeridos",
        description: "Selecciona un ingrediente y cantidad válida.",
        variant: "destructive",
      });
      return;
    }

    const ing = ingredientes.find((i) => i.id.toString() === ingredienteId);
    const prov = proveedores.find((p) => p.id.toString() === proveedorId);

    const nueva: EntradaRegistro = {
      id: crypto.randomUUID(),
      hora: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      ingredienteId: parseInt(ingredienteId),
      ingredienteNombre: ing?.nombre || "",
      cantidad: parseFloat(cantidad),
      costoUnitario: parseFloat(costoUnitario) || 0,
      costoTotal,
      proveedorNombre: prov?.nombre || "Sin proveedor",
      comprobante: comprobante || "-",
      quienIngresa,
      notas,
    };

    setEntradas((prev) => [nueva, ...prev]);

    // Reset form
    setIngredienteId("");
    setCantidad("");
    setCostoUnitario("");
    setProveedorId("");
    setComprobante("");
    setNotas("");

    toast({
      title: "Entrada registrada",
      description: `${ing?.nombre} — ${parseFloat(cantidad)} ${ing?.unidad}`,
    });
  };

  const eliminarEntrada = (id: string) => {
    setEntradas((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Registro eliminado" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <PackageOpen className="h-6 w-6 text-primary" />
              Ingreso diario de insumos
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Registra compras, proveedor, quien ingresó
            </p>
          </div>
          <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
            {hoyStr}
          </span>
        </div>

        {/* Universal Input */}
        <div className="mb-6">
          <UniversalInput
            onTextSubmit={(text) => {
              console.log("Texto recibido:", text);
              // TODO: procesar con IA
            }}
            onAudioCapture={(blob) => {
              console.log("Audio capturado:", blob);
              // TODO: procesar con IA
            }}
            onImageUpload={(file) => {
              console.log("Imagen subida:", file.name);
              // TODO: procesar con IA (OCR)
            }}
          />
        </div>

        {/* Form */}
        <Card className="mb-6 border-t-2 border-t-primary">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              {/* Ingrediente */}
              <div className="md:col-span-3">
                <Label className="font-semibold">Ingrediente</Label>
                <Select value={ingredienteId} onValueChange={handleIngredienteChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="-- Seleccionar ingrediente --" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientes.map((ing) => (
                      <SelectItem key={ing.id} value={ing.id.toString()}>
                        {ing.codigo} - {ing.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cantidad */}
              <div className="md:col-span-1.5">
                <Label className="font-semibold">Cantidad</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  step="0.01"
                  min="0.01"
                  placeholder="Ej: 5.00"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>

              {/* Costo unitario */}
              <div className="md:col-span-1">
                <Label className="font-semibold">Costo unit. (S/)</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 25.00"
                  value={costoUnitario}
                  onChange={(e) => setCostoUnitario(e.target.value)}
                />
              </div>

              {/* Costo total (read-only) */}
              <div className="md:col-span-1">
                <Label className="font-semibold">Costo total</Label>
                <div className="mt-1.5 flex h-10 items-center rounded-md border bg-accent px-3 text-sm font-bold text-accent-foreground">
                  S/ {costoTotal.toFixed(2)}
                </div>
              </div>

              {/* Proveedor */}
              <div className="md:col-span-2">
                <Label className="font-semibold">Proveedor</Label>
                <Select value={proveedorId} onValueChange={setProveedorId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="-- Sin proveedor --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin proveedor</SelectItem>
                    {proveedores.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Comprobante */}
              <div className="md:col-span-2">
                <Label className="font-semibold">Comprobante</Label>
                <Input
                  className="mt-1.5"
                  placeholder="Boleta/Factura #"
                  value={comprobante}
                  onChange={(e) => setComprobante(e.target.value)}
                />
              </div>

              {/* Quien ingresa */}
              <div className="md:col-span-2">
                <Label className="font-semibold">Quien ingresa</Label>
                <Input className="mt-1.5" value={quienIngresa} readOnly />
              </div>

              {/* Notas */}
              <div className="md:col-span-6">
                <Label>Notas</Label>
                <Input
                  className="mt-1.5"
                  placeholder="Observaciones..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-6">
                <Button
                  onClick={registrarEntrada}
                  className="w-full py-6 text-base font-bold"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Registrar ingreso
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {entradas.length > 0 && (
          <div className="mb-4 flex items-center gap-6 rounded-lg border border-primary/20 bg-accent px-5 py-3">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Ingresos hoy</span>
              <p className="text-xl font-bold text-primary">{resumen.totalRegistros}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-xs font-medium text-muted-foreground">Monto total</span>
              <p className="text-xl font-bold text-primary">S/ {resumen.montoTotal.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageOpen className="h-4 w-4 text-primary" />
              Entradas de hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Costo unit.</TableHead>
                  <TableHead className="text-right">Costo total</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      No hay entradas hoy
                    </TableCell>
                  </TableRow>
                ) : (
                  entradas.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.hora}</TableCell>
                      <TableCell>{e.ingredienteNombre}</TableCell>
                      <TableCell className="text-right">{e.cantidad.toFixed(2)}</TableCell>
                      <TableCell className="text-right">S/ {e.costoUnitario.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        S/ {e.costoTotal.toFixed(2)}
                      </TableCell>
                      <TableCell>{e.proveedorNombre}</TableCell>
                      <TableCell>{e.comprobante}</TableCell>
                      <TableCell>{e.quienIngresa}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => eliminarEntrada(e.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
