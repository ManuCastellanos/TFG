import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import type { CreateQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';

type Props = {
  cmid: number;
  onAdd: (input: CreateQuestionInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
};

const inputClass =
  'rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-4 py-3 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors duration-200 text-sm';

export function AddQuestionPanel({ cmid, onAdd, onCancel, isLoading, error }: Props) {
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

  const addAnswerField = () => {
    if (answers.length < 6) setAnswers([...answers, '']);
  };

  const removeAnswerField = (i: number) => {
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
    <div className="rounded-3xl border-2 border-(--color-pr)/40 bg-white p-5 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-(--fg)">Nueva pregunta</h3>

      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Tipo */}
        <div className="flex gap-2">
          {(['multichoice', 'truefalse'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setQtype(t)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                qtype === t
                  ? 'border-(--color-pr) bg-(--color-pr)/5 text-(--fg)'
                  : 'border-(--border) text-(--fg-muted) hover:border-(--fg-muted)'
              }`}
            >
              {t === 'multichoice' ? 'Opción múltiple' : 'Verdadero o Falso'}
            </button>
          ))}
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
            Pregunta
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={2}
            required
            placeholder="Escribe la pregunta..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Opciones múltiple */}
        {qtype === 'multichoice' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
                Respuestas{' '}
                <span className="text-(--fg-subtle)">
                  {multipleCorrect ? '(marca todas las correctas)' : '(marca la correcta)'}
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-(--fg-muted)">
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
            {answers.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                {multipleCorrect ? (
                  <input
                    type="checkbox"
                    checked={correctIndices.includes(i)}
                    onChange={() => toggleCorrectIndex(i)}
                    className="size-4 accent-[#274E38] shrink-0"
                  />
                ) : (
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    className="size-4 accent-[#274E38] shrink-0"
                  />
                )}
                <input
                  type="text"
                  value={a}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  placeholder={`Opción ${i + 1}`}
                  className={inputClass}
                  required
                />
                {answers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeAnswerField(i)}
                    className="text-(--fg-muted) hover:text-red-500 shrink-0"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ))}
            {answers.length < 6 && (
              <button
                type="button"
                onClick={addAnswerField}
                className="flex items-center gap-1 text-xs text-(--fg-muted) hover:text-(--fg) w-fit"
              >
                <Plus className="size-3" /> Añadir opción
              </button>
            )}
          </div>
        )}

        {/* Verdadero/Falso */}
        {qtype === 'truefalse' && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
              Respuesta correcta
            </label>
            <div className="flex gap-4">
              {[{ label: 'Verdadero', value: true }, { label: 'Falso', value: false }].map(({ label, value }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === value}
                    onChange={() => setCorrectAnswer(value)}
                    className="size-4 accent-[#274E38]"
                  />
                  <span className="text-sm text-(--fg)">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="outline" size="sm" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar pregunta'}
          </Button>
        </div>
      </form>
    </div>
  );
}
