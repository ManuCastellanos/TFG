import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
  watch: UseFormWatch<CreateQuizFormValues>;
};

export function TimingSection({ register, watch }: Props) {
  const timeLimitEnabled = watch('timeLimitEnabled');

  return (
    <FormSection icon="⏱️" color="amber" title="Tiempo límite">
      <label className="relative flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('timeLimitEnabled')} className="sr-only" />
        <span
          className={`size-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
            timeLimitEnabled ? 'bg-[#274E38] border-[#274E38]' : 'bg-white border-(--border)'
          }`}
        >
          {timeLimitEnabled && (
            <svg viewBox="0 0 12 12" className="size-3 text-white">
              <polyline points="1,6 4.5,9.5 11,2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm font-semibold text-(--fg)">Activar límite de tiempo</span>
      </label>

      {timeLimitEnabled && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={300}
            {...register('timeLimitCustomMinutes', { valueAsNumber: true, min: 1 })}
            className="w-24 rounded-xl border border-(--border) bg-white text-(--fg) px-3 py-2 text-sm outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-sm text-(--fg-muted)">minutos</span>
        </div>
      )}
    </FormSection>
  );
}
