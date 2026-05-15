import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
};

export function ConfirmDeleteModal({ open, onClose, onConfirm, loading, title, message }: Props) {
  return (
    <Modal open={open} onClose={onClose} width="sm">
      <div className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-(--fg)">{title ?? '¿Eliminar esta actividad?'}</h2>
          <p className="text-sm text-(--fg-muted)">{message ?? 'Esta acción no se puede deshacer.'}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
