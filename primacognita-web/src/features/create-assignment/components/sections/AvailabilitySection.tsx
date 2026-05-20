import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

const dateInputClass =
  'rounded-xl border border-(--border) bg-white text-(--fg) px-4 py-2.5 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors text-sm';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
  watch: UseFormWatch<CreateAssignmentFormValues>;
};

export function AvailabilitySection({ register, watch }: Props) {
  const cutoffSameAsDue = watch('cutoffSameAsDue');

  return (
    <FormSection icon="⏰" color="orange" title="Disponibilidad">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-(--fg)">Disponible desde</label>
          <input type="datetime-local" {...register('allowSubmissionsFromDate')} className={dateInputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-(--fg)">
            Fecha de entrega <span className="text-red-500">*</span>
          </label>
          <input type="datetime-local" {...register('dueDate')} className={dateInputClass} />
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" {...register('cutoffSameAsDue')} className="sr-only" />
        <span
          className={`size-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            cutoffSameAsDue ? 'bg-[#274E38] border-[#274E38]' : 'bg-white border-(--border)'
          }`}
        >
          {cutoffSameAsDue && (
            <svg viewBox="0 0 12 12" className="size-2.5 text-white">
              <polyline points="1,6 4.5,9.5 11,2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm text-(--fg-muted)">Fecha límite igual que la fecha de entrega</span>
      </label>

      {!cutoffSameAsDue && (
        <div className="flex flex-col gap-1.5 pl-6">
          <label className="text-xs font-bold text-(--fg)">Fecha límite</label>
          <input type="datetime-local" {...register('cutoffDate')} className={dateInputClass} />
        </div>
      )}
    </FormSection>
  );
}
