/**
 * MÓDULO PROVEEDORES - MiRest
 * Gestión de proveedores con clasificación automática por distancia y crédito.
 */

// --- CONFIGURACIÓN Y ESTADO ---
const PUNTO_BASE = { lat: -9.0743, lng: -78.5937 }; // Plaza de Armas de Chimbote
let proveedores = [];
let proveedoresFiltrados = [];
let editandoId = null;
let categoriasSistema = [];
let ubicacionTemporal = null; // Para almacenar lat/lng de Google Maps

// --- ELEMENTOS DEL DOM ---
const listaProveedores = document.getElementById('listaProveedores');
const formProveedor = document.getElementById('formProveedor');
const modalProveedor = document.getElementById('modalProveedor');
const modalTitulo = document.getElementById('modalTitulo');
const busquedaInput = document.getElementById('busquedaProveedor');
const filtroCategoria = document.getElementById('filtroTipo');
const countFiltrados = document.getElementById('countFiltrados');
const countTotal = document.getElementById('countTotal');
const mensajeVacio = document.getElementById('mensajeVacio');
const inputDireccion = document.getElementById('direccion');
const inputLatitud = document.getElementById('latitud');
const inputLongitud = document.getElementById('longitud');

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasDesdeInventario();
    cargarDatos();
    configurarEventos();
    renderizarTabla();
    actualizarFiltrosDinamicos();
});

function cargarCategoriasDesdeInventario() {
    const inventario = JSON.parse(localStorage.getItem('inventario_mirest')) || [];
    categoriasSistema = [...new Set(inventario.map(i => i.categoria))].sort();
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem('inventario_mirest_proveedores');
    if (datosGuardados) {
        proveedores = JSON.parse(datosGuardados);
    } else {
        proveedores = [
            { id: 1, nombre: "Distribuidora El Mercado", ruc: "20123456789", telefono: "987654321", categoria: ["Abarrotes"], ubicacion: { direccion: "Mercado Central, Chimbote", lat: -9.07, lng: -78.59 }, diasCredito: 7, ultimoIngreso: "28/03/2026", estado: "Activo", distanciaKm: 0.5 },
            { id: 2, nombre: "Carnes Premium SAC", ruc: "20456789123", telefono: "912345678", categoria: ["Carnes"], ubicacion: { direccion: "Av. Pardo 1234, Chimbote", lat: -9.08, lng: -78.58 }, diasCredito: 15, ultimoIngreso: "02/04/2026", estado: "Activo", distanciaKm: 2.1 },
        ];
        guardarDatos();
    }
    proveedoresFiltrados = [...proveedores];
}

function guardarDatos() {
    localStorage.setItem('inventario_mirest_proveedores', JSON.stringify(proveedores));
    window.dispatchEvent(new Event('storage'));
}

// --- LÓGICA DE CLASIFICACIÓN ---
function calcularClasificacion(distanciaKm, diasCredito) {
    if (distanciaKm === null || distanciaKm === undefined) return 0;
    let scoreDistancia = 5 * (1 - (distanciaKm / 10)); // Normalizado a 10km
    scoreDistancia = Math.max(0, Math.min(5, scoreDistancia));
    let scoreCredito = Math.min((diasCredito / 30) * 5, 5); // Normalizado a 30 días
    const scoreTotal = scoreDistancia + scoreCredito;
    
    if (scoreTotal <= 2) return 1;
    if (scoreTotal <= 4) return 2;
    if (scoreTotal <= 6) return 3;
    if (scoreTotal <= 8) return 4;
    return 5;
}

// --- RENDERIZADO ---
function renderizarTabla() {
    listaProveedores.innerHTML = '';
    
    if (proveedoresFiltrados.length === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
        proveedoresFiltrados.forEach(p => {
            const estrellas = calcularClasificacion(p.distanciaKm, p.diasCredito);
            const row = document.createElement('tr');
            if (p.estado === 'Inactivo') row.style.opacity = '0.6';

            const categoriasStr = Array.isArray(p.categoria) ? p.categoria.join(', ') : (p.categoria || '-');
            const direccionStr = typeof p.ubicacion === 'object' ? p.ubicacion.direccion : p.ubicacion;

            row.innerHTML = `
                <td>${p.id}</td>
                <td style="font-weight: 600;">${p.nombre}</td>
                <td style="font-family: monospace; font-size: 0.8rem;">${p.ruc}</td>
                <td><a href="tel:${p.telefono}" style="text-decoration:none; color:inherit;">📞 ${p.telefono}</a></td>
                <td style="font-size: 0.75rem; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${categoriasStr}">${categoriasStr}</td>
                <td style="font-size: 0.75rem; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${direccionStr}">${direccionStr}</td>
                <td style="font-weight: 500;">${p.diasCredito} días</td>
                <td style="font-size: 0.8rem;">${p.ultimoIngreso || '---'}</td>
                <td><span class="badge badge-${p.estado.toLowerCase()}">${p.estado}</span></td>
                <td>
                    <div class="stars">
                        ${'⭐'.repeat(estrellas)}
                    </div>
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="prepararEdicion(${p.id})" title="Editar">✏️</button>
                        <button class="btn-icon" onclick="cambiarEstado(${p.id})" title="${p.estado === 'Activo' ? 'Desactivar' : 'Activar'}">
                            ${p.estado === 'Activo' ? '🚫' : '✅'}
                        </button>
                    </div>
                </td>
            `;
            listaProveedores.appendChild(row);
        });
    }

    countFiltrados.textContent = proveedoresFiltrados.length;
    countTotal.textContent = proveedores.length;
}

