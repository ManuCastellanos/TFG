import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import type { CreateUrlInput } from '@/modules/course/domain/CreateUrlInput';

type CreateUrlModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  sectionNum: number;
  onSave: (input: CreateUrlInput) => void;
  loading?: boolean;
};

export function CreateUrlModal({
  open,
  onClose,
  courseId,
  sectionNum,
  onSave,
  loading,
}: CreateUrlModalProps) {
  const [name, setName] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [intro, setIntro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ courseId, sectionNum, name, externalUrl, intro });
  };

  const handleClose = () => {
    setName('');
    setExternalUrl('');
    setIntro('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} width="md">
      <Modal.Header title="Nuevo enlace URL" onClose={handleClose} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Título <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Nombre del enlace"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">URL <span className="text-red-500">*</span></label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="https://ejemplo.com"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Descripción</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={2}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white resize-none focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Descripción opcional"
          />
        </div>
      </form>
      <Modal.Footer>
        <Button variant="ghost" type="button" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" type="button" onClick={handleSubmit as unknown as () => void} disabled={loading || !name || !externalUrl}>
          {loading ? 'Creando…' : 'Crear enlace'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
