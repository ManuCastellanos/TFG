export type CreateQuizInput = {
  courseId: number;
  sectionNum: number;
  name: string;
  intro?: string;
  timeOpen?: number;
  timeClose?: number;
  timeLimit?: number;
  maxAttempts?: number;
};

export type UpdateQuizInput = {
  cmid: number;
  name?: string;
  intro?: string;
  timeOpen?: number;
  timeClose?: number;
  timeLimit?: number;
};
