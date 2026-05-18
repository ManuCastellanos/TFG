import type { UseFormRegister } from 'react-hook-form';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

const dateInputClass =
  'rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-4 py-3 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors duration-200 text-sm';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
};

export function AvailabilitySection({ register }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Disponibilidad</h2>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Apertura
        </label>
        <input type="datetime-local" {...register('openDate')} className={dateInputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Cierre
        </label>
        <input type="datetime-local" {...register('closeDate')} className={dateInputClass} />
      </div>
    </div>
  );
}
