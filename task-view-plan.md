# Plan: Rediseño de TaskView (course-workspace/sections/student/task/TaskView.tsx)

## Resumen

Rediseñar el `TaskView.tsx` existente (sección "Ejercicios" dentro del workspace del curso) para que coincida con el diseño proporcionado. Todo vive dentro de `features/course-workspace/sections/student/task/`, sin crear módulos nuevos ni tocar páginas padre.

---

## 1. Datos necesarios vs. datos disponibles

El diseño requiere por ejercicio: `title`, `kind`, `topic` (nombre sección), `due`, `state`, `score`, `max`.

Actualmente `TaskView` recibe `CourseModule[]` (flat) que solo tiene: `id`, `name`, `modName`, `completion.state`, `url`.

**Datos faltantes y su origen:**
- `topic` (nombre sección) → existe en `CourseSection.name`. Como `TaskView` recibe flat array, necesitamos pasar un mapa `cmid → sectionName` o un array enriquecido.
- `due` (fecha cierre) → disponible via `assignmentRepository.getAssignmentsForCourse()` (tiene `AssignmentMeta` con `dueDate`).
- `score` / `max` → disponible via `assignmentRepository.getGradesForAssignments()`.
- `state` (pending/submitted/graded/late) → se deriva de `completion.state` + si tiene submission + si tiene grade + si dueDate pasó.

**Propuesta de enriquecimiento:** Hook local `useEnrichedExercises` que acepta `(courseId, token, userId, exercises, sections)` y retorna `EnrichedExercise[]` con toda la info. Se invoca dentro de TaskView y este actualiza sus props.

---

## 2. Ficheros a crear

### `features/course-workspace/sections/student/task/types/exercise.types.ts`

```ts
export type ExerciseKind = 'assign' | 'quiz' | 'workshop' | 'h5pactivity' | 'lesson';
export type ExerciseState = 'pending' | 'submitted' | 'graded' | 'late';

export interface EnrichedExercise {
  id: number;
  cmid: number;
  title: string;
  kind: ExerciseKind;
  topic: string;                // nombre de la sección (e.g. "Tema 1")
  dueTimestamp: number | null;  // segundos Unix, para comparar
  state: ExerciseState;
  score: number | null;
  max: number | null;
  isInternal: boolean;          // si usa página interna o link externo
}
```

### `features/course-workspace/sections/student/task/hooks/useEnrichedExercises.ts`

Hook que acepta:
```ts
function useEnrichedExercises(params: {
  courseId: string | null;
  token: string | null;
  userId: string | null;
  exercises: CourseModule[];
  sections: CourseSection[];
}): {
  enriched: EnrichedExercise[];
  loading: boolean;
}
```

Lógica interna:
1. Construye `Map<cmid, sectionName>` a partir de `sections[]`
2. Si hay token, fetchea `getAssignmentsForCourse()` → obtiene due dates por cmid
3. Si hay token, fetchea `getGradesForAssignments()` → obtiene score/max por cmid
4. Itera `exercises` y mapea cada `CourseModule` a `EnrichedExercise`:
   - `[cmid → sectionName]` = topic
   - `[cmid → dueDate]` = dueTimestamp
   - `state`: si hasGrade → `graded`; si completion.state >= 1 → `submitted`; si dueDate pasó → `late`; sino → `pending`
   - `score`/`max` de grades map si existe
5. Maneja errores silenciosamente (widget no crítico)

### `features/course-workspace/sections/student/task/components/ExerciseRow.tsx`

Componente presentacional que renderiza una fila según el diseño exacto del usuario.

Props: `{ exercise: EnrichedExercise; onClick?: () => void }`

Reusa:
- `getModuleMeta(exercise.kind)` de `../../../utils/workspace-mappers` → emoji, label, soft classes

