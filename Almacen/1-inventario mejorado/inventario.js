// 1. Datos iniciales del inventario (Dataset proporcionado)
const baseInventario = [
    { codigo: "INS030", nombre: "Aceite vegetal", categoria: "Aceites, grasas y azúcar", ubicacion: "Estante 3", stockActual: 13.1, unidad: "lt", stockMinimo: 8, costoUnitario: 6.00, ultimoIngreso: "2026-03-28" },
    { codigo: "INS010", nombre: "Aji amarillo", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 4.5, unidad: "kg", stockMinimo: 2, costoUnitario: 8.00, ultimoIngreso: "2026-04-01" },
    { codigo: "INS011", nombre: "Aji limo", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 3, unidad: "kg", stockMinimo: 1, costoUnitario: 10.00, ultimoIngreso: "—" },
    { codigo: "INS020", nombre: "Ajo", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 3, unidad: "kg", stockMinimo: 1, costoUnitario: 12.00, ultimoIngreso: "2026-03-30" },
    { codigo: "INS021", nombre: "Arroz", categoria: "Granos, harinas y pastas", ubicacion: "Estante 1", stockActual: 47, unidad: "kg", stockMinimo: 20, costoUnitario: 3.50, ultimoIngreso: "2026-04-02" },
    { codigo: "INS038", nombre: "Azucar", categoria: "Aceites, grasas y azúcar", ubicacion: "Estante 3", stockActual: 15, unidad: "kg", stockMinimo: 8, costoUnitario: 3.00, ultimoIngreso: "—" },
    { codigo: "INS045", nombre: "Bolsas para llevar", categoria: "Descartables", ubicacion: "Estante 10", stockActual: 200, unidad: "und", stockMinimo: 100, costoUnitario: 0.10, ultimoIngreso: "2026-03-25" },
    { codigo: "INS002", nombre: "Camarones", categoria: "Pescados y mariscos", ubicacion: "Estante 8", stockActual: 2, unidad: "kg", stockMinimo: 5, costoUnitario: 35.00, ultimoIngreso: "2026-03-20" },
    { codigo: "INS014", nombre: "Camote", categoria: "Tubérculos", ubicacion: "Estante 2", stockActual: 20, unidad: "kg", stockMinimo: 8, costoUnitario: 2.50, ultimoIngreso: "—" },
    { codigo: "INS015", nombre: "Cancha serrana", categoria: "Granos, harinas y pastas", ubicacion: "Estante 1", stockActual: 3, unidad: "kg", stockMinimo: 5, costoUnitario: 6.00, ultimoIngreso: "2026-03-15" },
    { codigo: "INS005", nombre: "Cebolla morada", categoria: "Vegetales", ubicacion: "Estante 4", stockActual: 5, unidad: "kg", stockMinimo: 3, costoUnitario: 3.00, ultimoIngreso: "2026-04-03" },
    { codigo: "INS006", nombre: "Cebolla roja", categoria: "Vegetales", ubicacion: "Estante 4", stockActual: 20, unidad: "kg", stockMinimo: 8, costoUnitario: 3.00, ultimoIngreso: "2026-04-01" },
    { codigo: "INS016", nombre: "Choclo desgranado", categoria: "Vegetales", ubicacion: "Estante 4", stockActual: 6, unidad: "kg", stockMinimo: 3, costoUnitario: 5.00, ultimoIngreso: "—" },
    { codigo: "INS007", nombre: "Culantro", categoria: "Vegetales", ubicacion: "Estante 6", stockActual: 0.4, unidad: "kg", stockMinimo: 1, costoUnitario: 4.00, ultimoIngreso: "2026-03-18" },
    { codigo: "INS024", nombre: "Frejol canario", categoria: "Legumbres", ubicacion: "Estante 1", stockActual: 8, unidad: "kg", stockMinimo: 5, costoUnitario: 7.00, ultimoIngreso: "—" },
    { codigo: "INS036", nombre: "Harina de trigo", categoria: "Granos, harinas y pastas", ubicacion: "Estante 1", stockActual: 10, unidad: "kg", stockMinimo: 5, costoUnitario: 3.00, ultimoIngreso: "2026-03-29" },
    { codigo: "INS012", nombre: "Huacatay", categoria: "Condimentos y especias", ubicacion: "Estante 6", stockActual: 0.8, unidad: "kg", stockMinimo: 1, costoUnitario: 6.00, ultimoIngreso: "—" },
    { codigo: "INS035", nombre: "Huevos", categoria: "Lácteos y huevos", ubicacion: "Estante 7", stockActual: 182, unidad: "und", stockMinimo: 60, costoUnitario: 0.40, ultimoIngreso: "2026-04-03" },
    { codigo: "INS034", nombre: "Leche evaporada", categoria: "Lácteos y huevos", ubicacion: "Estante 7", stockActual: 20, unidad: "lt", stockMinimo: 10, costoUnitario: 4.50, ultimoIngreso: "2026-03-31" },
    { codigo: "INS017", nombre: "Lechuga", categoria: "Vegetales", ubicacion: "Estante 6", stockActual: 8, unidad: "kg", stockMinimo: 3, costoUnitario: 3.00, ultimoIngreso: "2026-04-02" },
    { codigo: "INS004", nombre: "Limon", categoria: "Frutas", ubicacion: "Estante 6", stockActual: 22, unidad: "kg", stockMinimo: 8, costoUnitario: 4.00, ultimoIngreso: "2026-04-01" },
    { codigo: "INS025", nombre: "Lomo fino de res", categoria: "Carnes", ubicacion: "Estante 9", stockActual: 16, unidad: "kg", stockMinimo: 8, costoUnitario: 32.00, ultimoIngreso: "2026-03-30" },
    { codigo: "INS039", nombre: "Maiz morado", categoria: "Granos, harinas y pastas", ubicacion: "Estante 1", stockActual: 8, unidad: "kg", stockMinimo: 5, costoUnitario: 4.00, ultimoIngreso: "—" },
    { codigo: "INS037", nombre: "Mantequilla", categoria: "Lácteos y huevos", ubicacion: "Estante 7", stockActual: 5, unidad: "kg", stockMinimo: 3, costoUnitario: 18.00, ultimoIngreso: "2026-03-27" },
    { codigo: "INS033", nombre: "Mayonesa", categoria: "Cremas, salsas y vinagres", ubicacion: "Estante 3", stockActual: 5, unidad: "lt", stockMinimo: 3, costoUnitario: 8.00, ultimoIngreso: "—" },
    { codigo: "INS013", nombre: "Papa amarilla", categoria: "Tubérculos", ubicacion: "Estante 2", stockActual: 42, unidad: "kg", stockMinimo: 15, costoUnitario: 3.50, ultimoIngreso: "2026-04-02" },
    { codigo: "INS008", nombre: "Papa blanca", categoria: "Tubérculos", ubicacion: "Estante 2", stockActual: 40, unidad: "kg", stockMinimo: 15, costoUnitario: 2.50, ultimoIngreso: "2026-04-01" },
    { codigo: "INS022", nombre: "Pasta de aji panca", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 3, unidad: "kg", stockMinimo: 2, costoUnitario: 12.00, ultimoIngreso: "2026-03-22" },
    { codigo: "INS001", nombre: "Pescado fresco (corvina)", categoria: "Pescados y mariscos", ubicacion: "Estante 8", stockActual: 26, unidad: "kg", stockMinimo: 10, costoUnitario: 25.00, ultimoIngreso: "2026-04-03" },
    { codigo: "INS029", nombre: "Pimienta negra", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 1, unidad: "kg", stockMinimo: 0.5, costoUnitario: 25.00, ultimoIngreso: "—" },
    { codigo: "INS040", nombre: "Pisco", categoria: "Bebidas", ubicacion: "Estante 10", stockActual: 5, unidad: "lt", stockMinimo: 3, costoUnitario: 20.00, ultimoIngreso: "2026-03-28" },
    { codigo: "INS026", nombre: "Pollo entero", categoria: "Carnes", ubicacion: "Estante 9", stockActual: 35, unidad: "kg", stockMinimo: 15, costoUnitario: 10.00, ultimoIngreso: "2026-04-03" },
    { codigo: "INS003", nombre: "Pulpo", categoria: "Pescados y mariscos", ubicacion: "Estante 8", stockActual: 6, unidad: "kg", stockMinimo: 3, costoUnitario: 30.00, ultimoIngreso: "2026-03-26" },
    { codigo: "INS041", nombre: "Queso fresco", categoria: "Lácteos y huevos", ubicacion: "Estante 7", stockActual: 5, unidad: "kg", stockMinimo: 3, costoUnitario: 15.00, ultimoIngreso: "—" },
    { codigo: "INS028", nombre: "Sal", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 5, unidad: "kg", stockMinimo: 3, costoUnitario: 1.50, ultimoIngreso: "2026-03-30" },
    { codigo: "INS031", nombre: "Sillao", categoria: "Cremas, salsas y vinagres", ubicacion: "Estante 3", stockActual: 4.4, unidad: "lt", stockMinimo: 2, costoUnitario: 8.00, ultimoIngreso: "—" },
    { codigo: "INS023", nombre: "Tallarin", categoria: "Granos, harinas y pastas", ubicacion: "Estante 1", stockActual: 10, unidad: "kg", stockMinimo: 5, costoUnitario: 5.00, ultimoIngreso: "2026-03-29" },
    { codigo: "INS009", nombre: "Tomate", categoria: "Vegetales", ubicacion: "Estante 4", stockActual: 15, unidad: "kg", stockMinimo: 8, costoUnitario: 4.00, ultimoIngreso: "2026-04-02" },
    { codigo: "INS032", nombre: "Vinagre", categoria: "Cremas, salsas y vinagres", ubicacion: "Estante 3", stockActual: 3, unidad: "lt", stockMinimo: 1, costoUnitario: 4.00, ultimoIngreso: "—" },
];

