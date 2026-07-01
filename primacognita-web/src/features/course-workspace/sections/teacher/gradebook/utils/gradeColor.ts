export function gradeColor(grade: number | null): string {
  if (grade == null) return 'bg-(--tint-50) text-(--fg-subtle)';
  if (grade >= 9) return 'bg-emerald-100 text-emerald-800';
  if (grade >= 7) return 'bg-sky-100 text-sky-800';
  if (grade >= 5) return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

export function formatGrade(grade: number | null): string {
  if (grade == null) return '—';
  return grade.toFixed(1).replace('.', ',');
}
