export type EstadoStock = "OK" | "Bajo" | "Critico";

export interface ItemInventario {
  codigo: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  stock: number;
  unidad: string;
  stockMinimo: number;
  costoUnitario: number;
  ultimoIngreso: string | null;
  estado: EstadoStock;
}

// Categorías asignadas correctamente según el tipo de producto
const categorias: Record<string, string> = {
  "Aceite vegetal": "Aceites, grasas y azúcar",
  "Aji amarillo": "Condimentos y especias",
  "Aji limo": "Condimentos y especias",
  "Ajo": "Condimentos y especias",
  "Arroz": "Granos, harinas y pastas",
  "Azucar": "Aceites, grasas y azúcar",
  "Bolsas para llevar": "Descartables",
  "Camarones": "Pescados y mariscos",
  "Camote": "Tubérculos",
  "Cancha serrana": "Granos, harinas y pastas",
  "Cebolla morada": "Vegetales",
  "Cebolla roja": "Vegetales",
  "Choclo desgranado": "Vegetales",
  "Culantro": "Vegetales",
  "Frejol canario": "Legumbres",
  "Harina de trigo": "Granos, harinas y pastas",
  "Huacatay": "Condimentos y especias",
  "Huevos": "Lácteos y huevos",
  "Kion": "Condimentos y especias",
  "Leche evaporada": "Lácteos y huevos",
  "Lechuga": "Vegetales",
  "Limon": "Frutas",
  "Lomo fino de res": "Carnes",
  "Maiz morado": "Granos, harinas y pastas",
  "Mantequilla": "Lácteos y huevos",
  "Mayonesa": "Cremas, salsas y vinagres",
  "Papa amarilla": "Tubérculos",
  "Papa blanca": "Tubérculos",
  "Pasta de aji panca": "Condimentos y especias",
  "Pescado fresco (corvina)": "Pescados y mariscos",
  "Pimienta negra": "Condimentos y especias",
  "Pisco": "Bebidas",
  "Pollo entero": "Carnes",
  "Pulpo": "Pescados y mariscos",
  "Queso fresco": "Lácteos y huevos",
  "Sal": "Condimentos y especias",
  "Sillao": "Cremas, salsas y vinagres",
  "Tallarin": "Granos, harinas y pastas",
  "Tomate": "Vegetales",
  "Vinagre": "Cremas, salsas y vinagres",
};

function getEstado(stock: number, minimo: number): EstadoStock {
  if (stock <= minimo * 0.5) return "Critico";
  if (stock <= minimo) return "Bajo";
  return "OK";
}

