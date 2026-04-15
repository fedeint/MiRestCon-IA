import {
  APP_META,
  formatCurrentDate,
  getGreeting,
  getModuleByKey,
  initializeThemeToggle,
  renderSidebar,
  toHref,
} from "./navigation.js";
import { initializeDashboard } from "./dashboard.js";
import { registerServiceWorker } from "../Pwa/pwa.js";

document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.dataset.pageType || "dashboard";
  const activeKey = document.body.dataset.moduleKey || "dashboard";
  const activeItem = getModuleByKey(activeKey);
  const rootPath = (document.body.dataset.rootPath || "").replace(/\/+$/, "");

  document.body.classList.add("page-ready");
  registerServiceWorker(rootPath).catch(() => null);
  renderSidebar(document.getElementById("sidebarNav"), activeKey);
  initializeThemeToggle(document.getElementById("themeToggle"));
  initializeResponsiveSidebar(pageType);
  initializePageTransitions();
  setText("currentYear", String(new Date().getFullYear()));

  if (pageType === "dashboard") {
    initializeDashboardPage();
    initializeDashboard();
    return;
  }

  initializeModulePage(activeItem);
});

function initializeDashboardPage() {
  const locationLabel = window.location.hostname || "entorno local";

  setText("pageEyebrow", "Panel base");
  setText("pageTitle", `${getGreeting()}, Administrador`);
  setText("pageSubtitle", `${capitalize(formatCurrentDate())} · ${locationLabel} · ${APP_META.envLabel}`);
  setText("pageContextChip", "Estructura MVP");
}

function initializeModulePage(module) {
  const dashboardHref = toHref("index.html");
  const moduleFolder = module.path.split("/")[0] + "/";

  setText("pageEyebrow", "Módulo");
  setText("pageTitle", module.label);
  setText("pageSubtitle", `${module.description} · Punto de entrada colaborativo.`);
  setText("pageContextChip", module.short);
  setText("pageAvatar", module.short);

  setText("moduleBreadcrumbCurrent", module.label);
  setText("moduleTitle", module.label);
  setText("moduleDescription", module.description);
  setText("moduleOwnerHint", module.owner);
  setText("modulePathLabel", moduleFolder);
  setText("moduleEntryLabel", module.path);
  setText("moduleStatusLabel", "Módulo en construcción");

  setHref("primaryBackLink", dashboardHref);
  setHref("secondaryBackLink", dashboardHref);
  setHref("breadcrumbHome", dashboardHref);

  const checklist = document.getElementById("moduleChecklist");
  if (checklist) {
    checklist.innerHTML = module.handoff.map((item) => `<li>${item}</li>`).join("");
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setHref(id, value) {
  const element = document.getElementById(id);
  if (element) element.setAttribute("href", value);
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function initializeResponsiveSidebar(pageType) {
  const sidebar = document.getElementById("appSidebar");
  const toggle = document.getElementById("sidebarToggle");
  const backdrop = document.getElementById("sidebarBackdrop");

  if (!sidebar || !toggle || !backdrop) return;

  const closeSidebar = () => setSidebarState(false, sidebar, toggle);
  const openSidebar = () => setSidebarState(true, sidebar, toggle);

  closeSidebar();

  toggle.addEventListener("click", () => {
    const shouldOpen = !document.body.classList.contains("sidebar-open");
    if (shouldOpen) {
      openSidebar();
      return;
    }

    closeSidebar();
  });

  backdrop.addEventListener("click", closeSidebar);

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1180) {
        closeSidebar();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) {
      closeSidebar();
    }
  });

  window.addEventListener("pageshow", closeSidebar);
}

function setSidebarState(isOpen, sidebar, toggle) {
  document.body.classList.toggle("sidebar-open", isOpen);
  sidebar.classList.toggle("sidebar--open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute(
    "aria-label",
    isOpen ? "Cerrar navegación lateral" : "Abrir navegación lateral",
  );
}

function initializePageTransitions() {
  const links = document.querySelectorAll('a[href]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!shouldHandleTransition(event, link)) return;

      event.preventDefault();

      const destination = link.href;
      document.body.classList.remove("sidebar-open");
      document.body.classList.add("page-leaving");

      window.setTimeout(() => {
        window.location.href = destination;
      }, 120);
    });
  });

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving");
    document.body.classList.add("page-ready");
  });
}

function shouldHandleTransition(event, link) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.href === window.location.href) return false;

  return true;
}