Estructura del row (traduciendo el diseño a TSX):
```tsx
<button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-(--border) hover:border-emerald-300 hover:shadow-sm transition text-left">
  <div className={`size-12 rounded-2xl ${meta.soft} grid place-items-center text-2xl shrink-0`}>{meta.emoji}</div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle)">{meta.label}</span>
      <span className="text-(--fg-subtle)">·</span>
      <span className="text-[11px] font-bold text-(--fg-muted)">{exercise.topic}</span>
    </div>
    <div className="font-extrabold text-(--fg) leading-tight truncate">{exercise.title}</div>
    <div className="text-xs text-(--fg-muted) mt-0.5">
      📅 Cierre: <span className="font-bold">{formattedDueDate}</span>
    </div>
  </div>
  <div className="flex flex-col items-end gap-1.5">
    <span className={`text-[10px] font-extrabold rounded-full px-2.5 py-1 flex items-center gap-1 ${statePill}`}>
      <span>{stateIcon}</span>{stateLabel}
    </span>
    {exercise.score != null && (
      <span className="text-sm font-extrabold text-(--fg)">
        {exercise.score}<span className="text-xs text-(--fg-muted) font-bold"> / {exercise.max}</span>
      </span>
    )}
  </div>
</button>
```

### `features/course-workspace/sections/student/task/components/SummaryCard.tsx`

Props: `{ graded: number; total: number; pending: number; submitted: number }`

Renderiza:
- Nº calificados / total + barra de progreso (`div` con gradiente, no se necesita el primitivo `InlineProgressBar` porque usa estilo único)
- Tarjeta "Por hacer" con count
- Tarjeta "Entregados" con count

### `features/course-workspace/sections/student/task/components/NextDueCard.tsx`

Props: `{ title: string; daysRemaining: number }`

Renderiza la tarjeta "Próximo cierre" con el diseño dado (icono ⏰ sobre bg-rose-100, nombre truncado, "en X días").

### `features/course-workspace/sections/student/task/utils/stateMeta.ts`

Constantes exportadas para el mapeo ExerciseState → label/icono/pill classes:
```ts
export const STATE_META: Record<ExerciseState, { label: string; icon: string; pill: string }> = {
  pending:   { label: 'Por hacer',   icon: '⏳', pill: 'bg-orange-100 text-orange-800' },
  submitted: { label: 'Entregado',   icon: '📤', pill: 'bg-sky-100 text-sky-800' },
  graded:    { label: 'Calificado',  icon: '⭐',  pill: 'bg-emerald-100 text-emerald-800' },
  late:      { label: 'Tarde',       icon: '⏰', pill: 'bg-rose-100 text-rose-800' },
};
```

### `features/course-workspace/sections/student/task/utils/formatDueDate.ts`

Función que dado un timestamp en segundos y una referencia `now` (ms), devuelve string:
- `null` → "Sin fecha"
- `ts pasado` → "Atrasada"
- `mismo día` → "Hoy"
- `día siguiente` → "Mañana"
- `< 7 días` → "En X días"
- `default` → formato fecha español corto

---

## 3. Ficheros a modificar

### `features/course-workspace/sections/student/task/TaskView.tsx` → REESCRIBIR COMPLETAMENTE

Nuevas props:
```ts
export type TaskViewProps = {
  exercises: CourseModule[];
  sections: CourseSection[];
  courseId: string;
  onExerciseClick?: (module: CourseModule) => void;
};
```

Nuevo body:
1. Usa `useSession()` para obtener token + userId
2. Usa `useEnrichedExercises({ courseId, token, userId, exercises, sections })`
3. Estado de filtro: `useState<'todos' | 'pending' | 'submitted' | 'graded'>('todos')`
4. Layout: `grid grid-cols-[1fr_300px] gap-6`
5. Columna izquierda: header "Tus ejercicios" + descripción + pills de filtro + lista de ExerciseRow
6. Columna derecha: SummaryCard + NextDueCard
7. Si `loading` → mensaje "Cargando..."
8. Si lista vacía → mensaje "No hay ejercicios"

Ya no necesita `Surface`, `Text`, `ClipboardList` de los imports actuales.

Se elimina el viejo `ExerciseCard` interno (su funcionalidad se integra en `ExerciseRow` + la navegación a la página interna).

### `features/course-workspace/components/layout/WorkspaceContent.tsx`