const rawData: Array<Omit<ItemInventario, "categoria" | "estado">> = [
  { codigo: "INS030", nombre: "Aceite vegetal", ubicacion: "Estante 3", stock: 13.1, unidad: "lt", stockMinimo: 8, costoUnitario: 6.0, ultimoIngreso: "2026-03-28" },
  { codigo: "INS010", nombre: "Aji amarillo", ubicacion: "Estante 5", stock: 4.5, unidad: "kg", stockMinimo: 2, costoUnitario: 8.0, ultimoIngreso: "2026-04-01" },
  { codigo: "INS011", nombre: "Aji limo", ubicacion: "Estante 5", stock: 3.0, unidad: "kg", stockMinimo: 1, costoUnitario: 10.0, ultimoIngreso: null },
  { codigo: "INS020", nombre: "Ajo", ubicacion: "Estante 5", stock: 3.0, unidad: "kg", stockMinimo: 1, costoUnitario: 12.0, ultimoIngreso: "2026-03-30" },
  { codigo: "INS021", nombre: "Arroz", ubicacion: "Estante 1", stock: 47.0, unidad: "kg", stockMinimo: 20, costoUnitario: 3.5, ultimoIngreso: "2026-04-02" },
  { codigo: "INS038", nombre: "Azucar", ubicacion: "Estante 3", stock: 15.0, unidad: "kg", stockMinimo: 8, costoUnitario: 3.0, ultimoIngreso: null },
  { codigo: "INS045", nombre: "Bolsas para llevar", ubicacion: "Estante 10", stock: 200, unidad: "und", stockMinimo: 100, costoUnitario: 0.1, ultimoIngreso: "2026-03-25" },
  { codigo: "INS002", nombre: "Camarones", ubicacion: "Estante 8", stock: 2.0, unidad: "kg", stockMinimo: 5, costoUnitario: 35.0, ultimoIngreso: "2026-03-20" },
  { codigo: "INS014", nombre: "Camote", ubicacion: "Estante 2", stock: 20.0, unidad: "kg", stockMinimo: 8, costoUnitario: 2.5, ultimoIngreso: null },
  { codigo: "INS015", nombre: "Cancha serrana", ubicacion: "Estante 1", stock: 3.0, unidad: "kg", stockMinimo: 5, costoUnitario: 6.0, ultimoIngreso: "2026-03-15" },
  { codigo: "INS005", nombre: "Cebolla morada", ubicacion: "Estante 4", stock: 5.0, unidad: "kg", stockMinimo: 3, costoUnitario: 3.0, ultimoIngreso: "2026-04-03" },
  { codigo: "INS006", nombre: "Cebolla roja", ubicacion: "Estante 4", stock: 20.0, unidad: "kg", stockMinimo: 8, costoUnitario: 3.0, ultimoIngreso: "2026-04-01" },
  { codigo: "INS016", nombre: "Choclo desgranado", ubicacion: "Estante 4", stock: 6.0, unidad: "kg", stockMinimo: 3, costoUnitario: 5.0, ultimoIngreso: null },
  { codigo: "INS007", nombre: "Culantro", ubicacion: "Estante 6", stock: 0.4, unidad: "kg", stockMinimo: 1, costoUnitario: 4.0, ultimoIngreso: "2026-03-18" },
  { codigo: "INS024", nombre: "Frejol canario", ubicacion: "Estante 1", stock: 8.0, unidad: "kg", stockMinimo: 5, costoUnitario: 7.0, ultimoIngreso: null },
  { codigo: "INS036", nombre: "Harina de trigo", ubicacion: "Estante 1", stock: 10.0, unidad: "kg", stockMinimo: 5, costoUnitario: 3.0, ultimoIngreso: "2026-03-29" },
  { codigo: "INS012", nombre: "Huacatay", ubicacion: "Estante 6", stock: 0.8, unidad: "kg", stockMinimo: 1, costoUnitario: 6.0, ultimoIngreso: null },
  { codigo: "INS035", nombre: "Huevos", ubicacion: "Estante 7", stock: 182, unidad: "und", stockMinimo: 60, costoUnitario: 0.4, ultimoIngreso: "2026-04-03" },
  { codigo: "INS019", nombre: "Kion", ubicacion: "Estante 5", stock: 2.0, unidad: "kg", stockMinimo: 1, costoUnitario: 8.0, ultimoIngreso: null },
  { codigo: "INS034", nombre: "Leche evaporada", ubicacion: "Estante 7", stock: 20.0, unidad: "lt", stockMinimo: 10, costoUnitario: 4.5, ultimoIngreso: "2026-03-31" },
  { codigo: "INS017", nombre: "Lechuga", ubicacion: "Estante 6", stock: 8.0, unidad: "kg", stockMinimo: 3, costoUnitario: 3.0, ultimoIngreso: "2026-04-02" },
  { codigo: "INS004", nombre: "Limon", ubicacion: "Estante 6", stock: 22.0, unidad: "kg", stockMinimo: 8, costoUnitario: 4.0, ultimoIngreso: "2026-04-01" },
  { codigo: "INS025", nombre: "Lomo fino de res", ubicacion: "Estante 9", stock: 16.0, unidad: "kg", stockMinimo: 8, costoUnitario: 32.0, ultimoIngreso: "2026-03-30" },
  { codigo: "INS039", nombre: "Maiz morado", ubicacion: "Estante 1", stock: 8.0, unidad: "kg", stockMinimo: 5, costoUnitario: 4.0, ultimoIngreso: null },
  { codigo: "INS037", nombre: "Mantequilla", ubicacion: "Estante 7", stock: 5.0, unidad: "kg", stockMinimo: 3, costoUnitario: 18.0, ultimoIngreso: "2026-03-27" },
  { codigo: "INS033", nombre: "Mayonesa", ubicacion: "Estante 3", stock: 5.0, unidad: "lt", stockMinimo: 3, costoUnitario: 8.0, ultimoIngreso: null },
  { codigo: "INS013", nombre: "Papa amarilla", ubicacion: "Estante 2", stock: 42.0, unidad: "kg", stockMinimo: 15, costoUnitario: 3.5, ultimoIngreso: "2026-04-02" },
  { codigo: "INS008", nombre: "Papa blanca", ubicacion: "Estante 2", stock: 40.0, unidad: "kg", stockMinimo: 15, costoUnitario: 2.5, ultimoIngreso: "2026-04-01" },
  { codigo: "INS022", nombre: "Pasta de aji panca", ubicacion: "Estante 5", stock: 3.0, unidad: "kg", stockMinimo: 2, costoUnitario: 12.0, ultimoIngreso: "2026-03-22" },
  { codigo: "INS001", nombre: "Pescado fresco (corvina)", ubicacion: "Estante 8", stock: 26.0, unidad: "kg", stockMinimo: 10, costoUnitario: 25.0, ultimoIngreso: "2026-04-03" },
  { codigo: "INS029", nombre: "Pimienta negra", ubicacion: "Estante 5", stock: 1.0, unidad: "kg", stockMinimo: 0.5, costoUnitario: 25.0, ultimoIngreso: null },
  { codigo: "INS040", nombre: "Pisco", ubicacion: "Estante 10", stock: 5.0, unidad: "lt", stockMinimo: 3, costoUnitario: 20.0, ultimoIngreso: "2026-03-28" },
  { codigo: "INS026", nombre: "Pollo entero", ubicacion: "Estante 9", stock: 35.0, unidad: "kg", stockMinimo: 15, costoUnitario: 10.0, ultimoIngreso: "2026-04-03" },
  { codigo: "INS003", nombre: "Pulpo", ubicacion: "Estante 8", stock: 6.0, unidad: "kg", stockMinimo: 3, costoUnitario: 30.0, ultimoIngreso: "2026-03-26" },
  { codigo: "INS041", nombre: "Queso fresco", ubicacion: "Estante 7", stock: 5.0, unidad: "kg", stockMinimo: 3, costoUnitario: 15.0, ultimoIngreso: null },
  { codigo: "INS028", nombre: "Sal", ubicacion: "Estante 5", stock: 5.0, unidad: "kg", stockMinimo: 3, costoUnitario: 1.5, ultimoIngreso: "2026-03-30" },
  { codigo: "INS031", nombre: "Sillao", ubicacion: "Estante 3", stock: 4.4, unidad: "lt", stockMinimo: 2, costoUnitario: 8.0, ultimoIngreso: null },
  { codigo: "INS023", nombre: "Tallarin", ubicacion: "Estante 1", stock: 10.0, unidad: "kg", stockMinimo: 5, costoUnitario: 5.0, ultimoIngreso: "2026-03-29" },
  { codigo: "INS009", nombre: "Tomate", ubicacion: "Estante 4", stock: 15.0, unidad: "kg", stockMinimo: 8, costoUnitario: 4.0, ultimoIngreso: "2026-04-02" },
  { codigo: "INS032", nombre: "Vinagre", ubicacion: "Estante 3", stock: 3.0, unidad: "lt", stockMinimo: 1, costoUnitario: 4.0, ultimoIngreso: null },
];

export const inventarioData: ItemInventario[] = rawData.map((item) => ({
  ...item,
  categoria: categorias[item.nombre] || "Sin clasificar",
  estado: getEstado(item.stock, item.stockMinimo),
}));

export const categoriasUnicas = [
  "Aceites, grasas y azúcar",
  "Bebidas",
  "Carnes",
  "Condimentos y especias",
  "Cremas, salsas y vinagres",
  "Descartables",
  "Frutas",
  "Granos, harinas y pastas",
  "Lácteos y huevos",
  "Legumbres",
  "Pescados y mariscos",
  "Tubérculos",
  "Vegetales",
];
