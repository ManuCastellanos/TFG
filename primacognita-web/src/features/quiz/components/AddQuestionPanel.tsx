import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Alert } from '@/components/ui/alert/Alert';
import type { CreateQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';

type Props = {
  cmid: number;
  nextNumber: number;
  onAdd: (input: CreateQuestionInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
};

export function AddQuestionPanel({ cmid, nextNumber, onAdd, onCancel, isLoading, error }: Props) {
  const [qtype, setQtype] = useState<'multichoice' | 'truefalse'>('multichoice');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['', '']);
  const [multipleCorrect, setMultipleCorrect] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctIndices, setCorrectIndices] = useState<number[]>([0]);
  const [correctAnswer, setCorrectAnswer] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    const name = questionText.slice(0, 80).trim();
    if (qtype === 'multichoice') {
      const filled = answers.filter((a) => a.trim());
      if (filled.length < 2) return;
      if (multipleCorrect) {
        if (correctIndices.length === 0) return;
        onAdd({ cmid, qtype, name, questionText, answers: answers.map((a) => a.trim()), correctIndices });
      } else {
        onAdd({ cmid, qtype, name, questionText, answers: answers.map((a) => a.trim()), correctIndex });
      }
    } else {
      onAdd({ cmid, qtype, name, questionText, correctAnswer });
    }
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

  const toggleCorrectIndex = (i: number) => {
    setCorrectIndices((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  };

  return (
    <section className="rounded-3xl border border-(--border) bg-white overflow-hidden">
      {/* Section header */}
      <header className="flex items-center gap-3 px-5 py-4 bg-amber-50 border-b border-amber-200">
        <div className="size-10 rounded-2xl bg-white text-amber-700 grid place-items-center text-xl shadow-sm">✨</div>
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-base text-amber-700 leading-tight">Nueva pregunta</h2>
          <p className="text-xs text-(--fg-muted) font-bold mt-0.5">Pregunta {nextNumber}</p>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full bg-white text-amber-700">
          Editando
        </span>
      </header>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
        {error && <Alert variant="error">{error}</Alert>}

        {/* Tipo de pregunta */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">Tipo de pregunta</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setQtype('multichoice')}
              className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition ${
                qtype === 'multichoice'
                  ? 'border-amber-400 bg-amber-50 shadow-[0_0_0_4px_rgba(251,191,36,0.12)]'
                  : 'border-(--border) bg-white hover:border-(--fg-subtle)'
              }`}
            >
              <span className="size-10 rounded-2xl bg-violet-100 text-violet-700 grid place-items-center text-xl shrink-0">🔘</span>
              <span className="flex-1">
                <span className="block text-sm font-extrabold text-(--fg) leading-tight">Opción múltiple</span>
                <span className="block text-[11px] text-(--fg-muted) font-bold mt-0.5">Varias respuestas, una o más correctas</span>
              </span>
              {qtype === 'multichoice' && (
                <span className="size-5 rounded-full bg-amber-500 text-white grid place-items-center shrink-0">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setQtype('truefalse')}
              className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition ${
                qtype === 'truefalse'
                  ? 'border-amber-400 bg-amber-50 shadow-[0_0_0_4px_rgba(251,191,36,0.12)]'
                  : 'border-(--border) bg-white hover:border-(--fg-subtle)'
              }`}
            >
              <span className="size-10 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-xl shrink-0">✓✗</span>
              <span className="flex-1">
                <span className="block text-sm font-extrabold text-(--fg) leading-tight">Verdadero o Falso</span>
                <span className="block text-[11px] text-(--fg-muted) font-bold mt-0.5">Pregunta directa, dos opciones</span>
              </span>
              {qtype === 'truefalse' && (
                <span className="size-5 rounded-full bg-amber-500 text-white grid place-items-center shrink-0">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Enunciado */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
              Enunciado <span className="text-rose-500">*</span>
            </label>
          </div>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            required
            placeholder="Escribe la pregunta..."
            className="w-full rounded-2xl border border-(--border) bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none px-4 py-3 text-sm text-(--fg) placeholder:text-(--fg-subtle) resize-none transition"
          />
        </div>

        {/* Respuestas multichoice */}
        {qtype === 'multichoice' && (
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
                    {isCorrect ? <Check className="size-4" strokeWidth={3} /> : String.fromCharCode(97 + i)}
                  </button>
                  <input
                    type="text"
                    value={a}
                    onChange={(e) => {
                      const next = [...answers];
                      next[i] = e.target.value;
                      setAnswers(next);
                    }}
                    placeholder={`Opción ${i + 1}`}
                    className="flex-1 bg-transparent text-sm text-(--fg) font-bold outline-none placeholder:text-(--fg-subtle)"
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
        {qtype === 'truefalse' && (
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

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl border border-(--border) text-sm font-bold text-(--fg-muted) hover:bg-(--tint-50) transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 disabled:opacity-60 transition"
          >
            <Check className="size-4" strokeWidth={2.5} />
            {isLoading ? 'Guardando...' : 'Guardar pregunta'}
          </button>
        </div>
      </form>
    </section>
  );
}
