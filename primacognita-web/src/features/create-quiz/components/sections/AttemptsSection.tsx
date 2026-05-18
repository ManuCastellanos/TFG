import type { UseFormRegister } from 'react-hook-form';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
};

export function AttemptsSection({ register }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Intentos</h2>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Intentos permitidos
        </label>
        <select
          {...register('maxAttempts')}
          className="rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-4 py-3 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors duration-200 text-sm"
        >
          <option value="0">Ilimitados</option>
          <option value="1">1 intento</option>
          <option value="2">2 intentos</option>
          <option value="3">3 intentos</option>
        </select>
      </div>
    </div>
  );
}
