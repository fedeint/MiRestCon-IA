/**
 * render.js — Caja
 * Stats, meseros, ranking y tabla de movimientos (2 columnas: Ingreso / Egreso)
 */

export function fmt(n) {
  return 'S/ ' + n.toFixed(2);
}

/* ── Icono profesional de usuario ── */
const iconUser = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="8" r="4"/>
  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
</svg>`;

export function render(transactions, meseros) {
  renderStats(transactions);
  renderMeseros(meseros);
  renderRanking(meseros);
  renderTransactions(transactions);
}

function renderStats(transactions) {
  const totalIn  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  document.getElementById('totalIncome').textContent  = fmt(totalIn);
  document.getElementById('totalExpense').textContent = fmt(totalOut);
  document.getElementById('totalCash').textContent    = fmt(Math.max(0, totalIn - totalOut));
}

function renderMeseros(meseros) {
  document.getElementById('meserosGrid').innerHTML = meseros.map(m => `
    <div class="cj-mesero">
      <div class="cj-mesero__avatar">${iconUser}</div>
      <div class="cj-mesero__name">${m.name}</div>
      <div class="cj-mesero__table">${m.mesa}</div>
      <span class="cj-mesero__tag">${m.products} productos</span>
    </div>
  `).join('');
}

function renderRanking(meseros) {
  const medals = ['🥇', '🥈', '🥉'];
  document.getElementById('rankingList').innerHTML = meseros.map((m, i) => `
    <div class="cj-ranking-item">
      <div class="cj-ranking-item__pos ${i === 0 ? 'cj-ranking-item__pos--gold' : ''}">
        ${medals[i] || i + 1}
      </div>
      <div class="cj-ranking-item__avatar">${iconUser}</div>
      <div class="cj-ranking-item__name">${m.name}</div>
      <div class="cj-ranking-item__stats">
        <div><span>Mesa</span><strong>${m.mesa.replace('Mesa ', '')}</strong></div>
        <div><span>Productos</span><strong>${m.products}</strong></div>
      </div>
    </div>
  `).join('');
}

function renderTransactions(transactions) {
  const tbody = document.getElementById('txBody');
  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="cj-table__empty">No hay movimientos registrados</td></tr>';
    return;
  }
  tbody.innerHTML = [...transactions].reverse().map(t => {
    const time = t.time.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const isIncome = t.type === 'income';
    const concept  = t.concept + (t.note ? ` <span class="cj-tx-note">— ${t.note}</span>` : '');
    return `
      <tr>
        <td class="cj-td-time">${time}</td>
        <td>${concept}</td>
        <td class="cj-tx-income">${isIncome ? fmt(t.amount) : '—'}</td>
        <td class="cj-tx-expense">${!isIncome ? fmt(t.amount) : '—'}</td>
        <td class="cj-tx-balance ${isIncome ? 'cj-tx-income' : 'cj-tx-expense'}">
          ${isIncome ? '+' : '-'}${fmt(t.amount)}
        </td>
      </tr>`;
  }).join('');
}
