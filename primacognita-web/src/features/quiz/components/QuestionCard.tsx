import { useState } from 'react';
import { ChevronDown, Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import type { QuizSlotQuestion } from '@/modules/quiz/domain/QuizQuestionBank';
import type { UpdateQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';

type Props = {
  question: QuizSlotQuestion;
  index: number;
  onDelete: () => void;
  isDeleting: boolean;
  onUpdate: (input: UpdateQuestionInput) => void;
  isUpdating: boolean;
};

const COLORS = [
  { soft: 'bg-sky-100',    text: 'text-sky-700',    border: 'border-sky-300'    },
  { soft: 'bg-violet-100', text: 'text-violet-700',  border: 'border-violet-300' },
  { soft: 'bg-lime-100',   text: 'text-lime-700',    border: 'border-lime-300'   },
  { soft: 'bg-orange-100', text: 'text-orange-700',  border: 'border-orange-300' },
  { soft: 'bg-amber-100',  text: 'text-amber-700',   border: 'border-amber-300'  },
  { soft: 'bg-emerald-100',text: 'text-emerald-700', border: 'border-emerald-300'},
];

export function QuestionCard({ question, index, onDelete, isDeleting, onUpdate, isUpdating }: Props) {
  const c = COLORS[index % COLORS.length];
  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [questionText, setQuestionText] = useState(question.questionText);
  const [answers, setAnswers] = useState(
    question.type === 'multichoice'
      ? question.answers.map((a) => a.text)
      : ['', ''],
  );
  const [multipleCorrect, setMultipleCorrect] = useState(
    question.type === 'multichoice' && question.answers.filter((a) => a.isCorrect).length > 1,
  );
  const [correctIndex, setCorrectIndex] = useState(
    question.type === 'multichoice' ? question.answers.findIndex((a) => a.isCorrect) : 0,
  );
  const [correctIndices, setCorrectIndices] = useState<number[]>(
    question.type === 'multichoice'
      ? question.answers.map((a, i) => (a.isCorrect ? i : -1)).filter((i) => i >= 0)
      : [],
  );
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer ?? true);

  const typeLabel = question.type === 'multichoice' ? 'Opción múltiple' : 'V o F';

  const handleDiscard = () => {
    setQuestionText(question.questionText);
    setAnswers(question.type === 'multichoice' ? question.answers.map((a) => a.text) : ['', '']);
    setCorrectIndex(question.type === 'multichoice' ? question.answers.findIndex((a) => a.isCorrect) : 0);
    setCorrectIndices(
      question.type === 'multichoice'
        ? question.answers.map((a, i) => (a.isCorrect ? i : -1)).filter((i) => i >= 0)
        : [],
    );
    setCorrectAnswer(question.correctAnswer ?? true);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!questionText.trim()) return;
    const input: UpdateQuestionInput = {
      cmid: 0, // filled by hook caller via onUpdate wrapper
      questionId: question.questionId,
      questionText: questionText.trim(),
    };
    if (question.type === 'multichoice') {
      const filled = answers.map((a) => a.trim()).filter(Boolean);
      if (filled.length < 2) return;
      input.answers = answers.map((a) => a.trim());
      if (multipleCorrect) {
        input.correctIndices = correctIndices;
      } else {
        input.correctIndex = correctIndex;
      }
    } else {
      input.correctAnswer = correctAnswer;
    }
    onUpdate(input);
    setIsEditing(false);
  };

  const toggleCorrectIndex = (i: number) => {
    setCorrectIndices((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  };

  const addAnswer = () => {
    if (answers.length < 6) setAnswers([...answers, '']);
  };

  const removeAnswer = (i: number) => {
    if (answers.length <= 2) return;
    const next = answers.filter((_, idx) => idx !== i);
    setAnswers(next);
    if (correctIndex >= next.length) setCorrectIndex(next.length - 1);
    setCorrectIndices((prev) => prev.filter((idx) => idx !== i).map((idx) => (idx > i ? idx - 1 : idx)));
  };

  return (
    <div className={`rounded-3xl border-2 bg-white transition ${
      isEditing ? `${c.border} shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]` : 'border-(--border) hover:border-(--fg-subtle)'
    }`}>
      {/* Header collapsed */}
      <header className="flex items-center gap-3 px-4 py-3">
        <div className={`size-11 rounded-2xl ${c.soft} ${c.text} grid place-items-center font-extrabold text-base shrink-0`}>
          {question.slot}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.soft} ${c.text}`}>
              {typeLabel}
            </span>
            <span className="text-[10px] font-extrabold text-(--fg-subtle)">1 punto</span>
          </div>
          <p className="text-sm font-extrabold text-(--fg) truncate">{question.questionText}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="size-9 grid place-items-center rounded-xl text-(--fg-muted) hover:bg-(--tint-100) transition"
            aria-label="Editar"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="size-9 grid place-items-center rounded-xl text-rose-500 hover:bg-rose-50 disabled:opacity-40 transition"
            aria-label="Eliminar"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="size-9 grid place-items-center rounded-xl text-(--fg-muted) hover:bg-(--tint-100) transition"
            aria-label={isEditing ? 'Cerrar' : 'Expandir'}
          >
            <ChevronDown className={`size-4 transition-transform ${isEditing ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </header>

      {/* Inline editor */}
      {isEditing && (
        <div className="px-4 pb-4 pt-2 border-t border-(--border)/60 flex flex-col gap-4">
          {/* Enunciado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
              Enunciado <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full rounded-2xl border border-(--border) bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none px-4 py-3 text-sm text-(--fg) resize-none transition"
            />
          </div>

          {/* Respuestas multichoice */}
          {question.type === 'multichoice' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
                  Respuestas{' '}
                  <span className="text-(--fg-subtle) font-bold">
                    {multipleCorrect ? '— marca todas las correctas' : '— marca la correcta'}
                  </span>
                </label>
                <label className="flex items-center gap-2 text-xs text-(--fg-muted) cursor-pointer">
                  <input
                    type="checkbox"
                    checked={multipleCorrect}
                    onChange={(e) => {
                      setMultipleCorrect(e.target.checked);
                      setCorrectIndices([correctIndex]);
                    }}
                    className="size-3.5 accent-[#274E38]"
                  />
                  Varias correctas
                </label>
              </div>
              {answers.map((a, i) => {
                const isCorrect = multipleCorrect ? correctIndices.includes(i) : correctIndex === i;
                return (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-2xl border-2 transition ${
                    isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-(--border) bg-white hover:border-(--fg-subtle)'
                  }`}>
                    <button
                      type="button"
                      onClick={() => {
                        if (multipleCorrect) toggleCorrectIndex(i);
                        else setCorrectIndex(i);
                      }}
                      className={`size-9 rounded-xl grid place-items-center font-extrabold text-sm transition shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-(--tint-100) text-(--fg-muted) hover:bg-(--tint-50)'
                      }`}
                      aria-label="Marcar como correcta"
                    >
                      {isCorrect
                        ? <Check className="size-4" strokeWidth={3} />
                        : String.fromCharCode(97 + i)
                      }
                    </button>
                    <input
                      type="text"
                      value={a}
                      onChange={(e) => {
                        const next = [...answers];
                        next[i] = e.target.value;
                        setAnswers(next);
                      }}
                      className="flex-1 bg-transparent text-sm text-(--fg) font-bold outline-none placeholder:text-(--fg-subtle)"
                      placeholder={`Opción ${i + 1}`}
                    />
                    {isCorrect && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 shrink-0">Correcta</span>
                    )}
                    {answers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeAnswer(i)}
                        className="size-7 grid place-items-center text-(--fg-subtle) hover:text-rose-500 rounded-lg shrink-0"
                        aria-label="Eliminar opción"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              {answers.length < 6 && (
                <button
                  type="button"
                  onClick={addAnswer}
                  className="flex items-center justify-center gap-1.5 mt-1 py-2.5 rounded-2xl border-2 border-dashed border-(--border) text-xs font-extrabold text-(--fg-muted) hover:bg-(--tint-50) hover:border-(--fg-subtle) transition"
                >
                  <Plus className="size-3.5" />
                  Añadir opción
                </button>
              )}
            </div>
          )}

          {/* Verdadero/Falso */}
          {question.type === 'truefalse' && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">Respuesta correcta</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(true)}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition ${
                    correctAnswer ? 'border-emerald-400 bg-emerald-50' : 'border-(--border) bg-white hover:border-(--fg-subtle)'
                  }`}
                >
                  <span className={`size-10 rounded-xl grid place-items-center transition ${
                    correctAnswer ? 'bg-emerald-500 text-white' : 'bg-(--tint-100) text-(--fg-muted)'
                  }`}>
                    <Check className="size-5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-extrabold text-(--fg)">Verdadero</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(false)}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition ${
                    !correctAnswer ? 'border-emerald-400 bg-emerald-50' : 'border-(--border) bg-white hover:border-(--fg-subtle)'
                  }`}
                >
                  <span className={`size-10 rounded-xl grid place-items-center transition ${
                    !correctAnswer ? 'bg-emerald-500 text-white' : 'bg-(--tint-100) text-(--fg-muted)'
                  }`}>
                    <X className="size-5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-extrabold text-(--fg)">Falso</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 rounded-2xl border border-(--border) text-sm font-bold text-(--fg-muted) hover:bg-(--tint-50) transition"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 disabled:opacity-60 transition"
            >
              <Check className="size-4" strokeWidth={2.5} />
              {isUpdating ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
