// Estado de la aplicación
let inventario = [];
let productosFiltrados = [];
let filtroActual = 'todos';
let busquedaActual = '';

// Elementos del DOM
const listaQueComprar = document.getElementById('listaQueComprar');
const mensajeVacio = document.getElementById('mensajeVacio');
const totalPorComprar = document.getElementById('totalPorComprar');
const totalCriticos = document.getElementById('totalCriticos');
const totalBajos = document.getElementById('totalBajos');
const busquedaInput = document.getElementById('busquedaInsumo');
const filterBtns = document.querySelectorAll('.filter-btn');

// Inicialización
function init() {
    cargarDatos();
    configurarEventos();
}

function cargarDatos() {
    // Requerimiento 5.2: Usar SOLO datos de inventario
    const datosInventario = JSON.parse(localStorage.getItem('inventario_mirest')) || [];
    inventario = datosInventario.map(item => {
        const estado = getEstado(item);
        return {
            ...item,
            estadoRepo: estado,
            sugerido: Math.max(0, (item.stockMinimo * 2) - item.stockActual), // Lógica simple de sugerencia
            costoEstimado: Math.max(0, (item.stockMinimo * 2) - item.stockActual) * (item.costoUnitario || 0)
        };
    }).filter(item => item.estadoRepo !== 'ok'); // Solo los que necesitan comprar

    actualizarContadores();
    filtrarYRenderizar();
}

function getEstado(item) {
    const stock = item.stockActual || 0;
    const minimo = item.stockMinimo || 0;
    if (stock === 0) return 'critico';
    if (stock <= minimo * 0.5) return 'critico';
    if (stock <= minimo) return 'bajo';
    return 'ok';
}

function actualizarContadores() {
    totalPorComprar.textContent = inventario.length;
    totalCriticos.textContent = inventario.filter(i => i.estadoRepo === 'critico').length;
    totalBajos.textContent = inventario.filter(i => i.estadoRepo === 'bajo').length;
}

function filtrarYRenderizar() {
    productosFiltrados = inventario.filter(item => {
        // Filtro por estado
        if (filtroActual !== 'todos' && item.estadoRepo !== filtroActual) return false;
        
        // Filtro por búsqueda
        if (busquedaActual && !item.nombre.toLowerCase().includes(busquedaActual.toLowerCase())) return false;
        
        return true;
    });

    // Ordenar por urgencia (críticos primero)
    productosFiltrados.sort((a, b) => {
        if (a.estadoRepo === 'critico' && b.estadoRepo !== 'critico') return -1;
        if (a.estadoRepo !== 'critico' && b.estadoRepo === 'critico') return 1;
        return 0;
    });

    renderizarTabla();
}

function renderizarTabla() {
    listaQueComprar.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        mensajeVacio.style.display = 'block';
        document.getElementById('tablaQueComprar').style.display = 'none';
        return;
    }

    mensajeVacio.style.display = 'none';
    document.getElementById('tablaQueComprar').style.display = 'table';

    productosFiltrados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600;">${item.nombre}</td>
            <td style="font-size: 0.75rem; color: var(--muted-foreground);">${item.categoria}</td>
            <td style="font-weight: 700;">${item.stockActual} ${item.unidad}</td>
            <td>${item.stockMinimo} ${item.unidad}</td>
            <td style="color: var(--primary); font-weight: 700;">+${item.sugerido.toFixed(1)} ${item.unidad}</td>
            <td style="font-weight: 600;">S/ ${item.costoEstimado.toFixed(2)}</td>
            <td style="font-size: 0.75rem;">${item.proveedor || '-'}</td>
            <td style="font-size: 0.75rem; color: var(--muted-foreground);">${item.ubicacion || '-'}</td>
            <td style="font-size: 0.75rem;">${item.ultimoIngreso || '-'}</td>
            <td><span class="badge badge-${item.estadoRepo}">${item.estadoRepo}</span></td>
            <td>
                <button class="btn-contactar" onclick="contactarProveedor('${item.proveedor}')">💬 Contactar</button>
            </td>
        `;
        listaQueComprar.appendChild(row);
    });
}

function configurarEventos() {
    busquedaInput.addEventListener('input', (e) => {
        busquedaActual = e.target.value;
        filtrarYRenderizar();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroActual = btn.dataset.filter;
            filtrarYRenderizar();
        });
    });

    // Escuchar cambios en inventario desde otras pestañas
    window.addEventListener('storage', (e) => {
        if (e.key === 'inventario_mirest') {
            cargarDatos();
        }
    });
}

function contactarProveedor(proveedor) {
    // Redirigir al módulo de clientes (Bruce) pasando el nombre del proveedor
    window.location.href = '../../Clientes-Bruce/clientes.html?nombre=' + encodeURIComponent(proveedor);
}

init();