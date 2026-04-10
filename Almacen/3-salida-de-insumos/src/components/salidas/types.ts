export interface SalidaRecord {
  id: string;
  hora: string;
  ingrediente: string;
  cantidad: number;
  unidad: string;
  motivo: string;
  justificacion: string;
  usuario: string;
}

export interface Ingrediente {
  id: string;
  nombre: string;
  stock: number;
  unidad: string;
}

export const INGREDIENTES: Ingrediente[] = [
  { id: "30", nombre: "Aceite vegetal", stock: 13.1, unidad: "lt" },
  { id: "10", nombre: "Aji amarillo", stock: 4.5, unidad: "kg" },
  { id: "11", nombre: "Aji limo", stock: 3.0, unidad: "kg" },
  { id: "20", nombre: "Ajo", stock: 3.0, unidad: "kg" },
  { id: "21", nombre: "Arroz", stock: 47.0, unidad: "kg" },
  { id: "38", nombre: "Azucar", stock: 15.0, unidad: "kg" },
  { id: "45", nombre: "Bolsas para llevar", stock: 200, unidad: "und" },
  { id: "2", nombre: "Camarones", stock: 7.5, unidad: "kg" },
  { id: "14", nombre: "Camote", stock: 9.2, unidad: "kg" },
  { id: "8", nombre: "Cebolla roja", stock: 23.6, unidad: "kg" },
  { id: "15", nombre: "Choclo desgranado", stock: 8.0, unidad: "kg" },
  { id: "6", nombre: "Corazón de res", stock: 10.0, unidad: "kg" },
  { id: "18", nombre: "Culantro", stock: 3.0, unidad: "kg" },
  { id: "22", nombre: "Frejol canario", stock: 8.0, unidad: "kg" },
  { id: "25", nombre: "Harina", stock: 9.4, unidad: "kg" },
  { id: "28", nombre: "Huevos", stock: 91, unidad: "und" },
  { id: "26", nombre: "Leche evaporada", stock: 19.9, unidad: "lt" },
  { id: "17", nombre: "Limón", stock: 8.8, unidad: "kg" },
  { id: "4", nombre: "Lomo fino de res", stock: 20.0, unidad: "kg" },
  { id: "12", nombre: "Papa amarilla", stock: 25.3, unidad: "kg" },
  { id: "13", nombre: "Papa blanca", stock: 24.3, unidad: "kg" },
  { id: "1", nombre: "Pescado fresco (corvina)", stock: 13.2, unidad: "kg" },
  { id: "5", nombre: "Pollo entero", stock: 24.9, unidad: "kg" },
  { id: "3", nombre: "Pulpo", stock: 4.8, unidad: "kg" },
  { id: "33", nombre: "Sal", stock: 10.0, unidad: "kg" },
  { id: "9", nombre: "Tomate", stock: 15.0, unidad: "kg" },
];

export const MOTIVOS = [
  { value: "merma_vencimiento", label: "Vencido" },
  { value: "merma_dano", label: "Dañado" },
  { value: "merma_preparacion", label: "Desperdicio" },
  { value: "consumo_interno", label: "Consumo interno" },
  { value: "regalo", label: "Regalo" },
  { value: "robo_perdida", label: "Pérdida" },
];
