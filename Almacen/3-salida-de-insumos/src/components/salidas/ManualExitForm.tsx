import { useState } from "react";
import { BoxSelect } from "lucide-react";
import { INGREDIENTES, MOTIVOS } from "./types";
import type { SalidaRecord } from "./types";
import { toast } from "sonner";

interface ManualExitFormProps {
  onRegister: (record: Omit<SalidaRecord, "id" | "hora" | "usuario">) => void;
}

export const ManualExitForm = ({ onRegister }: ManualExitFormProps) => {
  const [ingredienteId, setIngredienteId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("merma_vencimiento");
  const [justificacion, setJustificacion] = useState("");

  const selectedIngrediente = INGREDIENTES.find((i) => i.id === ingredienteId);

  const handleSubmit = () => {
    if (!ingredienteId || !cantidad || !justificacion.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    const cantNum = parseFloat(cantidad);
    if (isNaN(cantNum) || cantNum <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    const motivoLabel = MOTIVOS.find((m) => m.value === motivo)?.label || motivo;

    onRegister({
      ingrediente: selectedIngrediente?.nombre || "",
      cantidad: cantNum,
      unidad: selectedIngrediente?.unidad || "",
      motivo: motivoLabel,
      justificacion: justificacion.trim(),
    });

    toast.success("Salida registrada correctamente");

    // Reset
    setIngredienteId("");
    setCantidad("");
    setMotivo("merma_vencimiento");
    setJustificacion("");
  };

  return (
    <div className="mirest-card-static mb-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary-gradient)" }}>
          <BoxSelect className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Salida manual</h2>
          <p className="text-xs text-muted-foreground">Registro de salidas manuales: merma, vencimiento, consumo interno</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Ingrediente */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Ingrediente</label>
          <select
            value={ingredienteId}
            onChange={(e) => setIngredienteId(e.target.value)}
            className="mirest-input"
          >
            <option value="">— Seleccionar —</option>
            {INGREDIENTES.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.nombre} ({ing.stock} {ing.unidad})
              </option>
            ))}
          </select>
          {selectedIngrediente && (
            <p className="text-xs text-muted-foreground mt-1">
              Unidad: <span className="font-semibold text-primary">{selectedIngrediente.unidad}</span>
              {" · "}Stock: {selectedIngrediente.stock} {selectedIngrediente.unidad}
            </p>
          )}
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Cantidad {selectedIngrediente && <span className="text-muted-foreground">({selectedIngrediente.unidad})</span>}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={cantidad}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*\.?\d*$/.test(val)) {
                setCantidad(val);
              }
            }}
            placeholder="Ej: 1.5"
            className="mirest-input"
          />
        </div>

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Motivo</label>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="mirest-input"
          >
            {MOTIVOS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Justificación */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Justificación <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            placeholder="Obligatorio — describe el motivo"
            className="mirest-input"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mirest-gradient-btn w-full h-12 text-sm flex items-center justify-center gap-2"
      >
        <BoxSelect className="w-4 h-4" />
        Registrar salida
      </button>
    </div>
  );
};
