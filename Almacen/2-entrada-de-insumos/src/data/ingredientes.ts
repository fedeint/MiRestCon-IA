export interface Ingrediente {
  id: number;
  codigo: string;
  nombre: string;
  unidad: string;
  costoUnitario: number;
}

export const ingredientes: Ingrediente[] = [
  { id: 30, codigo: "INS030", nombre: "Aceite vegetal", unidad: "lt", costoUnitario: 6 },
  { id: 10, codigo: "INS010", nombre: "Ají amarillo", unidad: "kg", costoUnitario: 8 },
  { id: 11, codigo: "INS011", nombre: "Ají limo", unidad: "kg", costoUnitario: 10 },
  { id: 20, codigo: "INS020", nombre: "Ajo", unidad: "kg", costoUnitario: 12 },
  { id: 21, codigo: "INS021", nombre: "Arroz", unidad: "kg", costoUnitario: 3.5 },
  { id: 38, codigo: "INS038", nombre: "Azúcar", unidad: "kg", costoUnitario: 3 },
  { id: 2, codigo: "INS002", nombre: "Camarones", unidad: "kg", costoUnitario: 45 },
  { id: 14, codigo: "INS014", nombre: "Camote", unidad: "kg", costoUnitario: 2 },
  { id: 8, codigo: "INS008", nombre: "Cebolla roja", unidad: "kg", costoUnitario: 3.5 },
  { id: 15, codigo: "INS015", nombre: "Choclo desgranado", unidad: "kg", costoUnitario: 6 },
  { id: 35, codigo: "INS035", nombre: "Comino", unidad: "kg", costoUnitario: 30 },
  { id: 6, codigo: "INS006", nombre: "Corazón de res", unidad: "kg", costoUnitario: 15 },
  { id: 18, codigo: "INS018", nombre: "Culantro", unidad: "kg", costoUnitario: 4 },
  { id: 25, codigo: "INS025", nombre: "Harina", unidad: "kg", costoUnitario: 3 },
  { id: 28, codigo: "INS028", nombre: "Huevos", unidad: "und", costoUnitario: 0.5 },
  { id: 26, codigo: "INS026", nombre: "Leche evaporada", unidad: "lt", costoUnitario: 5 },
  { id: 17, codigo: "INS017", nombre: "Limón", unidad: "kg", costoUnitario: 5 },
  { id: 4, codigo: "INS004", nombre: "Lomo fino de res", unidad: "kg", costoUnitario: 32 },
  { id: 12, codigo: "INS012", nombre: "Papa amarilla", unidad: "kg", costoUnitario: 3 },
  { id: 13, codigo: "INS013", nombre: "Papa blanca", unidad: "kg", costoUnitario: 2.5 },
  { id: 1, codigo: "INS001", nombre: "Pescado fresco (corvina)", unidad: "kg", costoUnitario: 25 },
  { id: 5, codigo: "INS005", nombre: "Pollo entero", unidad: "kg", costoUnitario: 12 },
  { id: 3, codigo: "INS003", nombre: "Pulpo", unidad: "kg", costoUnitario: 35 },
  { id: 27, codigo: "INS027", nombre: "Queso fresco", unidad: "kg", costoUnitario: 18 },
  { id: 33, codigo: "INS033", nombre: "Sal", unidad: "kg", costoUnitario: 1.5 },
  { id: 23, codigo: "INS023", nombre: "Tallarín", unidad: "kg", costoUnitario: 5 },
  { id: 9, codigo: "INS009", nombre: "Tomate", unidad: "kg", costoUnitario: 4 },
];

export const proveedores = [
  { id: 1, nombre: "Mercado Central" },
  { id: 2, nombre: "Distribuidora Lima" },
  { id: 3, nombre: "Proveedor Mayorista SAC" },
  { id: 4, nombre: "Don Pedro - Pescados" },
  { id: 5, nombre: "Granja Avícola Norte" },
];
