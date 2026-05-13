export function formatLastAccess(timestampMs: number | undefined, now: number): string {
  if (!timestampMs) return 'Sin acceso reciente';
  const diff = now - timestampMs;
  if (diff < 5 * 60 * 1000) return 'online';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Visto hace ${mins} min`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `Visto hace ${hours} h`;
  const days = Math.floor(diff / 86400000);
  return `Visto hace ${days} días`;
}
