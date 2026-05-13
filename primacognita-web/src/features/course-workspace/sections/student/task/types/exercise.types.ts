export type ExerciseKind = 'assign' | 'quiz' | 'workshop' | 'h5pactivity' | 'lesson';
export type ExerciseState = 'pending' | 'submitted' | 'graded' | 'late';

export interface EnrichedExercise {
  id: number;
  cmid: number;
  title: string;
  kind: ExerciseKind;
  topic: string;
  dueTimestamp: number | null;
  state: ExerciseState;
  score: number | null;
  max: number | null;
  isInternal: boolean;
}
