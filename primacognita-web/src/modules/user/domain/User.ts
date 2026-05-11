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
const STUDENT_SHORTNAMES = new Set(['student']);

export const isTeacherRole = (roleName: string | null | undefined): boolean =>
  TEACHER_SHORTNAMES.has(roleName ?? '');

export const isStudentRole = (roleName: string | null | undefined): boolean =>
  STUDENT_SHORTNAMES.has(roleName ?? '');
