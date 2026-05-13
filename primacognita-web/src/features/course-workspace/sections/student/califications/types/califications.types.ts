export type ExerciseGrade = {
  id: number;
  title: string;
  kind: string;
  score: number | null;
  max: number | null;
};

export type TopicGrade = {
  sectionId: number;
  sectionName: string;
  sectionNumber: number;
  averageScore: number | null;
  maxScore: number;
  totalItems: number;
  completedItems: number;
  exercises: ExerciseGrade[];
};
