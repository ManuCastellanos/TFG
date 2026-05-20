import type { UseFormRegister } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

const numberInputClass =
  'rounded-xl border border-(--border) bg-white text-(--fg) px-4 py-2.5 w-24 text-center outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
};

export function GradingSection({ register }: Props) {
  return (
    <FormSection icon="⭐" color="sky" title="Calificación">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-(--fg) whitespace-nowrap">
            Nota máxima <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('maxGrade', { required: true, min: 1, valueAsNumber: true })}
            className={numberInputClass}
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-(--fg) whitespace-nowrap">Para aprobar</label>
          <span className="text-[10px] text-(--fg-subtle)">opc.</span>
          <input
            type="number"
            {...register('gradePass', { min: 0, valueAsNumber: true })}
            placeholder="—"
            className={numberInputClass}
          />
        </div>
      </div>
    </FormSection>
  );
}
