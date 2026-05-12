export type WorkspaceTabId = 'temario' | 'ejercicios' | 'logros' | 'anuncios' | 'companeros';

export type WorkspaceTab = {
  id: WorkspaceTabId;
  label: string;
  icon: string;
  variant: 'student' | 'teacher' | 'both';
  key: string;
};

export const WORKSPACE_TABS: WorkspaceTab[] = [
  { id: 'temario',    label: 'Temario',       icon: '📚', variant: 'both',    key: 'temario' },
  { id: 'ejercicios', label: 'Ejercicios',     icon: '✏️', variant: 'student', key: 'student-ejercicios' },
  { id: 'ejercicios', label: 'Por revisar',    icon: '✏️', variant: 'teacher', key: 'teacher-ejercicios' },
  { id: 'logros',     label: 'Mis logros',     icon: '🏆', variant: 'student', key: 'student-logros' },
  { id: 'logros',     label: 'Calificaciones', icon: '🏆', variant: 'teacher', key: 'teacher-logros' },
  { id: 'anuncios',   label: 'Anuncios',       icon: '📣', variant: 'both',    key: 'anuncios' },
  { id: 'companeros', label: 'Compañeros',     icon: '👥', variant: 'student', key: 'student-companeros' },
  { id: 'companeros', label: 'Alumnos',        icon: '👥', variant: 'teacher', key: 'teacher-companeros' },
];
