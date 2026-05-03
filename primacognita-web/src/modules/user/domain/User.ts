export interface User {
  id: string;
  username: string;
  firstName: string;
  fullName: string;
  avatarUrl: string | null;
  roleId: number | null;
  roleName: string | null;
}

const TEACHER_SHORTNAMES = new Set(['editingteacher', 'teacher']);

export const isTeacherRole = (roleName: string | null | undefined): boolean =>
  TEACHER_SHORTNAMES.has(roleName ?? '');
