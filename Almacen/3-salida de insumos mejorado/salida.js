// Datos de proveedores (Cargados desde el módulo de proveedores)
let proveedores = JSON.parse(localStorage.getItem('inventario_mirest_proveedores')) || [
    { id: 1, nombre: "Distribuidora El Mercado" },
    { id: 2, nombre: "Carnes Premium SAC" }
];

// Estado de la aplicación
let inventarioActual = JSON.parse(localStorage.getItem('inventario_mirest')) || [];
let salidas = []; // Se cargará desde localStorage (inventario_mirest_salidas)
let archivosAdjuntos = [];
let mediaRecorder;
let audioChunks = [];
let grabacionInterval;
let grabacionSegundos = 0;
let editandoId = null;

// Datos de caja (Simulación de otros módulos)
let cajaAbierta = localStorage.getItem('mirest_caja_abierta') === 'true';
let platosHoy = parseInt(localStorage.getItem('mirest_platos_hoy')) || 0;

// Reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let textoAcumulado = '';

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        if (event.results[event.results.length - 1].isFinal) {
            textoAcumulado += transcript + ' ';
            inputTextoLibre.value = textoAcumulado;
        } else {
            inputTextoLibre.value = textoAcumulado + transcript;
        }
    };
}

// Elementos del DOM
const formSalida = document.getElementById('formSalida');
const selectIngrediente = document.getElementById('ingrediente');
const selectProveedor = document.getElementById('proveedor');
const inputCantidad = document.getElementById('cantidad');
const inputCostoUnitario = document.getElementById('costoUnitario');
const spanCostoTotal = document.getElementById('costoTotal');
const selectMotivo = document.getElementById('motivo');
const inputJustificacion = document.getElementById('justificacion');
const inputComprobante = document.getElementById('comprobante');
const inputCodigo = document.getElementById('codigo');
const inputCategoria = document.getElementById('categoria');
const inputUltimoIngreso = document.getElementById('ultimoIngreso');
const inputHora = document.getElementById('hora');
const inputUsuario = document.getElementById('usuario');
const inputPassword = document.getElementById('password');
const inputTextoLibre = document.getElementById('textoLibre');
const inputArchivosMultimedia = document.getElementById('archivosMultimedia');
const btnGrabarAudio = document.getElementById('btnGrabarAudio');
const statusGrabacion = document.getElementById('statusGrabacion');
const tiempoGrabacionLabel = document.getElementById('tiempoGrabacion');
const listaArchivosAdjuntos = document.getElementById('listaArchivosAdjuntos');
const listaSalidas = document.getElementById('listaSalidas');
const totalSalidasLabel = document.getElementById('totalSalidas');
const montoTotalLabel = document.getElementById('montoTotal');
const fechaActualLabel = document.getElementById('fechaActual');
const cajaStatusLabel = document.getElementById('cajaStatus');
const platosHoyLabel = document.getElementById('platosHoy');
const btnAgregarIngrediente = document.getElementById('btnAgregarIngrediente');
const contenedorIngredientesExtra = document.getElementById('contenedorIngredientesExtra');

// Inicialización
function init() {
    actualizarEstadoLocal();
    mostrarFechaActual();
    establecerHoraActual();
    cargarOpciones();
    cargarSalidas();
    configurarEventos();
    actualizarUIBloqueAutomatico();
}

function actualizarEstadoLocal() {
    inventarioActual = JSON.parse(localStorage.getItem('inventario_mirest')) || [];
    proveedores = JSON.parse(localStorage.getItem('inventario_mirest_proveedores')) || [];
    cajaAbierta = localStorage.getItem('mirest_caja_abierta') === 'true';
    platosHoy = parseInt(localStorage.getItem('mirest_platos_hoy')) || 0;
}

function cargarSalidas() {
    salidas = JSON.parse(localStorage.getItem('inventario_mirest_salidas')) || [];
    renderizarSalidas();
}

function mostrarFechaActual() {
    const hoy = new Date();
    fechaActualLabel.textContent = hoy.toLocaleDateString("es-PE", {
        day: "numeric", month: "long", year: "numeric"
    });
}

function establecerHoraActual() {
    const hoy = new Date();
    inputHora.value = `${hoy.getHours().toString().padStart(2, '0')}:${hoy.getMinutes().toString().padStart(2, '0')}`;
}

