import { useMemo } from 'react';
import { COLOR_META } from '@/shared/theme/courseColors';
import { Banner } from '@/components/ui/banner/Banner';
import { useOverallGrade } from './hooks/useOverallGrade';
import { getGradeFeedback } from './utils/gradeFeedback';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';

type GradeBannerProps = {
  courseId: string;
  token: string | null;
  userId: string | null;
  exercises: CourseModule[];
  sections: CourseSection[];
};

export function GradeBanner({ courseId, token, userId, exercises, sections }: GradeBannerProps) {
  const { overallGrade } = useOverallGrade({ courseId, token, userId, exercises, sections });
  const feedback = useMemo(() => getGradeFeedback(overallGrade), [overallGrade]);
  const c = COLOR_META[feedback.color];
  const circumference = 214;
  const offset = overallGrade != null ? ((10 - overallGrade) / 10) * circumference : circumference;

  if (exercises.length === 0) return null;

  return (
    <Banner variant="neutral" className={`w-full ${c.border} ${c.softBanner} mb-6`}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-6">
        <div className="flex items-center gap-5">
        <div className="relative size-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e5e5" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={overallGrade != null ? (feedback.color === 'violet' ? '#8b5cf6' : feedback.color === 'emerald' ? '#10b981' : feedback.color === 'orange' ? '#f59e0b' : '#f43f5e') : '#d4d4d4'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${circumference - offset} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-(--fg) leading-none">
                {overallGrade != null ? overallGrade.toFixed(1).replace('.', ',') : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-0.5`}>
            {feedback.emoji} Tu nota global
          </div>
          <h2 className="text-xl font-extrabold text-(--fg) leading-tight mb-0.5">
            {feedback.title}
          </h2>
          <p className="text-sm text-(--fg-muted)">{feedback.subtitle}</p>
        </div>
      </div>
      </div>
    </Banner>
  );
}
