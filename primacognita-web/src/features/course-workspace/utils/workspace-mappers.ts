import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { SECTION_COLORS } from '../types/workspace.types';

const MODULE_META: Record<string, { label: string; emoji: string; soft: string; text: string }> = {
  lesson: { label: 'Lección', emoji: '📖', soft: 'bg-sky-100', text: 'text-sky-700' },
  quiz: { label: 'Cuestionario', emoji: '🧩', soft: 'bg-green-100', text: 'text-green-700' },
  assign: { label: 'Tarea', emoji: '📝', soft: 'bg-violet-100', text: 'text-violet-700' },
  workshop: { label: 'Taller', emoji: '🤝', soft: 'bg-pink-100', text: 'text-pink-700' },
  h5pactivity: { label: 'Actividad', emoji: '🎨', soft: 'bg-lime-100', text: 'text-lime-700' },
  forum: { label: 'Anuncios', emoji: '📣', soft: 'bg-neutral-100', text: 'text-neutral-600' },
};

export const getModuleMeta = (modName: string) =>
  MODULE_META[modName] ?? { label: modName, emoji: '📄', soft: 'bg-neutral-100', text: 'text-neutral-600' };

export const stripHtml = (html: string | null): string => (html ? html.replace(/<[^>]+>/g, '').trim() : '');

export const getStudentColor = (userId: number) => SECTION_COLORS[userId % SECTION_COLORS.length];

export type ModuleStatus = 'completed' | 'pending' | 'locked';

export type ModuleViewModel = {
  id: number;
  cmid: number;
  title: string;
  icon: string;
  label: string;
  soft: string;
  text: string;
  status: ModuleStatus;
  url: string | null;
  isInternal: boolean;
  showCompletion: boolean;
  pendingCount?: number;
};

export type SectionViewModel = {
  id: number;
  name: string;
  summary: string;
  number: number;
  colorIdx: number;
  progress?: number;
  modules: ModuleViewModel[];
  teacherSectionProgress?: number;
};

const INTERNAL_MODULE_NAMES = ['assign', 'quiz'];

export { INTERNAL_MODULE_NAMES };

export const toModuleVM = (module: CourseModule, pendingCount?: number): ModuleViewModel => {
  const meta = getModuleMeta(module.modName);
  const completion = module.completion;
  const isCompleted = (completion?.state ?? 0) >= 1;

  return {
    id: module.id,
    cmid: module.cmid,
    title: module.name,
    icon: meta.emoji,
    label: meta.label,
    soft: meta.soft,
    text: meta.text,
    status: isCompleted ? 'completed' : 'pending',
    url: module.url ?? null,
    isInternal: INTERNAL_MODULE_NAMES.includes(module.modName),
    showCompletion: completion?.hasCompletion === true,
    pendingCount,
  };
};

export const toSectionVM = (
  section: CourseSection,
  colorIdx: number,
  sectionNumber: number,
  teacherSectionProgress?: number,
): SectionViewModel => {
  const isGeneral = section.id === 0;
  const safeColorIdx = colorIdx >= 0 ? colorIdx % SECTION_COLORS.length : 0;

  const modulesWithCompletion = section.modules.filter((m) => m.completion?.hasCompletion);
  const progress =
    modulesWithCompletion.length > 0
      ? Math.round(
          (modulesWithCompletion.filter((m) => (m.completion?.state ?? 0) >= 1).length / modulesWithCompletion.length) *
            100,
        )
      : undefined;

  return {
    id: section.id,
    name: section.name,
    summary: stripHtml(section.summary),
    number: isGeneral ? 0 : sectionNumber,
    colorIdx: safeColorIdx,
    progress,
    modules: section.modules.map((m) => toModuleVM(m)),
    teacherSectionProgress,
  };
};
