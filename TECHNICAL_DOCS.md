# MiRest con IA — Frontend Skeleton Base

## Estructura implementada

El shell general del sistema vive en la raíz del proyecto:

- `index.html`: dashboard principal.
- `styles/`: tokens, base visual, layout, componentes y estilos específicos.
- `scripts/`: navegación global, bootstrap del shell y render del dashboard.
- `Almacen/index.html` a `Recetas/index.html`: entry points individuales por módulo.

## Cómo abrir el proyecto

### Opción rápida

Abrir `index.html` directamente en el navegador.

### Opción recomendada

Usar una extensión tipo Live Server para trabajar con recarga automática durante la construcción del frontend.

## Cómo trabajar por equipo

1. Cada compañero debe desarrollar su frontend dentro de su carpeta de módulo.
2. Los cambios globales compartidos deben ir en `styles/` o `scripts/` de la raíz.
3. Evitar duplicar tokens visuales dentro de cada módulo.
4. Mantener el enlace de retorno al dashboard principal.

## Convenciones base

- HTML, CSS y JavaScript vanilla.
- Design System con Inter, grid de 8px, sidebar oscuro, fondo claro y naranja como color primario.
- El dashboard raíz funciona como hub central y no debe asumir lógica de negocio real en esta fase.

## Testing manual mínimo

1. Abrir `index.html`.
2. Verificar navegación hacia los 9 módulos.
3. Verificar retorno desde cada módulo al dashboard.
4. Revisar responsive base del dashboard principal, incluyendo menú lateral móvil.
5. Verificar toggle de tema.

## Despliegue

Este skeleton puede publicarse como sitio estático en cualquier hosting de archivos estáticos.

## Próxima evolución sugerida

1. Agregar componentes reutilizables documentados por patrón.
2. Incorporar dark mode persistente más completo.
3. Establecer reglas de PR por carpeta de módulo y changelog compartido.
