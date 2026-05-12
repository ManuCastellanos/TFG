export const SECTION_COLORS = [
  { soft: 'bg-emerald-100', text: 'text-emerald-700', grad: 'from-emerald-300 to-emerald-500' },
  { soft: 'bg-sky-100', text: 'text-sky-700', grad: 'from-sky-300 to-sky-500' },
  { soft: 'bg-violet-100', text: 'text-violet-700', grad: 'from-violet-300 to-violet-500' },
  { soft: 'bg-orange-100', text: 'text-orange-700', grad: 'from-orange-300 to-orange-500' },
  { soft: 'bg-pink-100', text: 'text-pink-700', grad: 'from-pink-300 to-pink-500' },
  { soft: 'bg-lime-100', text: 'text-lime-700', grad: 'from-lime-300 to-lime-500' },
] as const;

export type WorkspaceTab = 'temario' | 'ejercicios' | 'logros' | 'anuncios' | 'companeros';