// 2. Estado de la aplicación
let inventarioActual = JSON.parse(localStorage.getItem('inventario_mirest')) || baseInventario;
let sortConfig = { key: 'nombre', direction: 'asc' };

// 3. Elementos del DOM
const listaInventario = document.getElementById('listaInventario');
const totalInsumosLabel = document.getElementById('totalInsumos');
const stockOkLabel = document.getElementById('stockOk');
const stockBajoLabel = document.getElementById('stockBajo');
const stockCriticoLabel = document.getElementById('stockCritico');
const buscador = document.getElementById('buscador');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroEstado = document.getElementById('filtroEstado');
const btnAgregarInsumos = document.getElementById('btnAgregarInsumos');

// 4. Inicialización
function init() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'inventario_mirest') {
            inventarioActual = JSON.parse(e.newValue);
            recalcularEstados();
            renderizarInventario();
        }
    });

    recalcularEstados();
    cargarFiltros();
    renderizarInventario();
    configurarEventos();
}

// 5. Lógica de Procesamiento de Entradas (Ya no se usa procesarNuevaEntrada por ser manual)
// 6. Lógica de Estado
function recalcularEstados() {
    inventarioActual = inventarioActual.map(item => {
        const stock = item.stockActual;
        const minimo = item.stockMinimo;
        const unitario = item.costoUnitario || 0;
        let estado = 'ok';

        if (stock === 0 || stock < minimo) {
            estado = 'critico';
        } else if (stock >= minimo && stock <= (2 * minimo)) {
            estado = 'bajo';
        } else if (stock > (2 * minimo)) {
            estado = 'ok';
        }

        // Asegurar que proveedores sea un array para soportar múltiples proveedores
        if (!item.proveedoresList || item.proveedoresList.length === 0) {
            item.proveedoresList = [{
                nombre: item.proveedor || "Sin proveedor",
                costoUnitario: unitario,
                ubicacion: item.ubicacion || "Sin asignar",
                stock: stock
            }];
        }

        return { 
            ...item, 
            estado,
            costoTotal: stock * unitario
        };
    });
}

