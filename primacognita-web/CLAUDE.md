# PrimaCognita Web — Guía para Claude

## Stack

- React + TypeScript, TanStack Router, Tailwind CSS 4.1
- Package manager: **bun** (nunca npm)
- Arquitectura: feature-based con Clean Architecture en `modules/`

## Estructura de features

Seguir el patrón de `features/login/`:

```
features/<name>/
├── components/   ← componentes UI de la feature
├── hooks/        ← lógica con estado
├── pages/        ← página (data + navegación) → pasa props a view
├── types/        ← tipos locales
└── utils/        ← funciones puras
```

## UI System Contract

```
src/components/
├── ui/        ← primitivos (átomos: Button, Input, Modal, AvatarBox, StepBadge, FormField, ProgressBar, ProgressBanner)
└── patterns/  ← composiciones UI reutilizables (EmptyState, LoadingState)
```

**Regla**: ninguna feature puede definir estilos que dupliquen un componente existente en `ui/` o `patterns/`.
Si un primitivo existente no cubre el caso, añadir una variante (nuevo prop) al componente existente. No crear componentes locales paralelos.

## Referencia intocable

`features/login/` — estructura correcta de página/form/hook/types.
