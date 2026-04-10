/**
 * caja.js — Módulo Caja
 * Estado, apertura/cierre con bienvenida, modales y transacciones
 */

import { render } from './render.js';

/* ── Estado ── */
let cajaOpen = false;
let openedAt = null;
let transactions = [];

const meseros = [
  { name: 'Carlos', mesa: 'Mesa 1', products: 0 },
  { name: 'Maria',  mesa: 'Mesa 2', products: 0 },
  { name: 'Pedro',  mesa: 'Mesa 3', products: 0 },
];

/* ── Referencias DOM ── */
const closedScreen  = document.getElementById('cajaClosedScreen');
const openContent   = document.getElementById('cajaOpenContent');
const btnToggle     = document.getElementById('btnToggleCaja');   // botón en pantalla cerrada
const btnClose      = document.getElementById('btnCloseCaja');    // botón en pantalla abierta
const btnIncome     = document.getElementById('btnIncome');
const btnExpense    = document.getElementById('btnExpense');
const cajaBadge     = document.getElementById('cajaBadge');
const cajaTimeEl    = document.getElementById('cajaTime');
const welcomeToast  = document.getElementById('welcomeToast');

/* ── Toast de bienvenida ── */
function showWelcomeToast() {
  welcomeToast.classList.add('show');
  setTimeout(() => welcomeToast.classList.remove('show'), 4000);
}

/* ── Abrir Caja ── */
btnToggle.addEventListener('click', () => {
  cajaOpen = true;
  openedAt = new Date();

  // Actualizar badge
  cajaBadge.textContent = 'Abierta';
  cajaBadge.className   = 'cj-badge cj-badge--green';

  // Mostrar contenido y ocultar pantalla cerrada
  closedScreen.style.display = 'none';
  openContent.style.display  = 'block';

  // Toast de bienvenida
  showWelcomeToast();

  render(transactions, meseros);
});

/* ── Cerrar Caja ── */
btnClose.addEventListener('click', () => {
  if (!confirm('¿Confirmas el cierre de caja para este turno?')) return;

  cajaOpen = false;
  openedAt = null;

  cajaBadge.textContent = 'Cerrada';
  cajaBadge.className   = 'cj-badge cj-badge--red';
  cajaTimeEl.textContent = '';

  openContent.style.display  = 'none';
  closedScreen.style.display = 'flex';
});

/* ── Chip de tiempo en vivo ── */
setInterval(() => {
  if (cajaOpen && openedAt) {
    cajaTimeEl.textContent =
      'Abierta: ' + openedAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}, 1000);

/* ── Modales ── */
window.closeAllModals = function () {
  document.querySelectorAll('.cj-modal-overlay').forEach(m => m.classList.remove('open'));
};

btnIncome.addEventListener('click',  () => document.getElementById('incomeModal').classList.add('open'));
btnExpense.addEventListener('click', () => document.getElementById('expenseModal').classList.add('open'));

document.querySelectorAll('.cj-modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

/* ── Registrar Ingreso ── */
document.getElementById('submitIncome').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('incAmount').value);
  if (!amount || amount <= 0) { alert('Ingresa un monto válido'); return; }

  transactions.push({
    type:    'income',
    amount,
    concept: document.getElementById('incConcept').value || 'Ingreso',
    note:    document.getElementById('incNote').value,
    time:    new Date(),
  });

  document.getElementById('incAmount').value = '';
  document.getElementById('incNote').value   = '';
  closeAllModals();
  render(transactions, meseros);
});

/* ── Registrar Egreso ── */
document.getElementById('submitExpense').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('expAmount').value);
  if (!amount || amount <= 0) { alert('Ingresa un monto válido'); return; }

  transactions.push({
    type:    'expense',
    amount,
    concept: document.getElementById('expConcept').value || 'Egreso',
    note:    document.getElementById('expNote').value,
    time:    new Date(),
  });

  document.getElementById('expAmount').value = '';
  document.getElementById('expNote').value   = '';
  closeAllModals();
  render(transactions, meseros);
});