function guardarInventario() {
    recalcularEstados();
    localStorage.setItem('inventario_mirest', JSON.stringify(inventarioActual));
}

// 7. Interfaz de Usuario
function cargarFiltros() {
    const categorias = [...new Set(inventarioActual.map(i => i.categoria))].sort();
    filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filtroCategoria.appendChild(option);
    });
}

function renderizarInventario() {
    let filtrados = inventarioActual.filter(item => {
        const term = buscador.value.toLowerCase();
        const matchesSearch = 
            item.nombre.toLowerCase().includes(term) ||
            item.codigo.toLowerCase().includes(term) ||
            item.categoria.toLowerCase().includes(term) ||
            item.ubicacion.toLowerCase().includes(term);
        
        const matchesCat = !filtroCategoria.value || item.categoria === filtroCategoria.value;
        const matchesEstado = !filtroEstado.value || item.estado === filtroEstado.value;

        return matchesSearch && matchesCat && matchesEstado;
    });

    filtrados.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    listaInventario.innerHTML = '';
    filtrados.forEach(item => {
        const row = document.createElement('tr');
        
        // Lógica de proveedores (Requerimiento 1.2: Listado completo)
        let proveedoresHTML = '';
        if (item.proveedoresList && item.proveedoresList.length > 0) {
            proveedoresHTML = `
                <div class="multi-proveedores-toggle" onclick="toggleProveedores('${item.codigo}')" style="cursor: pointer; color: var(--primary); font-size: 0.75rem; font-weight: 600;">
                    Ver proveedores (${item.proveedoresList.length}) ▾
                </div>
                <div id="prov-${item.codigo}" class="proveedores-lista" style="display: none; margin-top: 0.5rem; border-top: 1px solid var(--border); padding-top: 0.5rem;">
                    ${item.proveedoresList.map(p => `
                        <div style="font-size: 0.7rem; margin-bottom: 0.4rem; padding-bottom: 0.2rem; border-bottom: 1px dashed var(--border);">
                            <div style="font-weight: 700; color: var(--foreground);">${p.nombre}</div>
                            <div style="color: var(--muted-foreground);">
                                S/ ${(p.costoUnitario || 0).toFixed(2)} | Stock: ${p.stock || 0}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        row.innerHTML = `
            <td>${item.codigo}</td>
            <td style="font-weight: 600;">[${item.nombre}]</td>
            <td>${item.categoria}</td>
            <td>
                ${proveedoresHTML || item.proveedor || '-'}
            </td>
            <td>[S/ ${(item.costoUnitario || 0).toFixed(2)}]</td>
            <td>[S/ ${(item.costoTotal || 0).toFixed(2)}]</td>
            <td>${item.ultimoIngreso}</td>
            <td><span class="badge-estado badge-${item.estado}">${item.estado}</span></td>
            <td>${item.ubicacion}</td>
            <td style="font-weight: 700;">[${item.stockActual} ${item.unidad}]</td>
            <td>[${item.stockMinimo} ${item.unidad}]</td>
        `;
        listaInventario.appendChild(row);
    });

    totalInsumosLabel.textContent = filtrados.length;
    stockOkLabel.textContent = filtrados.filter(i => i.estado === 'ok').length;
    stockBajoLabel.textContent = filtrados.filter(i => i.estado === 'bajo').length;
    stockCriticoLabel.textContent = filtrados.filter(i => i.estado === 'critico').length;
}

window.toggleProveedores = function(codigo) {
    const el = document.getElementById(`prov-${codigo}`);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

function configurarEventos() {
    buscador.addEventListener('input', renderizarInventario);
    filtroCategoria.addEventListener('change', renderizarInventario);
    filtroEstado.addEventListener('change', renderizarInventario);
    
    if (btnAgregarInsumos) {
        btnAgregarInsumos.addEventListener('click', () => {
            window.location.href = '../2-entrada de insumos mejorado/entrada-de-insumos.html';
        });
    }

    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.dataset.sort;
            sortConfig.direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
            sortConfig.key = key;
            renderizarInventario();
        });
    });
}

init();
