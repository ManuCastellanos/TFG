import { Trash2 } from 'lucide-react';
import type { QuizSlotQuestion } from '@/modules/quiz/domain/QuizQuestionBank';

type Props = {
  question: QuizSlotQuestion;
  onDelete: () => void;
  isDeleting: boolean;
};

export function QuestionSlotCard({ question, onDelete, isDeleting }: Props) {
  const typeLabel = question.type === 'multichoice' ? 'Opción múltiple' : 'Verdadero / Falso';

  return (
    <div className="rounded-2xl border border-(--border) bg-white p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-(--fg-muted) shrink-0">{question.slot}</span>
          <p className="text-sm font-medium text-(--fg)">{question.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-(--fg-muted) bg-(--surface) border border-(--border) rounded-lg px-2 py-0.5">
            {typeLabel}
          </span>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1 rounded-lg text-(--fg-muted) hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition"
            aria-label="Eliminar pregunta"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {question.type === 'multichoice' && question.answers.length > 0 && (
        <div className="flex flex-col gap-1 pl-5">
          {question.answers.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                a.isCorrect ? 'border-green-500 bg-green-500' : 'border-(--border)'
              }`}>
                {a.isCorrect && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              <span className={`text-xs ${a.isCorrect ? 'font-semibold text-green-700' : 'text-(--fg-muted)'}`}>
                {a.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {question.type === 'truefalse' && (
        <div className="flex gap-3 pl-5">
          {[{ label: 'Verdadero', value: true }, { label: 'Falso', value: false }].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                question.correctAnswer === value ? 'border-green-500 bg-green-500' : 'border-(--border)'
              }`}>
                {question.correctAnswer === value && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              <span className={`text-xs ${question.correctAnswer === value ? 'font-semibold text-green-700' : 'text-(--fg-muted)'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
