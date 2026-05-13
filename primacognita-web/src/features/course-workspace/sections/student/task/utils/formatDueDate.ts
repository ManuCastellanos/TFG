export function formatDueDate(dueTimestamp: number | null, now: number): string {
  if (dueTimestamp === null) return 'Sin fecha';

  const dueMs = dueTimestamp * 1000;
  const diffDays = Math.round((dueMs - now) / 86400000);

  if (diffDays < 0) return 'Atrasada';
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays < 7) return `En ${diffDays} días`;

  const date = new Date(dueMs);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
