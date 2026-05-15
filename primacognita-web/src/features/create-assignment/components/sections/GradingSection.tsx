import type { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input/Input';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
};

export function GradingSection({ register }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Calificación</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Input
            {...register('maxGrade', { required: true, min: 1, valueAsNumber: true })}
            type="number"
            placeholder="Nota máxima"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            {...register('gradePass', { min: 0, valueAsNumber: true })}
            type="number"
            placeholder="Nota para aprobar (opcional)"
          />
        </div>
      </div>
    </div>
  );
}
