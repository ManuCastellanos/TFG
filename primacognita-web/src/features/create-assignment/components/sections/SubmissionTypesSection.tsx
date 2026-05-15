import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input/Input';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
  watch: UseFormWatch<CreateAssignmentFormValues>;
};

export function SubmissionTypesSection({ register, watch }: Props) {
  const allowFile = watch('allowFile');
  const allowText = watch('allowText');

  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Tipos de entrega</h2>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('allowFile')}
            className="size-4 accent-[#274E38] cursor-pointer"
          />
          <span className="text-sm font-medium text-(--fg)">Archivos adjuntos</span>
        </label>

        {allowFile && (
          <div className="flex flex-col gap-3 pl-6 border-l-2 border-(--border)">
            <div className="flex flex-col gap-1">
              <Input
                {...register('maxFileSubmissions', { min: 1, max: 20, valueAsNumber: true })}
                type="number"
                placeholder="Máximo de archivos por entrega"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                {...register('acceptedFileTypes')}
                placeholder="Tipos aceptados (ej: .pdf, .docx, image/*)"
              />
              <p className="text-[11px] text-(--fg-muted)">
                Déjalo vacío para aceptar cualquier tipo de archivo
              </p>
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('allowText')}
            className="size-4 accent-[#274E38] cursor-pointer"
          />
          <span className="text-sm font-medium text-(--fg)">Texto en línea</span>
        </label>
      </div>

      {!allowFile && !allowText && (
        <p className="text-sm text-red-500">
          Debes habilitar al menos un tipo de entrega
        </p>
      )}
    </div>
  );
}
