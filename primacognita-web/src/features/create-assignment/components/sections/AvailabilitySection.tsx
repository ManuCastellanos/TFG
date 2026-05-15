import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

const dateInputClass =
  'rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-4 py-3 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors duration-200 text-sm';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
  watch: UseFormWatch<CreateAssignmentFormValues>;
};

export function AvailabilitySection({ register, watch }: Props) {
  const cutoffSameAsDue = watch('cutoffSameAsDue');

  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Disponibilidad</h2>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Disponible desde
        </label>
        <input type="datetime-local" {...register('allowSubmissionsFromDate')} className={dateInputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Fecha de entrega
        </label>
        <input type="datetime-local" {...register('dueDate')} className={dateInputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('cutoffSameAsDue')}
            className="size-4 accent-[#274E38] cursor-pointer"
          />
          <span className="text-sm text-(--fg-muted)">
            Fecha límite igual que la fecha de entrega
          </span>
        </label>

        {!cutoffSameAsDue && (
          <div className="flex flex-col gap-1 pl-6">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
              Fecha límite
            </label>
            <input type="datetime-local" {...register('cutoffDate')} className={dateInputClass} />
          </div>
        )}
      </div>
    </div>
  );
}