function actualizarFiltrosDinamicos() {
    const categoriasExistentes = ['Todos', ...new Set(proveedores.flatMap(p => Array.isArray(p.categoria) ? p.categoria : [p.categoria]))].sort();
    const valorActual = filtroCategoria.value;
    filtroCategoria.innerHTML = '';
    categoriasExistentes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c === 'Todos' ? 'Todas las categorías' : c;
        filtroCategoria.appendChild(opt);
    });
    if (categoriasExistentes.includes(valorActual)) filtroCategoria.value = valorActual;
}

// --- EVENTOS Y CRUD ---
function configurarEventos() {
    document.getElementById('btnAbrirModal').onclick = () => {
        editandoId = null;
        modalTitulo.textContent = 'Nuevo Proveedor';
        formProveedor.reset();
        document.getElementById('proveedorId').value = '';
        renderizarSelectorCategorias();
        
        // Reset mapa iframe a ubicación por defecto
        document.getElementById("mapFrame").src = "https://www.google.com/maps?q=Plaza+de+Armas+Lima&output=embed";
        
        modalProveedor.classList.add('active');
    };

    document.getElementById('btnCerrarModal').onclick = cerrarModal;
    document.getElementById('btnCancelar').onclick = cerrarModal;

    formProveedor.onsubmit = async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('proveedorId').value;
        const nombre = document.getElementById('nombre').value;
        const direccion = inputDireccion.value;

        // VALIDACIÓN
        if (!direccion.trim()) {
            alert('Debe ingresar una dirección.');
            return;
        }

        const categoriasSeleccionadas = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
        if (categoriasSeleccionadas.length === 0) {
            alert('Debe seleccionar al menos una categoría.');
            return;
        }

        const nuevoProv = {
            id: id ? parseInt(id) : Date.now(),
            nombre: nombre,
            ruc: document.getElementById('ruc').value,
            telefono: document.getElementById('telefono').value,
            categoria: categoriasSeleccionadas,
            ubicacion: direccion, // Guardar solo el texto de la dirección
            diasCredito: parseInt(document.getElementById('diasCredito').value),
            distanciaKm: 0, 
            estado: 'Activo',
            ultimoIngreso: id ? proveedores.find(p => p.id == id).ultimoIngreso : new Date().toLocaleDateString("es-PE")
        };

        if (id) {
            const index = proveedores.findIndex(p => p.id == id);
            proveedores[index] = nuevoProv;
        } else {
            proveedores.push(nuevoProv);
        }

        guardarDatos();
        cerrarModal();
        filtrarProveedores();
        actualizarFiltrosDinamicos();
        alert('Proveedor guardado con éxito');
    };

    busquedaInput.oninput = filtrarProveedores;
    filtroCategoria.onchange = filtrarProveedores;
}

function renderizarSelectorCategorias(seleccionadas = []) {
    const contenedor = document.getElementById('categoriaSelectorContainer');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    categoriasSistema.forEach(cat => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '0.5rem';
        div.style.fontSize = '0.85rem';
        
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'cat-checkbox';
        cb.value = cat;
        cb.checked = seleccionadas.includes(cat);
        
        const label = document.createElement('label');
        label.textContent = cat;
        
        div.appendChild(cb);
        div.appendChild(label);
        contenedor.appendChild(div);
    });
}

function cerrarModal() {
    modalProveedor.classList.remove('active');
}

function filtrarProveedores() {
    const busqueda = busquedaInput.value.toLowerCase();
    const categoriaFiltro = filtroCategoria.value;

    proveedoresFiltrados = proveedores.filter(p => {
        const matchNombre = p.nombre.toLowerCase().includes(busqueda) || p.ruc.includes(busqueda);
        const cats = Array.isArray(p.categoria) ? p.categoria : [p.categoria];
        const matchCategoria = categoriaFiltro === 'Todos' || cats.includes(categoriaFiltro);
        return matchNombre && matchCategoria;
    });

    renderizarTabla();
}

window.prepararEdicion = (id) => {
    const p = proveedores.find(prov => prov.id == id);
    if (!p) return;

    editandoId = id;
    modalTitulo.textContent = 'Editar Proveedor';
    document.getElementById('proveedorId').value = p.id;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('ruc').value = p.ruc;
    document.getElementById('telefono').value = p.telefono;
    document.getElementById('diasCredito').value = p.diasCredito;

    const direccion = typeof p.ubicacion === 'object' ? p.ubicacion.direccion : p.ubicacion;
    
    inputDireccion.value = direccion;

    // Actualizar mapa iframe
    if (direccion) {
        const url = "https://www.google.com/maps?q=" + encodeURIComponent(direccion) + "&output=embed";
        document.getElementById("mapFrame").src = url;
    }

    const seleccionadas = Array.isArray(p.categoria) ? p.categoria : [p.categoria];
    renderizarSelectorCategorias(seleccionadas);

    modalProveedor.classList.add('active');
};

window.cambiarEstado = (id) => {
    const index = proveedores.findIndex(p => p.id == id);
    if (index !== -1) {
        proveedores[index].estado = proveedores[index].estado === 'Activo' ? 'Inactivo' : 'Activo';
        guardarDatos();
        filtrarProveedores();
    }
};
