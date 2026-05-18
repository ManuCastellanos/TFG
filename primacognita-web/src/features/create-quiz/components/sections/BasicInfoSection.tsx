import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input/Input';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
  errors: FieldErrors<CreateQuizFormValues>;
};

export function BasicInfoSection({ register, errors }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Información básica</h2>

      <div className="flex flex-col gap-1">
        <Input
          {...register('name', { required: 'El nombre es obligatorio' })}
          placeholder="Nombre del cuestionario"
          required
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
          Instrucciones
        </label>
        <textarea
          {...register('intro')}
          rows={4}
          placeholder="Describe el cuestionario a los alumnos..."
          className="rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-4 py-3 w-full resize-none outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors duration-200 text-sm"
        />
      </div>
    </div>
  );
}
