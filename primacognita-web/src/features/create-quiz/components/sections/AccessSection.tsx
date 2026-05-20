import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
  watch: UseFormWatch<CreateQuizFormValues>;
};

export function AccessSection({ register, watch }: Props) {
  const visible = watch('visible');

  return (
    <FormSection icon="🔒" color="sky" title="Acceso">
      <label className="relative flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('visible')} className="sr-only" />
        <span
          className={`size-5 rounded-md border-2 flex items-center justify-center transition-colors mt-0.5 shrink-0 ${
            visible ? 'bg-[#274E38] border-[#274E38]' : 'bg-white border-(--border)'
          }`}
        >
          {visible && (
            <svg viewBox="0 0 12 12" className="size-3 text-white">
              <polyline points="1,6 4.5,9.5 11,2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-(--fg) leading-snug">Visible para los alumnos</p>
          <p className="text-xs text-(--fg-muted) mt-0.5">
            Si está desactivado, el cuestionario existe pero los alumnos no lo verán.
          </p>
        </div>
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-(--fg)">Contraseña de acceso</label>
          <span className="text-[10px] text-(--fg-subtle)">opcional</span>
        </div>
        <input
          type="text"
          {...register('password')}
          placeholder="Sin contraseña"
          className="rounded-xl border border-(--border) bg-white text-(--fg) px-4 py-2.5 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors text-sm"
        />
        <p className="text-xs text-(--fg-muted)">
          Si se establece, los alumnos deberán introducirla antes de empezar.
        </p>
      </div>
    </FormSection>
  );
}
