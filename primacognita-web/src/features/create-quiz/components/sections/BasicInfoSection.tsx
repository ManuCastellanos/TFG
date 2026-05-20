import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input/Input';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
  errors: FieldErrors<CreateQuizFormValues>;
};

export function BasicInfoSection({ register, errors }: Props) {
  return (
    <FormSection icon="📝" color="emerald" title="Información básica">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-(--fg)">
          Nombre del cuestionario <span className="text-red-500">*</span>
        </label>
        <Input
          {...register('name', { required: 'El nombre es obligatorio' })}
          placeholder="Nombre del cuestionario"
          required
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-(--fg)">Instrucciones</label>
        <textarea
          {...register('intro')}
          rows={3}
          placeholder="Describe el cuestionario a los alumnos..."
          className="rounded-2xl border border-(--border) bg-white outline-none px-4 py-3 text-sm text-(--fg) resize-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors"
        />
      </div>
    </FormSection>
  );
}
