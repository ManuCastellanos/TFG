import type { UseFormRegister } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
};

export function AttemptsSection({ register }: Props) {
  return (
    <FormSection icon="🔁" color="rose" title="Intentos">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-(--fg)">Intentos permitidos</label>
        <select
          {...register('maxAttempts')}
          className="rounded-xl border border-(--border) bg-white text-(--fg) px-4 py-2.5 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors text-sm"
        >
          <option value="0">Ilimitados</option>
          <option value="1">1 intento</option>
          <option value="2">2 intentos</option>
          <option value="3">3 intentos</option>
        </select>
      </div>
    </FormSection>
  );
}
