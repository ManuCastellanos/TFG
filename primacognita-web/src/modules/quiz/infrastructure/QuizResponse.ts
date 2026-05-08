export type QuizRaw = {
  id: number;
  coursemodule: number;
  name: string;
  intro?: string;
  timeopen?: number;
  timeclose?: number;
  grade?: number;
  gradepass?: number;
  grademethod?: number;
};

export type QuizzesApiResponse = {
  quizzes: QuizRaw[];
};

export const QUIZ_GRADING_METHOD: Record<number, string> = {
  1: 'Calificación más alta',
  2: 'Calificación media',
  3: 'Primer intento',
  4: 'Último intento',
};
