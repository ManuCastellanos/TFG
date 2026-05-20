import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section/FormSection';
import type { CreateAssignmentFormValues } from '../../types/create-assignment.types';

type Props = {
  register: UseFormRegister<CreateAssignmentFormValues>;
  watch: UseFormWatch<CreateAssignmentFormValues>;
};

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

export function SubmissionSettingsSection({ register, watch }: Props) {
  const submissionDrafts = watch('submissionDrafts');
  const sendNotifications = watch('sendNotifications');

  return (
    <FormSection icon="⚙️" color="blue" title="Ajustes de entrega">
      <div className="flex flex-col gap-4">
        <label className="relative flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('submissionDrafts')} className="sr-only" />
          <CheckboxIndicator checked={submissionDrafts} />
          <div>
            <p className="text-sm font-semibold text-(--fg) leading-snug">Requerir botón de envío</p>
            <p className="text-xs text-(--fg-muted) mt-0.5">
              Los alumnos deben confirmar la entrega. Hasta entonces se guarda como borrador.
            </p>
          </div>
        </label>

        <label className="relative flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('sendNotifications')} className="sr-only" />
          <CheckboxIndicator checked={sendNotifications} />
          <div>
            <p className="text-sm font-semibold text-(--fg) leading-snug">Notificar al recibir entregas</p>
            <p className="text-xs text-(--fg-muted) mt-0.5">
              Recibirás un aviso cada vez que un alumno entregue la tarea.
            </p>
          </div>
        </label>
      </div>
    </FormSection>
  );
}
