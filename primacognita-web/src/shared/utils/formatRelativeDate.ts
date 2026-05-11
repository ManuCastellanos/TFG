export function formatRelativeDate(timestampMs: number): string {
  const now = new Date();
  const date = new Date(timestampMs);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (startOfDate.getTime() === startOfToday.getTime()) return `Hoy · ${time}`;
  if (startOfDate.getTime() === startOfYesterday.getTime()) return `Ayer · ${time}`;

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ` · ${time}`;
}
