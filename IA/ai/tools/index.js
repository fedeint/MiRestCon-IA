import { resolveModuleContext } from "../modules.js";

function getRootPath() {
  return document?.body?.dataset?.rootPath || "../";
}

export function buildToolsForModule(moduleKey) {
  const mod = resolveModuleContext(moduleKey);

  return [
    {
      functionDeclarations: [
        {
          name: "navigate_to_module",
          description:
            "Navega hacia un módulo del dashboard de MiRest con IA abriendo su HTML.",
          parameters: {
            type: "object",
            properties: {
              moduleKey: {
                type: "string",
                description:
                  "Clave del módulo destino (almacen, clientes, pedidos, recetas, dashboard, etc.)",
              },
              path: {
                type: "string",
                description:
                  "Ruta relativa opcional al HTML del módulo (si se conoce).",
              },
            },
            required: ["moduleKey"],
          },
        },
        {
          name: "get_module_info",
          description:
            `Devuelve contexto del módulo actual (${mod.label}) para guiar respuestas.`,
          parameters: {
            type: "object",
            properties: {
              moduleKey: { type: "string" },
            },
            required: ["moduleKey"],
          },
        },
        {
          name: "create_action_plan",
          description:
            "Crea un plan de acciones operativas para el usuario basado en el contexto actual.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string" },
              steps: { type: "array", items: { type: "string" } },
            },
            required: ["title", "steps"],
          },
        },
      ],
    },
  ];
}

export async function executeToolCall(call) {
  const name = call?.name;
  const args = call?.args || {};

  if (name === "get_module_info") {
    const mod = resolveModuleContext(args.moduleKey);
    return {
      moduleKey: args.moduleKey,
      label: mod.label,
      scope: mod.scope,
    };
  }

  if (name === "create_action_plan") {
    return {
      title: args.title,
      steps: Array.isArray(args.steps) ? args.steps : [],
    };
  }

  if (name === "navigate_to_module") {
    const root = getRootPath();
    const key = args.moduleKey;
    const map = {
      dashboard: "index.html",
      almacen: "Almacen/almacen.html",
      clientes: "Clientes/clientes.html",
      pedidos: "Pedidos/implementacion/pedidos.html",
      recetas: "Recetas/recetas.html",
    };

    const href = args.path || map[key];
    if (!href) {
      return { ok: false, error: "Unknown module" };
    }

    window.location.href = root + href;
    return { ok: true, href: root + href };
  }

  return { ok: false, error: `Tool not implemented: ${name}` };
}
