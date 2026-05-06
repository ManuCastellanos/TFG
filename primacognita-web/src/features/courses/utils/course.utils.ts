import type { Course } from '@/modules/course/domain/Course';
import type { ProgressBarViewModel } from '@/components/ui/progressBar/progressBar.types';

export function dateStringToUnix(dateString: string): number {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

export function toProgressBarViewModel(course: Course): ProgressBarViewModel {
  const progress = clamp(Math.round(course.progress ?? 0));
  const { completed } = course;
  let message = '¡Empieza tu aventura! ✨';
  if (completed) message = '¡Curso completado! 🏆';
  else if (progress >= 75) message = '¡Casi lo tienes! 💪';
  else if (progress >= 40) message = '¡Vas genial! 🚀';
  else if (progress > 0) message = '¡Sigue así! 🌱';
  return { progress, completed, message };
}
