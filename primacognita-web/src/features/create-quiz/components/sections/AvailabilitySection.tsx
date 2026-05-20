import type { UseFormRegister } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

const dateInputClass =
  'rounded-xl border border-(--border) bg-white text-(--fg) px-4 py-2.5 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors text-sm';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
};

export function AvailabilitySection({ register }: Props) {
  return (
    <FormSection icon="⏰" color="orange" title="Disponibilidad">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-(--fg)">Apertura</label>
          <input type="datetime-local" {...register('openDate')} className={dateInputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-(--fg)">Cierre</label>
          <input type="datetime-local" {...register('closeDate')} className={dateInputClass} />
        </div>
      </div>
    </FormSection>
  );
}
