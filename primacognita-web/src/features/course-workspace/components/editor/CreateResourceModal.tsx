import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { CreateResourceInput } from '@/modules/course/domain/CreateResourceInput';

type CreateResourceModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  sectionNum: number;
  token: string;
  onSave: (input: CreateResourceInput) => void;
  loading?: boolean;
};

export function CreateResourceModal({
  open,
  onClose,
  courseId,
  sectionNum,
  token,
  onSave,
  loading,
}: CreateResourceModalProps) {
  const { assignmentRepository } = useDependencies();
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const draftItemId = await assignmentRepository.uploadDraftFile(token, file);
      onSave({ courseId, sectionNum, name, intro, draftItemId });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setIntro('');
    setFile(null);
    onClose();
  };

  const busy = loading || uploading;

  return (
    <Modal open={open} onClose={handleClose} width="md">
      <Modal.Header title="Subir archivo" onClose={handleClose} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Título <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Nombre del recurso"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Archivo <span className="text-red-500">*</span></label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none"
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
        <Button variant="ghost" type="button" onClick={handleClose} disabled={busy}>Cancelar</Button>
        <Button variant="primary" type="button" onClick={handleSubmit as unknown as () => void} disabled={busy || !name || !file}>
          {busy ? 'Subiendo…' : 'Subir archivo'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
