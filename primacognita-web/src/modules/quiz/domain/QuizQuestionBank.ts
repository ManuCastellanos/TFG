export type QuizSlotQuestion = {
  slot: number;
  slotId: number;
  questionId: number;
  type: 'multichoice' | 'truefalse';
  name: string;
  questionText: string;
  answers: { text: string; isCorrect: boolean }[];
  correctAnswer?: boolean;
};

export type DeleteQuestionInput = {
  cmid: number;
  slotId: number;
};

export type CreateQuestionInput = {
  cmid: number;
  qtype: 'multichoice' | 'truefalse';
  name: string;
  questionText: string;
  answers?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  correctAnswer?: boolean;
};

export type UpdateQuestionInput = {
  cmid: number;
  questionId: number;
  questionText: string;
  answers?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  correctAnswer?: boolean;
};
