export const SECTION_COLORS = [
  { soft: 'bg-emerald-100', text: 'text-emerald-700', grad: 'from-emerald-300 to-emerald-500' },
  { soft: 'bg-sky-100', text: 'text-sky-700', grad: 'from-sky-300 to-sky-500' },
  { soft: 'bg-violet-100', text: 'text-violet-700', grad: 'from-violet-300 to-violet-500' },
  { soft: 'bg-orange-100', text: 'text-orange-700', grad: 'from-orange-300 to-orange-500' },
  { soft: 'bg-pink-100', text: 'text-pink-700', grad: 'from-pink-300 to-pink-500' },
  { soft: 'bg-lime-100', text: 'text-lime-700', grad: 'from-lime-300 to-lime-500' },
] as const;

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

export type WorkspaceTab = 'temario' | 'ejercicios' | 'logros' | 'anuncios' | 'companeros';

export const STUDENT_TABS: { id: WorkspaceTab; label: string; emoji: string }[] = [
  { id: 'temario', label: 'Temario', emoji: '📚' },
  { id: 'ejercicios', label: 'Ejercicios', emoji: '✏️' },
  { id: 'logros', label: 'Mis logros', emoji: '🏆' },
  { id: 'anuncios', label: 'Anuncios', emoji: '📣' },
  { id: 'companeros', label: 'Compañeros', emoji: '👥' },
];

export const TEACHER_TABS: { id: WorkspaceTab; label: string; emoji: string }[] = [
  { id: 'temario', label: 'Temario', emoji: '📚' },
  { id: 'ejercicios', label: 'Por revisar', emoji: '✏️' },
  { id: 'logros', label: 'Calificaciones', emoji: '🏆' },
  { id: 'anuncios', label: 'Anuncios', emoji: '📣' },
  { id: 'companeros', label: 'Alumnos', emoji: '👥' },
];
