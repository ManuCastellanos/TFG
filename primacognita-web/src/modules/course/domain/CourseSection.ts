export type CourseModuleType = string;

export interface ModuleContent {
  type: string;
  filename: string;
  fileurl: string;
  filesize?: number;
  mimetype?: string;
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