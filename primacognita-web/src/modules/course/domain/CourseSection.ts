export type CourseModuleType = string;

export interface ModuleContent {
  type: string;
  filename: string;
  fileurl: string;
  filesize?: number;
  mimetype?: string;
}

export interface ModuleCompletion {
  state: 0 | 1 | 2 | 3;
  hasCompletion: boolean;
  isAutomatic: boolean;
}

export interface CourseModule {
  id: number;
  cmid: number;
  name: string;
  modName: CourseModuleType;
  url: string | null;
  description: string | null;
  visible: boolean;

  icon?: string;
  contents?: ModuleContent[];
  completion?: ModuleCompletion;
}

export interface CourseSection {
  id: number;
  name: string;
  summary: string | null;
  modules: CourseModule[];
}

export const isExerciseModule = (m: CourseModule): boolean => {
  return ["assign", "quiz", "workshop"].includes(m.modName);
};