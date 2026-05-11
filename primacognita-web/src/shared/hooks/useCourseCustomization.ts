import { useState, useCallback } from 'react';
import { COURSE_COLORS, COURSE_EMOJIS, type CourseColor } from '@/shared/theme/courseColors';

const STORAGE_KEY = 'pc_course_customs';

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
