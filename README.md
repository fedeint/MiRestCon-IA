# MiRest con IA — Frontend Skeleton Base

Base frontend del sistema administrativo MiRest con IA construida con HTML, CSS y JavaScript vanilla.

## Qué incluye

- Dashboard principal responsive en [index.html](index.html)
- Navegación global entre módulos
- Placeholders independientes por módulo en [Almacen/index.html](Almacen/index.html), [Caja/index.html](Caja/index.html), [Clientes/index.html](Clientes/index.html), [Cocina/index.html](Cocina/index.html), [DeliveryAfiliados/index.html](DeliveryAfiliados/index.html), [Facturacion/index.html](Facturacion/index.html), [MenuActual/index.html](MenuActual/index.html), [Pedidos/index.html](Pedidos/index.html) y [Recetas/index.html](Recetas/index.html)
- Design System base en [styles/tokens.css](styles/tokens.css)
- Scripts globales en [scripts/app.js](scripts/app.js), [scripts/navigation.js](scripts/navigation.js) y [scripts/dashboard.js](scripts/dashboard.js)

## Estructura

```text
/
├── index.html
├── README.md
├── TECHNICAL_DOCS.md
├── styles/
├── scripts/
├── Almacen/
├── Caja/
├── Clientes/
├── Cocina/
├── DeliveryAfiliados/
├── Facturacion/
├── MenuActual/
├── Pedidos/
└── Recetas/
```

## Cómo usar

### Local

1. Abre [index.html](index.html) en el navegador.
2. Recorre el dashboard y entra a cada módulo.
3. Usa Live Server si quieres recarga automática.

## Flujo de trabajo recomendado

### Rama principal

- [main](https://github.com/shonperez/MiRestConIAEsqueleto/tree/main) debe mantenerse estable.
- Todo cambio debe entrar por Pull Request.

### Trabajo por módulo

Cada responsable debe trabajar en su carpeta correspondiente:

- Almacén → [Almacen/](Almacen)
- Caja → [Caja/](Caja)
- Clientes → [Clientes/](Clientes)
- Cocina → [Cocina/](Cocina)
- DeliveryAfiliados → [DeliveryAfiliados/](DeliveryAfiliados)
- Facturación → [Facturacion/](Facturacion)
- Menú actual → [MenuActual/](MenuActual)
- Pedidos → [Pedidos/](Pedidos)
- Recetas → [Recetas/](Recetas)

### Convenciones

- Reutilizar estilos globales antes de crear CSS nuevo.
- No mover el shell global del dashboard.
- Mantener retorno al dashboard principal.
- Subir al root solo mejoras compartidas.

## Ramas sugeridas

- `feature/almacen-ui`
- `feature/caja-ui`
- `feature/clientes-ui`
- `feature/cocina-ui`
- `feature/delivery-afiliados-ui`
- `feature/facturacion-ui`
- `feature/menu-actual-ui`
- `feature/pedidos-ui`
- `feature/recetas-ui`

## Documentación adicional

- Guía técnica interna en [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

## Deploy

Este proyecto puede desplegarse como sitio estático.
