import { useState } from "react";
import { AlertTriangle, ChefHat, Package, Clock, Trash2, BoxSelect } from "lucide-react";
import { AutomaticBlock } from "@/components/salidas/AutomaticBlock";
import { ManualExitForm } from "@/components/salidas/ManualExitForm";
import { DailyRecords } from "@/components/salidas/DailyRecords";
import type { SalidaRecord } from "@/components/salidas/types";

const SalidasPage = () => {
  const [records, setRecords] = useState<SalidaRecord[]>([]);
  const [cajaAbierta] = useState(false);
  const [platosHoy] = useState(0);

  const handleRegister = (record: Omit<SalidaRecord, "id" | "hora" | "usuario">) => {
    const newRecord: SalidaRecord = {
      ...record,
      id: crypto.randomUUID(),
      hora: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      usuario: "admin",
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Salida de productos (insumos)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Insumos descontados automáticamente al enviar platos a cocina
            </p>
          </div>
          <span className="mirest-badge mirest-badge-neutral text-xs">
            {new Date().toLocaleDateString("es-PE")}
          </span>
        </div>

        {/* Automatic Block - compact */}
        <AutomaticBlock cajaAbierta={cajaAbierta} platosHoy={platosHoy} />

        {/* Manual Exit Form - main focus */}
        <ManualExitForm onRegister={handleRegister} />

        {/* Daily Records */}
        <DailyRecords records={records} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default SalidasPage;
