import type { CourseColor } from '@/shared/theme/courseColors';

export function getGradeFeedback(avg: number | null): {
  title: string;
  subtitle: string;
  emoji: string;
  color: CourseColor;
} {
  if (avg == null) return { title: 'Sin notas aún', subtitle: 'Completa ejercicios para ver tu progreso.', emoji: '📝', color: 'sky' };
  if (avg >= 9) return { title: '¡Excelente!', subtitle: 'Domina el tema, sigue así.', emoji: '🌟', color: 'violet' };
  if (avg >= 7) return { title: '¡Muy bien!', subtitle: 'Vas por buen camino.', emoji: '💪', color: 'emerald' };
  if (avg >= 5) return { title: 'A seguir practicando', subtitle: 'Puedes mejorar, vamos!', emoji: '📖', color: 'orange' };
  return { title: 'Ánimo', subtitle: 'Repasa los contenidos y vuelve a intentarlo.', emoji: '💡', color: 'rose' };
}