function cargarOpciones() {
    selectIngrediente.innerHTML = '<option value="">Seleccione un insumo</option>';
    inventarioActual.sort((a, b) => a.nombre.localeCompare(b.nombre)).forEach(ing => {
        const option = document.createElement('option');
        option.value = ing.codigo;
        option.textContent = `${ing.nombre} (${ing.unidad})`;
        selectIngrediente.appendChild(option);
    });

    selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
    proveedores.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.nombre;
        option.textContent = prov.nombre;
        selectProveedor.appendChild(option);
    });
}

function configurarEventos() {
    selectIngrediente.addEventListener('change', (e) => {
        const ing = inventarioActual.find(i => i.codigo === e.target.value);
        actualizarCamposInsumo(ing, inputCodigo, inputCategoria, inputCostoUnitario);
    });

    inputCantidad.addEventListener('input', calcularTotal);
    btnGrabarAudio.addEventListener('click', toggleGrabacion);
    btnAgregarIngrediente.addEventListener('click', agregarFilaIngredienteExtra);

    inputArchivosMultimedia.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            if (!archivosAdjuntos.find(f => f.name === file.name)) {
                const base64 = await toBase64(file);
                archivosAdjuntos.push({
                    name: file.name,
                    type: file.type,
                    data: base64
                });
            }
        }
        actualizarListaArchivos();
    });

    formSalida.addEventListener('submit', (e) => {
        e.preventDefault();
        validarYRegistrar();
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'inventario_mirest' || e.key === 'inventario_mirest_proveedores') {
            actualizarEstadoLocal();
            cargarOpciones();
        }
        if (e.key === 'inventario_mirest_salidas') cargarSalidas();
        if (e.key === 'mirest_caja_abierta' || e.key === 'mirest_platos_hoy') {
            actualizarEstadoLocal();
            actualizarUIBloqueAutomatico();
        }
    });
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function actualizarCamposInsumo(ing, fieldCodigo, fieldCategoria, fieldCosto) {
    if (ing) {
        fieldCodigo.value = ing.codigo;
        fieldCategoria.value = ing.categoria;
        fieldCosto.value = (ing.costoUnitario || 0).toFixed(2);
    } else {
        fieldCodigo.value = '';
        fieldCategoria.value = '';
        fieldCosto.value = '';
    }
    calcularTotal();
}

