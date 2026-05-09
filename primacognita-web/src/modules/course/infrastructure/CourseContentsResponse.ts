export type ModuleContentResponse = {
  type: string;
  filename: string;
  fileurl: string;
  filesize?: number;
  mimetype?: string;
  content?: string;
};

export type CompletionDataResponse = {
  state: number;
  hascompletion: boolean;
  isautomatic: boolean;
};

export type CourseModuleResponse = {
  id: number;
  cmid: number;
  name: string;
  modname: string;

  url?: string;
  modicon?: string;
  description?: string;
  contents?: ModuleContentResponse[];
  visible?: number;
  uservisible?: boolean;
  instance?: number;
  completiondata?: CompletionDataResponse;
};

export type CourseSectionResponse = {
  id: number;
  name: string;
  
  summary?: string;
  visible?: number;
  uservisible?: boolean;
  modules?: CourseModuleResponse[];
};