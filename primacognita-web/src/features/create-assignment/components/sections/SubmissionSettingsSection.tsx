import type { UseFormRegister } from 'react-hook-form';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
};

export function SubmissionSettingsSection({ register }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Configuración de entrega</h2>

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('submissionDrafts')}
            className="size-4 accent-[#274E38] cursor-pointer mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-(--fg)">Requerir botón de envío</p>
            <p className="text-xs text-(--fg-muted)">
              Los alumnos deben hacer clic en "Enviar" para confirmar su entrega. Hasta entonces se guarda como borrador.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('sendNotifications')}
            className="size-4 accent-[#274E38] cursor-pointer mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-(--fg)">Notificar al recibir entregas</p>
            <p className="text-xs text-(--fg-muted)">
              Recibirás un aviso cada vez que un alumno entregue la tarea.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
