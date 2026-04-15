export const MODULE_CONTEXT = {
  almacen: {
    label: "Almacén",
    scope:
      "stock, insumos, movimientos, inventario, mínimos, máximos, kardex, entradas/salidas",
  },
  clientes: {
    label: "Clientes",
    scope: "clientes, historial, fidelización, reclamos, preferencias",
  },
  pedidos: {
    label: "Pedidos",
    scope:
      "órdenes, mesas, estados, cocina, delivery, takeaway, coordinación operativa",
  },
  recetas: {
    label: "Recetas",
    scope: "recetas, costos, porciones, mermas, ingredientes, fichas técnicas",
  },
};

export function resolveModuleContext(moduleKey) {
  return MODULE_CONTEXT[moduleKey] || { label: moduleKey || "Proyecto", scope: "" };
}