function agregarFilaIngredienteExtra() {
    const div = document.createElement('div');
    div.className = 'extra-ingrediente animate-fade-in';
    div.style.marginTop = '1rem';
    
    div.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Insumo adicional</label>
                <select class="extra-select" required>
                    <option value="">Seleccione un insumo</option>
                    ${inventarioActual.map(ing => `<option value="${ing.codigo}">${ing.nombre} (${ing.unidad})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Cantidad</label>
                <input type="number" class="extra-cantidad" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label>Proveedor *</label>
                <select class="extra-proveedor" required>
                    <option value="">Seleccione un proveedor</option>
                    ${proveedores.map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Costo Unitario (S/)</label>
                <input type="number" class="extra-costo" step="0.01" min="0" readonly>
            </div>
            <div class="form-group">
                <label>Código</label>
                <input type="text" class="extra-codigo" readonly>
            </div>
            <div class="form-group">
                <label>Categoría</label>
                <input type="text" class="extra-categoria" readonly>
            </div>
            <div class="form-group">
                <label>Costo Total (S/)</label>
                <input type="number" class="extra-total-ind" step="0.01" readonly>
            </div>
            <div style="display: flex; align-items: flex-end;">
                <button type="button" class="btn btn-destructive btn-sm" onclick="this.parentElement.parentElement.parentElement.remove(); calcularTotal();">❌</button>
            </div>
        </div>
    `;
    
    const select = div.querySelector('.extra-select');
    const inputCosto = div.querySelector('.extra-costo');
    const inputCodigoExtra = div.querySelector('.extra-codigo');
    const inputCantExtra = div.querySelector('.extra-cantidad');
    const inputCatExtra = div.querySelector('.extra-categoria');
    const selectProvExtra = div.querySelector('.extra-proveedor');
    const inputTotalExtra = div.querySelector('.extra-total-ind');
    
    select.addEventListener('change', (e) => {
        const ing = inventarioActual.find(i => i.codigo === e.target.value);
        if (ing) {
            inputCosto.value = (ing.costoUnitario || 0).toFixed(2);
            inputCodigoExtra.value = ing.codigo;
            inputCatExtra.value = ing.categoria || '-';
            selectProvExtra.value = ing.proveedor || '';
        } else {
            inputCosto.value = '';
            inputCodigoExtra.value = '';
            inputCatExtra.value = '';
            selectProvExtra.value = '';
        }
        calcularTotal();
    });
    
    const actualizarFilaTotal = () => {
        const cant = parseFloat(inputCantExtra.value) || 0;
        const unit = parseFloat(inputCosto.value) || 0;
        inputTotalExtra.value = (cant * unit).toFixed(2);
        calcularTotal();
    };

    inputCantExtra.addEventListener('input', actualizarFilaTotal);
    
    contenedorIngredientesExtra.appendChild(div);
}

function calcularTotal() {
    let total = 0;
    
    // Principal
    const cantPrincipal = parseFloat(inputCantidad.value) || 0;
    const unitPrincipal = parseFloat(inputCostoUnitario.value) || 0;
    const totalPrincipal = cantPrincipal * unitPrincipal;
    
    // Actualizar campo costo total individual del principal si existiera en el DOM
    const inputTotalPrincipal = document.getElementById('costoTotalIndividualPrincipal');
    if (inputTotalPrincipal) {
        inputTotalPrincipal.value = totalPrincipal.toFixed(2);
    }
    
    total += totalPrincipal;

    // Extras
    document.querySelectorAll('.extra-ingrediente').forEach(fila => {
        const cant = parseFloat(fila.querySelector('.extra-cantidad').value) || 0;
        const unit = parseFloat(fila.querySelector('.extra-costo').value) || 0;
        const filaTotal = cant * unit;
        fila.querySelector('.extra-total-ind').value = filaTotal.toFixed(2);
        total += filaTotal;
    });
    spanCostoTotal.textContent = total.toFixed(2);
}

function validarYRegistrar() {
    if (inputPassword.value !== 'admin123') {
        alert('Contraseña incorrecta.');
        return;
    }

    const codigoPrincipal = selectIngrediente.value;
    const cantPrincipal = parseFloat(inputCantidad.value);
    const motivo = selectMotivo.value;
    const justificacion = inputJustificacion.value.trim();
    const proveedor = selectProveedor.value;

    if (!codigoPrincipal) { alert('Debe seleccionar un insumo'); return; }
    if (!motivo) { alert('Debe seleccionar un motivo'); return; }
    if (!justificacion) { alert('La justificación debe tener contenido'); return; }
    if (isNaN(cantPrincipal) || cantPrincipal <= 0) { alert('La cantidad debe ser mayor a cero'); return; }
    if (!proveedor) { alert('Debe seleccionar un proveedor'); return; }

    // El comprobante es opcional en salida (Regla 6), no se valida aquí.

    // Verificar stock principal
    const ingPrincipal = inventarioActual.find(i => i.codigo === codigoPrincipal);
    if (cantPrincipal > ingPrincipal.stockActual) { alert(`Stock insuficiente para ${ingPrincipal.nombre}`); return; }

    // Verificar stock extras
    let stockError = false;
    document.querySelectorAll('.extra-ingrediente').forEach(fila => {
        const cod = fila.querySelector('.extra-select').value;
        const cant = parseFloat(fila.querySelector('.extra-cantidad').value) || 0;
        const ing = inventarioActual.find(i => i.codigo === cod);
        if (ing && cant > ing.stockActual) {
            alert(`Stock insuficiente para ${ing.nombre}`);
            stockError = true;
        }
    });
    if (stockError) return;

    registrarSalida();
}

function registrarSalida() {
    const nuevoId = generarSiguienteID();
    let historialSalidas = JSON.parse(localStorage.getItem('inventario_mirest_salidas')) || [];
    
    // Restaurar stock si es una corrección
    if (editandoId) {
        const registroAnterior = historialSalidas.find(s => s.id === editandoId);
        if (registroAnterior) {
            registroAnterior.ingredientes.forEach(ingPrev => {
                const itemInv = inventarioActual.find(i => i.codigo === ingPrev.codigo);
                if (itemInv) itemInv.stockActual += ingPrev.cantidad;
            });
            registroAnterior.tipo = 'no-valido';
            registroAnterior.corregidoPorId = nuevoId;
        }
    }

    const listaIngredientes = [];
    // Principal
    const ingPrincipal = inventarioActual.find(i => i.codigo === selectIngrediente.value);
    const cantPrincipal = parseFloat(inputCantidad.value);
    const unitPrincipal = parseFloat(inputCostoUnitario.value);

    listaIngredientes.push({
        codigo: ingPrincipal.codigo,
        nombre: ingPrincipal.nombre,
        categoria: ingPrincipal.categoria,
        costoUnitario: unitPrincipal,
        estado: ingPrincipal.estado || "ok",
        costoTotal: cantPrincipal * unitPrincipal,
        cantidad: cantPrincipal,
        proveedor: selectProveedor.value
    });

    // Extras
    document.querySelectorAll('.extra-ingrediente').forEach(fila => {
        const cod = fila.querySelector('.extra-select').value;
        const ing = inventarioActual.find(i => i.codigo === cod);
        const cant = parseFloat(fila.querySelector('.extra-cantidad').value);
        const unit = parseFloat(fila.querySelector('.extra-costo').value);
        const prov = fila.querySelector('.extra-proveedor').value;
        if (ing && cant > 0) {
            listaIngredientes.push({
                codigo: ing.codigo,
                nombre: ing.nombre,
                categoria: ing.categoria,
                costoUnitario: unit,
                estado: ing.estado || "ok",
                costoTotal: cant * unit,
                cantidad: cant,
                proveedor: prov
            });
        }
    });

    // Procesar adjuntos con nombres únicos (Requerimiento 2.2 unificado)
    const adjuntosProcesados = archivosAdjuntos.map((file, index) => {
        const extension = file.name.split('.').pop();
        const nuevoNombre = `${nuevoId}_${index + 1}.${extension}`;
        return {
            name: nuevoNombre,
            type: file.type,
            data: file.data // Ya es Base64
        };
    });

    const nuevaSalida = {
        id: nuevoId,
        hora: inputHora.value,
        motivo: selectMotivo.value,
        justificacion: inputJustificacion.value.trim(),
        comprobante: inputComprobante.value || "-",
        usuario: inputUsuario.value,
        fecha: new Date().toLocaleDateString("es-PE"),
        tipo: editandoId ? 'corregido' : 'original',
        referenciaId: editandoId || null,
        ingredientes: listaIngredientes,
        costoTotalMovimiento: parseFloat(spanCostoTotal.textContent),
        notas: inputTextoLibre.value.trim(),
        archivos: adjuntosProcesados,
        movimiento: 'SALIDA',
        detalle: listaIngredientes.map(i => ({
            nombre: i.nombre,
            codigo: i.codigo,
            cantidad: i.cantidad,
            costoUnitario: i.costoUnitario,
            costoTotal: i.costoTotal
        }))
    };

    // Descontar Stock
    listaIngredientes.forEach(item => {
        const invItem = inventarioActual.find(i => i.codigo === item.codigo);
        if (invItem) invItem.stockActual -= item.cantidad;
    });

    // Guardar
    localStorage.setItem('inventario_mirest', JSON.stringify(inventarioActual));
    historialSalidas.unshift(nuevaSalida);
    localStorage.setItem('inventario_mirest_salidas', JSON.stringify(historialSalidas));

    window.dispatchEvent(new Event('storage'));
    
    limpiarFormulario();
    cargarSalidas();
    alert('Salida registrada con éxito.');
}

function generarSiguienteID() {
    const prefijo = 'SAL';
    const registros = JSON.parse(localStorage.getItem('inventario_mirest_salidas')) || [];
    const ids = registros.map(r => r.id).filter(id => id && id.startsWith(prefijo));
    if (ids.length === 0) return `${prefijo}00001`;
    const numeros = ids.map(id => parseInt(id.replace(prefijo, '')) || 0);
    const siguiente = Math.max(...numeros) + 1;
    return `${prefijo}${siguiente.toString().padStart(5, '0')}`;
}

function limpiarFormulario() {
    formSalida.reset();
    inputTextoLibre.value = '';
    archivosAdjuntos = [];
    actualizarListaArchivos();
    establecerHoraActual();
    inputCodigo.value = '';
    inputCategoria.value = '';
    inputUltimoIngreso.value = '';
    inputCostoUnitario.value = '';
    spanCostoTotal.textContent = '0.00';
    editandoId = null;
    contenedorIngredientesExtra.innerHTML = '';
    document.querySelector('.card-title').textContent = '🛠️ Salida manual';
}

function renderizarSalidas() {
    listaSalidas.innerHTML = '';
    let inversionTotal = 0;

    salidas.forEach(salida => {
        if (salida.tipo !== 'no-valido') inversionTotal += (salida.costoTotalMovimiento || 0);

        const row = document.createElement('tr');
        if (salida.tipo === 'no-valido') row.classList.add('row-no-valido');
        
        const badgeClass = `badge-${salida.tipo}`;
        const refInfo = salida.referenciaId ? `<br><small>Ref: ${salida.referenciaId}</small>` : '';
        const corrInfo = salida.corregidoPorId ? `<br><small>Corr: ${salida.corregidoPorId}</small>` : '';

        // Detalle de insumos
        let ingredientesHTML = '';
        let cantidadesHTML = '';
        let costosUnitHTML = '';
        let costosTotalHTML = '';
        let codigosHTML = '';
        let categoriasHTML = '';
        let estadosHTML = '';
        let proveedoresHTML = '';

        const items = salida.ingredientes || [];
        items.forEach(ing => {
            codigosHTML += `<div>${ing.codigo}</div>`;
            ingredientesHTML += `<div style="font-weight:600;">${ing.nombre}</div>`;
            categoriasHTML += `<div>${ing.categoria}</div>`;
            costosUnitHTML += `<div>${parseFloat(ing.costoUnitario || 0).toFixed(2)}</div>`;
            estadosHTML += `<div><span class="badge-estado badge-${ing.estado || 'ok'}">${ing.estado || 'ok'}</span></div>`;
            costosTotalHTML += `<div style="font-weight:700;">${parseFloat(ing.costoTotal || 0).toFixed(2)}</div>`;
            cantidadesHTML += `<div>${ing.cantidad}</div>`;
            proveedoresHTML += `<div>${ing.proveedor || "-"}</div>`;
        });

        // Multimedia y Notas (Requerimiento 2.2 unificado: Descarga obligatoria)
        let adjuntosHTML = '';
        if (salida.archivos && salida.archivos.length > 0) {
            adjuntosHTML += '<div class="adjuntos-container" style="display:flex; flex-wrap:wrap; gap:8px;">';
            salida.archivos.forEach(file => {
                adjuntosHTML += `<a href="${file.data}" download="${file.name}" title="Descargar ${file.name}" style="font-size:0.7rem; color:var(--primary); text-decoration:underline; display: flex; align-items: center; gap: 4px; background: var(--secondary); padding: 4px 8px; border-radius: 4px;">💾 ${file.name}</a>`;
            });
            adjuntosHTML += '</div>';
        }
        
        if (salida.notas) adjuntosHTML += `<div style="font-size: 0.7rem; color: var(--muted-foreground); font-style: italic; margin-top:4px;">" ${salida.notas} "</div>`;
        if (salida.justificacion) adjuntosHTML += `<div style="font-size: 0.7rem; color: var(--primary); font-weight: 500; margin-top:4px;">Just: ${salida.justificacion}</div>`;

        row.innerHTML = `
            <td>${salida.id}${refInfo}${corrInfo}</td>
            <td><span class="badge-tipo ${badgeClass}">${salida.tipo}</span></td>
            <td>${codigosHTML}</td>
            <td>${ingredientesHTML}</td>
            <td>${categoriasHTML}</td>
            <td>${costosUnitHTML}</td>
            <td>${estadosHTML}</td>
            <td>${costosTotalHTML}</td>
            <td>${proveedoresHTML}</td>
            <td>${salida.hora}</td>
            <td><span class="badge badge-warning">${salida.motivo}</span></td>
            <td>${cantidadesHTML}</td>
            <td>${salida.comprobante}</td>
            <td>${salida.usuario}</td>
            <td>${adjuntosHTML || '-'}</td>
            <td>
                ${salida.tipo !== 'no-valido' ? `<button class="btn btn-modificar btn-sm" onclick="prepararModificacion('${salida.id}')">Modificar</button>` : ''}
            </td>
        `;
        listaSalidas.appendChild(row);
    });

    totalSalidasLabel.textContent = salidas.filter(s => s.tipo !== 'no-valido').length;
    montoTotalLabel.textContent = `S/ ${inversionTotal.toFixed(2)}`;
}

window.prepararModificacion = function(id) {
    const salida = salidas.find(s => s.id === id);
    if (!salida) return;
    editandoId = id;
    document.querySelector('.card-title').textContent = `Modificando Salida (Ref: ${id})`;

    const items = salida.ingredientes || [];
    const principal = items[0];

    // Datos del Registro
    inputHora.value = salida.hora;
    selectMotivo.value = salida.motivo;
    inputJustificacion.value = salida.justificacion;
    selectProveedor.value = salida.proveedorNombre;
    inputComprobante.value = salida.comprobante !== '-' ? salida.comprobante : '';
    inputUsuario.value = salida.usuario;
    inputTextoLibre.value = salida.notas || '';

    // Insumo Principal
    selectIngrediente.value = principal.codigo;
    inputCantidad.value = principal.cantidad;
    inputCodigo.value = principal.codigo;
    inputCategoria.value = principal.categoria;
    inputCostoUnitario.value = principal.costoUnitario.toFixed(2);

    // Insumos Extras
    contenedorIngredientesExtra.innerHTML = '';
    for (let i = 1; i < items.length; i++) {
        agregarFilaIngredienteExtra();
        const filas = document.querySelectorAll('.extra-ingrediente');
        const ultima = filas[filas.length - 1];
        const ing = items[i];
        ultima.querySelector('.extra-select').value = ing.codigo;
        ultima.querySelector('.extra-cantidad').value = ing.cantidad;
        ultima.querySelector('.extra-costo').value = ing.costoUnitario.toFixed(2);
        ultima.querySelector('.extra-codigo').value = ing.codigo;
        ultima.querySelector('.extra-categoria').value = ing.categoria || '-';
    }
    calcularTotal();
    document.getElementById('formSalida').scrollIntoView({ behavior: 'smooth' });
};

function actualizarUIBloqueAutomatico() {
    cajaStatusLabel.textContent = cajaAbierta ? 'Abierta' : 'Cerrada';
    cajaStatusLabel.className = `info-value ${cajaAbierta ? 'text-ok' : 'text-critico'}`;
    platosHoyLabel.textContent = platosHoy;
}

// Lógica de Audio
async function toggleGrabacion() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            textoAcumulado = inputTextoLibre.value ? inputTextoLibre.value.trim() + ' ' : '';
            mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], `grabacion_${Date.now()}.wav`, { type: 'audio/wav' });
                
                // Convertir a Base64 para persistencia real (Requerimiento 3.1)
                const base64 = await toBase64(audioFile);
                archivosAdjuntos.push({
                    name: audioFile.name,
                    type: audioFile.type,
                    data: base64
                });

                actualizarListaArchivos();
                clearInterval(grabacionInterval);
                statusGrabacion.style.display = 'none';
                document.getElementById('textoGrabar').textContent = 'Grabar Audio';
                btnGrabarAudio.classList.replace('btn-destructive', 'btn-secondary');
                if (recognition) recognition.stop();
            };
            mediaRecorder.start();
            if (recognition) recognition.start();
            grabacionSegundos = 0;
            statusGrabacion.style.display = 'flex';
            document.getElementById('textoGrabar').textContent = 'Detener Grabación';
            btnGrabarAudio.classList.replace('btn-secondary', 'btn-destructive');
            grabacionInterval = setInterval(() => {
                grabacionSegundos++;
                const mins = Math.floor(grabacionSegundos / 60).toString().padStart(2, '0');
                const secs = (grabacionSegundos % 60).toString().padStart(2, '0');
                tiempoGrabacionLabel.textContent = `${mins}:${secs}`;
            }, 1000);
        } catch (err) { alert('Error al acceder al micrófono.'); }
    } else { mediaRecorder.stop(); mediaRecorder.stream.getTracks().forEach(track => track.stop()); }
}

function actualizarListaArchivos() {
    listaArchivosAdjuntos.innerHTML = '';
    archivosAdjuntos.forEach((file, index) => {
        const tag = document.createElement('div');
        tag.className = 'archivo-tag';
        tag.innerHTML = `<span>${file.name}</span><span class="remove" onclick="removerArchivo(${index})">×</span>`;
        listaArchivosAdjuntos.appendChild(tag);
    });
}

window.removerArchivo = function(index) {
    archivosAdjuntos.splice(index, 1);
    actualizarListaArchivos();
};

init();
