import { Modal } from '@/components/ui/modal/Modal';
import type { ProfileTutor } from '@/modules/profile/domain/Profile';

type FamilyContactModalProps = {
  open: boolean;
  onClose: () => void;
  tutor: ProfileTutor | null;
};

export function FamilyContactModal({ open, onClose, tutor }: FamilyContactModalProps) {
  return (
    <Modal open={open} onClose={onClose} width="sm">
      <Modal.Header title={tutor?.nombre || 'Contacto'} subtitle="Datos de contacto" onClose={onClose} />
      <div className="p-6 flex flex-col gap-4">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-1">Nombre</div>
          <div className="font-extrabold text-(--fg)">{tutor?.nombre || 'Sin especificar'}</div>
        </div>
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-1">Email</div>
          <div className="font-extrabold text-(--fg)">{tutor?.email || 'Sin especificar'}</div>
        </div>
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-1">Teléfono</div>
          <div className="font-extrabold text-(--fg)">{tutor?.telefono || 'Sin especificar'}</div>
        </div>
      </div>
      <Modal.Footer>
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-2xl text-sm font-extrabold text-(--fg-muted) hover:bg-(--tint-100)">
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
}
