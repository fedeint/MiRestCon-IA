import { Producto, getEstado } from "./types";

interface ProductoRowProps {
  producto: Producto;
}

export function ProductoRow({ producto }: ProductoRowProps) {
  const estado = getEstado(producto);

  const estadoConfig = {
    critico: {
      label: "Crítico",
      badgeBg: "bg-destructive/10",
      badgeText: "text-destructive",
    },
    bajo: {
      label: "Bajo",
      badgeBg: "bg-warning/10",
      badgeText: "text-warning",
    },
  } as const;

  const config = estadoConfig[estado as "critico" | "bajo"];
  if (!config) return null;

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors duration-150">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 rounded-full ${estado === "critico" ? "bg-destructive" : "bg-warning"}`} />
          <span className="font-medium text-sm text-foreground">
            {producto.nombre}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {producto.stockActual} {producto.unidad}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {producto.consumo} {producto.unidad}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {producto.consumoPasado} {producto.unidad}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {producto.stockMinimo} {producto.unidad}
      </td>

      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          {producto.cantidadSugerida} {producto.unidad}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        S/ {producto.costoEstimado.toFixed(2)}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {producto.proveedor}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {producto.diasStock} {producto.diasStock === 1 ? "día" : "días"}
      </td>

      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}>
          {config.label}
        </span>
      </td>
    </tr>
  );
}