Actualizar la llamada a `<TaskView>` para pasar las nuevas props:
```tsx
case 'ejercicios':
  return (
    <TaskView
      exercises={exercises}
      sections={sections.map(s => s.section)}  // extraer CourseSection[]
      courseId={...}   // recibir courseId desde WorkspaceContentProps
      onExerciseClick={onModuleClick}
    />
  );
```

Añadir `courseId: string` a `WorkspaceContentProps`.

### `features/course-workspace/components/layout/WorkspaceContent.tsx` (actualización del render en CourseWorkspaceView)

Pasar `courseId`:

En `CourseWorkspaceView.tsx`, pasar `courseId` al `WorkspaceContent`.

---

## 4. Reutilización de componentes/ui/ existentes

| Necesidad | Componente existente | Uso |
|---|---|---|
| Layout wrapper | `Page` de `@/components/ui/page/Page` | NO, TaskView es sección interna, no página. No usar. |
| Empty state | `EmptyState` de `@/components/patterns/emptyState/EmptyState` | Sí, si lista vacía |
| Error | `Alert` de `@/components/ui/alert/Alert` | Sí, si error en datos |
| Card surfaces | `Surface` de `@/components/ui/surface/Surface` | NO, el diseño usa `bg-white rounded-3xl p-5 border` directamente |
| Module metadata | `getModuleMeta()` de `../../../utils/workspace-mappers` | Sí, reemplaza a `EXERCISE_KIND_META` |
| Module type check | `isExerciseModule()` de `@/modules/course/domain/CourseSection` | Ya en el parent |
| Button | `Button` de `@/components/ui/button/Button` | NO, los filtros son botones con estilo custom |
| Lucide icons | Iconos existentes | NO, el diseño usa emojis, no Lucide |

---

## 5. Datos mock vs. reales

El hook `useEnrichedExercises` intentará datos reales via repositorios. Si falla (token nulo, error de red), **no** cae a mock — simplemente deriva el estado de `completion.state` y omite score/max si no hay datos de grade.

El diseño de los 7 ejercicios de ejemplo se usará como **guía visual**, no como mock data embedida. La UI se probará con los datos reales del curso.

---

## 6. Navegación onClick

`ExerciseRow` llama `onClick()` que debe navegar a la actividad correspondiente:
- Si `isInternal` (assign, quiz) → navegación interna TanStack Router
- Si no → abrir `module.url` en nueva pestaña

La lógica de `handleModuleClick` ya existe en `CourseWorkspacePage` y se pasa vía `onModuleClick` → `onExerciseClick`.

---

## 7. Resumen de cambios

| Archivo | Acción |
|---|---|
| `sections/student/task/types/exercise.types.ts` | CREAR |
| `sections/student/task/utils/stateMeta.ts` | CREAR |
| `sections/student/task/utils/formatDueDate.ts` | CREAR |
| `sections/student/task/hooks/useEnrichedExercises.ts` | CREAR |
| `sections/student/task/components/ExerciseRow.tsx` | CREAR |
| `sections/student/task/components/SummaryCard.tsx` | CREAR |
| `sections/student/task/components/NextDueCard.tsx` | CREAR |
| `sections/student/task/TaskView.tsx` | REESCRIBIR |
| `components/layout/WorkspaceContent.tsx` | MODIFICAR (nuevas props) |

---

## 8. Consideración adicional: filtro interactivo

Los botones de filtro usan diseño específico:
- Activo: `bg-[#274E38] text-white border-[#274E38]`
- Inactivo: `bg-white text-(--fg-muted) border-(--border)`

Esto no puede sustituirse por `Button` primitivo. Se implementan como `<button>` directamente en TaskView con las clases condicionales.

---

## 9. Verificación

1. `bun run lint` — sin errores
2. `bun run typecheck` — sin errores de tipo
3. Al hacer clic en "Ejercicios" dentro de un curso, se ve el nuevo diseño con filtros y sidebar de resumen
4. Los filtros cambian la lista correctamente
5. SummaryCard muestra counts correctos
6. NextDueCard muestra el próximo cierre
