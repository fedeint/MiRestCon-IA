import { Trash2, Inbox } from "lucide-react";
import type { SalidaRecord } from "./types";

interface DailyRecordsProps {
  records: SalidaRecord[];
  onDelete: (id: string) => void;
}

export const DailyRecords = ({ records, onDelete }: DailyRecordsProps) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        Registros del día
        {records.length > 0 && (
          <span className="mirest-badge mirest-badge-neutral">{records.length}</span>
        )}
      </h3>

      {records.length === 0 ? (
        <div className="mirest-card-static flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Inbox className="w-10 h-10 mb-2 opacity-40" />
          <p className="text-sm">Sin salidas manuales registradas hoy</p>
        </div>
      ) : (
        <div className="mirest-table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="mirest-table-header">
                <th className="text-left px-4 py-3">Hora</th>
                <th className="text-left px-4 py-3">Ingrediente</th>
                <th className="text-right px-4 py-3">Cantidad</th>
                <th className="text-left px-4 py-3">Motivo</th>
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-center px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{record.hora}</td>
                  <td className="px-4 py-3 text-foreground">{record.ingrediente}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {record.cantidad} <span className="text-muted-foreground">{record.unidad}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="mirest-badge mirest-badge-warning">{record.motivo}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{record.usuario}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
