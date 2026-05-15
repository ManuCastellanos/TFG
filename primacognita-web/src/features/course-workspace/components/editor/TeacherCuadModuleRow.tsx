import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { CourseModule } from '@/modules/course/domain/CourseSection';

type TeacherCuadModuleRowProps = {
  module: CourseModule;
};

export function TeacherCuadModuleRow({ module }: TeacherCuadModuleRowProps) {
  const meta = getModuleMeta(module.modName);
  const colorIdx = (module.id ?? 0) % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];

  return (
    <div className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-(--border) bg-white">
      <div className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${color.soft}`}>
        <span>{meta.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-(--fg) text-[15px] truncate">{module.name}</div>
        <div className={`text-xs font-bold ${color.text}`}>{meta.label}</div>
      </div>
    </div>
  );
}

function getModuleMeta(modName: string): { label: string; emoji: string } {
  const map: Record<string, { label: string; emoji: string }> = {
    lesson: { label: 'Lección', emoji: '📖' },
    quiz: { label: 'Cuestionario', emoji: '🧩' },
    assign: { label: 'Tarea', emoji: '📝' },
    workshop: { label: 'Taller', emoji: '🤝' },
    h5pactivity: { label: 'Actividad', emoji: '🎨' },
    forum: { label: 'Anuncios', emoji: '📣' },
    resource: { label: 'Fichero', emoji: '📄' },
    url: { label: 'Enlace', emoji: '🔗' },
  };
  return map[modName] ?? { label: modName, emoji: '📄' };
}
