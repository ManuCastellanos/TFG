import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

const inputClass =
  'rounded-xl border border-(--border) bg-white text-(--fg) px-4 py-2.5 w-full outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring) transition-colors text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function CheckboxIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`size-5 rounded-md border-2 flex items-center justify-center transition-colors mt-0.5 shrink-0 ${
        checked ? 'bg-[#274E38] border-[#274E38]' : 'bg-white border-(--border)'
      }`}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="size-3 text-white">
          <polyline points="1,6 4.5,9.5 11,2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
  watch: UseFormWatch<CreateAssignmentFormValues>;
};

export function SubmissionTypesSection({ register, watch }: Props) {
  const allowFile = watch('allowFile');
  const allowText = watch('allowText');

  return (
    <FormSection icon="📤" color="violet" title="Cómo entregan">
      <label className="relative flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('allowFile')} className="sr-only" />
        <CheckboxIndicator checked={allowFile} />
        <div>
          <p className="text-sm font-semibold text-(--fg) leading-snug">Archivos adjuntos</p>
        </div>
      </label>

      {allowFile && (
        <div className="flex flex-col gap-3 pl-8 border-l-2 border-(--border)">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-(--fg) whitespace-nowrap">Máximo de archivos</label>
            <input
              type="number"
              {...register('maxFileSubmissions', { min: 1, max: 20, valueAsNumber: true })}
              className={`${inputClass} w-20 text-center`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-(--fg)">Tipos aceptados</label>
            <input
              type="text"
              {...register('acceptedFileTypes')}
              placeholder="Ej: .pdf, .docx, image/* — vacío = cualquiera"
              className={inputClass}
            />
          </div>
        </div>
      )}

      <label className="relative flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('allowText')} className="sr-only" />
        <CheckboxIndicator checked={allowText} />
        <div>
          <p className="text-sm font-semibold text-(--fg) leading-snug">Texto en línea</p>
        </div>
      </label>

      {!allowFile && !allowText && (
        <p className="text-xs text-red-500">Debes habilitar al menos un tipo de entrega.</p>
      )}
    </FormSection>
  );
}
