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
    { codigo: "INS019", nombre: "Kion", categoria: "Condimentos y especias", ubicacion: "Estante 5", stockActual: 2, unidad: "kg", stockMinimo: 1, costoUnitario: 8.00, ultimoIngreso: "—" },
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

// Paginación
const itemsPorPagina = 8;
let paginaActual = 1;

// 3. Elementos del DOM
const listaInventario = document.getElementById('listaInventario');
const totalInsumosLabel = document.getElementById('totalInsumos');
const stockOkLabel = document.getElementById('stockOk');
const stockBajoLabel = document.getElementById('stockBajo');
const stockBajoMetric = document.getElementById('stockBajoMetric');
const stockCriticoLabel = document.getElementById('stockCritico');
const buscador = document.getElementById('buscador');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroEstado = document.getElementById('filtroEstado');
const btnNuevoInsumo = document.getElementById('btnNuevoInsumo');

// Paginación DOM
const btnPrevPage = document.getElementById('prevPage');
const btnNextPage = document.getElementById('nextPage');
const labelCurrentPage = document.getElementById('currentPage');
const labelTotalPages = document.getElementById('totalPages');

// 4. Inicialización
function init() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'nueva_entrada_insumo' && e.newValue) {
            const datosEntrada = JSON.parse(e.newValue);
            procesarNuevaEntrada(datosEntrada);
            // Limpiar señal temporal
            localStorage.removeItem('nueva_entrada_insumo');
        }
    });

    const entradaPendiente = localStorage.getItem('nueva_entrada_insumo');
    if (entradaPendiente) {
        procesarNuevaEntrada(JSON.parse(entradaPendiente));
        localStorage.removeItem('nueva_entrada_insumo');
    }

    recalcularEstados();
    cargarFiltros();
    renderizarInventario();
    configurarEventos();
}

// 5. Lógica de Procesamiento de Entradas
function procesarNuevaEntrada(datos) {
    let entradasHistorial = JSON.parse(localStorage.getItem('inventario_mirest_historial')) || [];

    if (datos.referenciaId) {
        const indexAnterior = entradasHistorial.findIndex(e => e.id === datos.referenciaId);
        if (indexAnterior !== -1) {
            const cantidadAnterior = entradasHistorial[indexAnterior].cantidad;
            let insumoAjuste = inventarioActual.find(i => 
                i.codigo === entradasHistorial[indexAnterior].codigo || 
                i.nombre.toLowerCase() === entradasHistorial[indexAnterior].ingredienteNombre.toLowerCase()
            );
            if (insumoAjuste) {
                insumoAjuste.stockActual -= cantidadAnterior;
            }
            entradasHistorial[indexAnterior].tipo = 'no-valido';
            entradasHistorial[indexAnterior].corregidoPorId = datos.id;
        }
    }

    let insumo = inventarioActual.find(i => 
        i.codigo === datos.codigo || 
        i.nombre.toLowerCase() === datos.ingredienteNombre.toLowerCase()
    );

    if (insumo) {
        insumo.stockActual += parseFloat(datos.cantidad);
        insumo.ultimoIngreso = datos.fecha;
        insumo.costoUnitario = parseFloat(datos.costoUnitario);
    } else {
        const nuevoInsumo = {
            codigo: datos.codigo || `INS-${Date.now()}`,
            nombre: datos.ingredienteNombre,
            categoria: datos.categoria || "Sin clasificar",
            ubicacion: "Sin asignar",
            stockActual: parseFloat(datos.cantidad),
            unidad: datos.unidad || "und",
            stockMinimo: 1,
            costoUnitario: parseFloat(datos.costoUnitario) || 0,
            ultimoIngreso: datos.fecha
        };
        inventarioActual.push(nuevoInsumo);
    }

    // Guardar en el historial centralizado
    entradasHistorial.unshift(datos);
    localStorage.setItem('inventario_mirest_historial', JSON.stringify(entradasHistorial));

    guardarInventario();
    renderizarInventario();
}

// 6. Lógica de Estado
function recalcularEstados() {
    inventarioActual = inventarioActual.map(item => {
        const stock = item.stockActual;
        const minimo = item.stockMinimo;
        let estado = 'ok';

        if (stock === 0 || stock < minimo) {
            estado = 'critico';
        } else if (stock >= minimo && stock <= (2 * minimo)) {
            estado = 'bajo';
        } else if (stock > (2 * minimo)) {
            estado = 'ok';
        }

        return { ...item, estado };
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
            item.categoria.toLowerCase().includes(term);
        
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

    // Lógica de Paginación
    const totalItems = filtrados.length;
    const numPaginas = Math.ceil(totalItems / itemsPorPagina);
    
    // Validar página actual
    if (paginaActual > numPaginas && numPaginas > 0) paginaActual = numPaginas;
    if (paginaActual < 1) paginaActual = 1;

    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const itemsPaginados = filtrados.slice(inicio, fin);

    // Actualizar controles DOM
    if (labelCurrentPage) labelCurrentPage.textContent = totalItems > 0 ? paginaActual : 0;
    if (labelTotalPages) labelTotalPages.textContent = numPaginas;
    if (btnPrevPage) btnPrevPage.disabled = paginaActual <= 1;
    if (btnNextPage) btnNextPage.disabled = paginaActual >= numPaginas || numPaginas === 0;

    listaInventario.innerHTML = '';
    itemsPaginados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${item.codigo}</code></td>
            <td style="font-weight: 600; color: var(--color-text);">${item.nombre}</td>
            <td><span class="chip chip--soft" style="font-size: 10px;">${item.categoria}</span></td>
            <td>S/ ${item.costoUnitario.toFixed(2)}</td>
            <td><span class="badge-status badge-status--${item.estado}">${item.estado}</span></td>
            <td class="stock-indicator" style="color: ${item.estado === 'critico' ? 'var(--color-red)' : 'inherit'}">
                ${item.stockActual} ${item.unidad}
            </td>
            <td style="color: var(--color-text-muted); font-size: 0.8rem;">${item.stockMinimo} ${item.unidad}</td>
        `;
        listaInventario.appendChild(row);
    });

    totalInsumosLabel.textContent = totalItems;
    stockOkLabel.textContent = filtrados.filter(i => i.estado === 'ok').length;
    const bajos = filtrados.filter(i => i.estado === 'bajo').length;
    stockBajoLabel.textContent = bajos;
    if (stockBajoMetric) stockBajoMetric.textContent = bajos;
    stockCriticoLabel.textContent = filtrados.filter(i => i.estado === 'critico').length;

    if (window.lucide) window.lucide.createIcons();
}

function configurarEventos() {
    buscador.addEventListener('input', () => {
        paginaActual = 1;
        renderizarInventario();
    });
    filtroCategoria.addEventListener('change', () => {
        paginaActual = 1;
        renderizarInventario();
    });
    filtroEstado.addEventListener('change', () => {
        paginaActual = 1;
        renderizarInventario();
    });

    btnPrevPage?.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarInventario();
        }
    });

    btnNextPage?.addEventListener('click', () => {
        const numPaginas = Math.ceil(inventarioActual.length / itemsPorPagina);
        if (paginaActual < numPaginas) {
            paginaActual++;
            renderizarInventario();
        }
    });

    btnNuevoInsumo.addEventListener('click', () => {
        window.location.href = '../2-entrada de insumos mejorado/entrada-de-insumos.html';
    });
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
