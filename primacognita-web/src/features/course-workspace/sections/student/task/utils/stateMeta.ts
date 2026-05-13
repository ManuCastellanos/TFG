import type { ExerciseState } from '../types/exercise.types';

export const STATE_META: Record<ExerciseState, { label: string; icon: string; pill: string }> = {
  pending:   { label: 'Por hacer',   icon: '⏳', pill: 'bg-orange-100 text-orange-800' },
  submitted: { label: 'Entregado',   icon: '📤', pill: 'bg-sky-100 text-sky-800' },
  graded:    { label: 'Calificado',  icon: '⭐',  pill: 'bg-emerald-100 text-emerald-800' },
  late:      { label: 'Tarde',       icon: '⏰', pill: 'bg-rose-100 text-rose-800' },
};
