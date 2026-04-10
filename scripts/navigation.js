export const APP_META = {
  name: "MiRest con IA",
  envLabel: "estructura colaborativa del frontend",
};

export const MODULES = [
  {
    key: "almacen",
    label: "Almacen",
    short: "AL",
    path: "Almacen/index.html",
    description: "Control base de stock, insumos y movimientos internos.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de Almacen.",
    handoff: [
      "Diseñar el layout interno del módulo dentro de la carpeta Almacen.",
      "Consumir tokens globales antes de crear estilos adicionales.",
      "Mantener el regreso al dashboard y respetar el shell visual compartido.",
    ],
  },
  {
    key: "caja",
    label: "Caja",
    short: "CJ",
    path: "Caja/index.html",
    description: "Apertura, cierre y flujo operativo de caja para el POS.",
    owner: "Este entry point queda reservado para el frontend definitivo del equipo de Caja.",
    handoff: [
      "Implementar la vista operativa de caja sin tocar la navegación global.",
      "Usar componentes compartidos para botones, cards y badges.",
      "Mantener esta página como acceso directo desde el dashboard raíz.",
    ],
  },
  {
    key: "clientes",
    label: "Clientes",
    short: "CL",
    path: "Clientes/index.html",
    description: "Base de clientes, historial y experiencias de fidelización.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de Clientes.",
    handoff: [
      "Construir el módulo de clientes sin duplicar estilos globales.",
      "Mantener nomenclatura clara para futuras vistas y componentes.",
      "Elevar al root solo mejoras que beneficien a todos los módulos.",
    ],
  },
  {
    key: "cocina",
    label: "Cocina",
    short: "CK",
    path: "Cocina/index.html",
    description: "Vista operativa para producción, cola y estado de preparación.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de Cocina.",
    handoff: [
      "Preparar una UI orientada a velocidad operativa y lectura rápida.",
      "Reutilizar el sistema de layout y tipografía compartido.",
      "Conservar breadcrumb y retorno al dashboard en toda vista nueva.",
    ],
  },
  {
    key: "delivery-afiliados",
    label: "DeliveryAfiliados",
    short: "DA",
    path: "DeliveryAfiliados/index.html",
    description: "Operación de delivery, marketplaces y afiliados externos.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de DeliveryAfiliados.",
    handoff: [
      "Separar claramente estados de delivery, afiliados y marketplaces.",
      "Mantener consistencia visual con badges y tarjetas compartidas.",
      "Evitar lógica de negocio dentro del shell global del proyecto.",
    ],
  },
  {
    key: "reportes",
    label: "Reportes",
    short: "RP",
    path: "Reportes/index.html",
    description: "Reportes, indicadores y visualización operativa del negocio.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de Reportes.",
    handoff: [
      "Preparar una jerarquía visual clara para métricas y reportes.",
      "Utilizar el set global de cards y componentes compartidos.",
      "Documentar futuras vistas secundarias dentro de la carpeta del módulo.",
    ],
  },
  {
    key: "menu-actual",
    label: "MenuActual",
    short: "MN",
    path: "MenuActual/index.html",
    description: "Carta vigente, categorías y disponibilidad comercial del menú.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de MenuActual.",
    handoff: [
      "Diseñar la estructura del catálogo sin mezclar lógica de pedidos.",
      "Respetar el uso de grid y espaciado del Design System.",
      "Mantener el módulo desacoplado para revisión por pull request.",
    ],
  },
  {
    key: "pedidos",
    label: "Pedidos",
    short: "PD",
    path: "Pedidos/index.html",
    description: "Pedidos de salón, delivery y coordinación operativa central.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de Pedidos.",
    handoff: [
      "Preparar vistas internas orientadas a velocidad y trazabilidad.",
      "Reutilizar estados, chips y estructura visual compartida.",
      "Evitar dependencias innecesarias con otros módulos en esta fase.",
    ],
  },
  {
    key: "recetas",
    label: "Recetas",
    short: "RC",
    path: "Recetas/index.html",
    description: "Recetas, costos, porciones y estandarización operativa.",
    owner:
      "Este entry point queda reservado para el frontend definitivo del equipo de Recetas.",
    handoff: [
      "Construir la base del módulo manteniendo consistencia con el shell global.",
      "Modelar jerarquías limpias para recetas, insumos y costos.",
      "Mantener las mejoras compartidas dentro de la capa global del proyecto.",
    ],
  },
];

export const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Inicio",
    short: "IN",
    path: "index.html",
    description: "Panel base del sistema",
  },
  ...MODULES,
];

const STORAGE_KEY = "mirest-ui-theme";

export function getRootPath() {
  return document.body.dataset.rootPath || "./";
}

export function toHref(path) {
  return `${getRootPath()}${path}`;
}

export function getModuleByKey(key) {
  return NAV_ITEMS.find((item) => item.key === key) || NAV_ITEMS[0];
}

export function formatCurrentDate() {
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function renderSidebar(target, activeKey) {
  if (!target) return;

  const dashboardItem = NAV_ITEMS[0];
  const moduleItems = NAV_ITEMS.slice(1);

  target.innerHTML = `
    <section class="sidebar-group">
      <span class="sidebar-group__label">Menu principal</span>
      <div class="sidebar-list">
        ${renderNavItem(dashboardItem, activeKey)}
      </div>
    </section>
    <section class="sidebar-group">
      <span class="sidebar-group__label">Módulos</span>
      <div class="sidebar-list">
        ${moduleItems.map((item) => renderNavItem(item, activeKey)).join("")}
      </div>
    </section>
  `;
}

function renderNavItem(item, activeKey) {
  const isActive = item.key === activeKey;

  return `
    <a class="nav-item ${isActive ? "nav-item--active" : ""}" href="${toHref(item.path)}">
      <span class="nav-item__icon" aria-hidden="true">${item.short}</span>
      <span class="nav-item__text">
        <strong>${item.label}</strong>
      </span>
      <span class="nav-item__arrow" aria-hidden="true">›</span>
    </a>
  `;
}

export function initializeThemeToggle(button) {
  if (!button) return;

  const storedTheme = localStorage.getItem(STORAGE_KEY);
  const initialTheme = storedTheme || document.body.dataset.theme || "light";

  applyTheme(initialTheme, button);

  button.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, button);
  });
}

function applyTheme(theme, button) {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);

  if (button) {
    const isDark = theme === "dark";
    button.textContent = isDark ? "Modo claro" : "Modo oscuro";
    button.setAttribute("aria-pressed", String(isDark));
  }
}
