export type CreateSectionInput = {
  courseId: number;
  name?: string;
  summary?: string;
};

export type UpdateSectionInput = {
  sectionId: number;
  name?: string;
  summary?: string;
  visible?: boolean;
};
