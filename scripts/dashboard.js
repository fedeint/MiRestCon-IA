import { MODULES, toHref } from "./navigation.js";

export function initializeDashboard() {
  renderMetrics();
  renderModuleGrid();
  renderSystemHighlights();
  renderInsights();
}

function renderMetrics() {
  const target = document.getElementById("dashboardMetrics");
  if (!target) return;

  const metrics = [
    {
      value: String(MODULES.length),
      label: "Módulos listos",
    },
    {
      value: "1",
      label: "Shell global",
    },
    {
      value: "100%",
      label: "Navegación base",
    },
    {
      value: "0",
      label: "Lógica de negocio",
    },
  ];

  target.innerHTML = metrics
    .map(
      (metric) => `
        <article class="stat-card">
          <strong>${metric.value}</strong>
          <span>${metric.label}</span>
        </article>
      `,
    )
    .join("");
}

function renderModuleGrid() {
  const target = document.getElementById("moduleGrid");
  if (!target) return;

  target.innerHTML = MODULES.map(
    (module) => `
      <a class="module-card" href="${toHref(module.path)}">
        <div class="module-card__header">
          <span class="module-card__token">${module.short}</span>
          <span class="chip chip--soft">Módulo en construcción</span>
        </div>
        <h3>${module.label}</h3>
        <div class="module-card__footer">
          <span class="module-card__cta">Entrar al módulo →</span>
        </div>
      </a>
    `,
  ).join("");
}

function renderSystemHighlights() {
  const target = document.getElementById("systemHighlights");
  if (!target) return;

  const cards = [
    {
      value: `${MODULES.length}/9`,
      label: "Secciones definidas",
    },
    {
      value: "Root",
      label: "Frontend general",
    },
    {
      value: "PR",
      label: "Trabajo colaborativo",
    },
  ];

  target.innerHTML = cards
    .map(
      (card) => `
        <article class="highlight-card">
          <strong>${card.value}</strong>
          <span>${card.label}</span>
        </article>
      `,
    )
    .join("");
}

function renderInsights() {
  const target = document.getElementById("insightsList");
  if (!target) return;

  const insights = [
    "Cada módulo evoluciona en su carpeta.",
    "Reutiliza tokens globales.",
    "Eleva al root solo mejoras compartidas.",
  ];

  target.innerHTML = insights.map((insight) => `<li>${insight}</li>`).join("");
}
