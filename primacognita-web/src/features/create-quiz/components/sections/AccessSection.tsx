import type { UseFormRegister } from 'react-hook-form';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
};

export function AccessSection({ register }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Acceso</h2>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register('visible')}
          className="size-4 accent-[#274E38] cursor-pointer mt-0.5 shrink-0"
        />
        <div>
          <p className="text-sm font-medium text-(--fg)">Visible para los alumnos</p>
          <p className="text-xs text-(--fg-muted)">
            Si está desactivado, el cuestionario existe pero los alumnos no lo verán.
          </p>
        </div>
      </label>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Contraseña de acceso
        </label>
        <input
          type="text"
          {...register('password')}
          placeholder="Sin contraseña"
          className="rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-4 py-3 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors duration-200 text-sm"
        />
        <p className="text-xs text-(--fg-muted)">
          Si se establece, los alumnos deberán introducirla antes de empezar.
        </p>
      </div>
    </div>
  );
}
