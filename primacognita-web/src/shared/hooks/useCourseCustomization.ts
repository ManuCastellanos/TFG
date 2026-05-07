import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pc_course_customs';

export const COURSE_COLORS = [
  'sky', 'violet', 'lime', 'orange', 'pink', 'emerald', 'cyan', 'rose', 'indigo', 'teal',
] as const;
export type CourseColor = (typeof COURSE_COLORS)[number];

export const COURSE_EMOJIS = [
  '📚', '📐', '📖', '🌱', '🎵', '🌍', '🏃', '🎨', '🔬', '✏️', '🔢', '🏅',
  '🦁', '🚀', '⭐', '🎯', '🧩', '💡',
] as const;

export const COLOR_META: Record<
  CourseColor,
  { soft: string; softBanner: string; border: string; text: string; grad: string; solid: string; glow: string; hover: string }
> = {
  sky:    { soft: 'bg-sky-100',    softBanner: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700',    grad: 'from-sky-300 to-sky-500',       solid: 'bg-sky-500',    glow: 'bg-sky-500',    hover: 'hover:border-sky-300'    },
  violet: { soft: 'bg-violet-100', softBanner: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', grad: 'from-violet-300 to-violet-500', solid: 'bg-violet-500', glow: 'bg-violet-500', hover: 'hover:border-violet-300' },
  lime:   { soft: 'bg-lime-100',   softBanner: 'bg-lime-50',   border: 'border-lime-200',   text: 'text-lime-700',   grad: 'from-lime-300 to-lime-500',     solid: 'bg-lime-500',   glow: 'bg-lime-500',   hover: 'hover:border-lime-300'   },
  orange: { soft: 'bg-orange-100', softBanner: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', grad: 'from-orange-300 to-orange-500', solid: 'bg-orange-500', glow: 'bg-orange-500', hover: 'hover:border-orange-300' },
  pink:   { soft: 'bg-pink-100',   softBanner: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700',   grad: 'from-pink-300 to-pink-500',     solid: 'bg-pink-500',   glow: 'bg-pink-500',   hover: 'hover:border-pink-300'   },
  emerald:{ soft: 'bg-emerald-100',softBanner: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700',grad: 'from-emerald-300 to-emerald-500',solid: 'bg-emerald-500',glow: 'bg-emerald-500',hover: 'hover:border-emerald-300'},
  cyan:   { soft: 'bg-cyan-100',   softBanner: 'bg-cyan-50',   border: 'border-cyan-200',   text: 'text-cyan-700',   grad: 'from-cyan-300 to-cyan-500',     solid: 'bg-cyan-500',   glow: 'bg-cyan-500',   hover: 'hover:border-cyan-300'   },
  rose:   { soft: 'bg-rose-100',   softBanner: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   grad: 'from-rose-300 to-rose-500',     solid: 'bg-rose-500',   glow: 'bg-rose-500',   hover: 'hover:border-rose-300'   },
  indigo: { soft: 'bg-indigo-100', softBanner: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', grad: 'from-indigo-300 to-indigo-500', solid: 'bg-indigo-500', glow: 'bg-indigo-500', hover: 'hover:border-indigo-300' },
  teal:   { soft: 'bg-teal-100',   softBanner: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700',   grad: 'from-teal-300 to-teal-500',     solid: 'bg-teal-500',   glow: 'bg-teal-500',   hover: 'hover:border-teal-300'   },
};

type CourseCustom = { emoji: string; color: CourseColor };

function readAll(): Record<string, CourseCustom> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, CourseCustom>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useCourseCustomization(courseId: string, index = 0) {
  const defaultCustom: CourseCustom = {
    emoji: COURSE_EMOJIS[index % COURSE_EMOJIS.length],
    color: COURSE_COLORS[index % COURSE_COLORS.length],
  };

  const [custom, setCustomState] = useState<CourseCustom>(() => {
    const all = readAll();
    return all[courseId] ?? defaultCustom;
  });

  const update = useCallback(
    (patch: Partial<CourseCustom>) => {
      setCustomState((prev) => {
        const next = { ...prev, ...patch };
        const all = readAll();
        all[courseId] = next;
        writeAll(all);
        return next;
      });
    },
    [courseId],
  );

  return { emoji: custom.emoji, color: custom.color, update };
}
