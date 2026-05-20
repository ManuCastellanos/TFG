import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
  watch: UseFormWatch<CreateQuizFormValues>;
};

function CheckboxIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`size-5 rounded-md border-2 flex items-center justify-center transition-colors mt-0.5 shrink-0 ${
        checked ? 'bg-[#274E38] border-[#274E38]' : 'bg-white border-(--border)'
      }`}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="size-3 text-white">
          <polyline points="1,6 4.5,9.5 11,2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export function BehaviourSection({ register, watch }: Props) {
  const shuffleQuestions = watch('shuffleQuestions');
  const shuffleAnswers = watch('shuffleAnswers');
  const showResultsImmediately = watch('showResultsImmediately');

  return (
    <FormSection icon="🎲" color="purple" title="Configuración">
      <div className="flex flex-col gap-4">
        <label className="relative flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('shuffleQuestions')} className="sr-only" />
          <CheckboxIndicator checked={shuffleQuestions} />
          <div>
            <p className="text-sm font-semibold text-(--fg) leading-snug">Mezclar preguntas</p>
            <p className="text-xs text-(--fg-muted) mt-0.5">Cada alumno verá las preguntas en un orden distinto.</p>
          </div>
        </label>

        <label className="relative flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('shuffleAnswers')} className="sr-only" />
          <CheckboxIndicator checked={shuffleAnswers} />
          <div>
            <p className="text-sm font-semibold text-(--fg) leading-snug">Mezclar respuestas</p>
            <p className="text-xs text-(--fg-muted) mt-0.5">Las opciones de cada pregunta se ordenan aleatoriamente.</p>
          </div>
        </label>

        <label className="relative flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('showResultsImmediately')} className="sr-only" />
          <CheckboxIndicator checked={showResultsImmediately} />
          <div>
            <p className="text-sm font-semibold text-(--fg) leading-snug">Mostrar respuestas al finalizar</p>
            <p className="text-xs text-(--fg-muted) mt-0.5">Los alumnos verán qué han acertado y fallado al terminar.</p>
          </div>
        </label>
      </div>
    </FormSection>
  );
}
