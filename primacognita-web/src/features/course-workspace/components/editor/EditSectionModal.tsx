import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import type { UpdateSectionInput } from '@/modules/course/domain/CreateSectionInput';

type EditSectionModalProps = {
  open: boolean;
  onClose: () => void;
  sectionId: number;
  initialName: string;
  initialSummary: string;
  onSave: (input: UpdateSectionInput) => void;
  loading?: boolean;
};

export function EditSectionModal({
  open,
  onClose,
  sectionId,
  initialName,
  initialSummary,
  onSave,
  loading,
}: EditSectionModalProps) {
  const [name, setName] = useState(initialName);
  const [summary, setSummary] = useState(initialSummary);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ sectionId, name, summary });
  };

  return (
    <Modal open={open} onClose={onClose} width="md">
      <Modal.Header title="Editar tema" onClose={onClose} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Nombre del tema</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Nombre del tema"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Descripción</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white resize-none focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Descripción opcional del tema"
          />
        </div>
      </form>
      <Modal.Footer>
        <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" type="button" onClick={handleSubmit as unknown as () => void} disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
