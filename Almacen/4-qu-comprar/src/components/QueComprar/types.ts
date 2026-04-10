export interface Producto {
  id: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  unidad: "kg" | "lt" | "und";
  consumo: number;
  consumoPasado: number;
  cantidadSugerida: number;
  costoEstimado: number;
  proveedor: string;
  diasStock: number;
}

export type EstadoFiltro = "todos" | "critico" | "bajo";

export function getEstado(producto: Producto): "critico" | "bajo" | "ok" {
  const ratio = producto.stockActual / producto.stockMinimo;
  if (ratio <= 1) return "critico";
  if (ratio <= 1.5) return "bajo";
  return "ok";
}

export function ordenarPorUrgencia(productos: Producto[]): Producto[] {
  return [...productos].sort((a, b) => {
    const ratioA = a.stockActual / a.stockMinimo;
    const ratioB = b.stockActual / b.stockMinimo;
    return ratioA - ratioB;
  });
}
