import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import type { CreateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';

type CreateAssignmentModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  sectionNum: number;
  onSave: (input: CreateAssignmentInput) => void;
  loading?: boolean;
};

export function CreateAssignmentModal({
  open,
  onClose,
  courseId,
  sectionNum,
  onSave,
  loading,
}: CreateAssignmentModalProps) {
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxGrade, setMaxGrade] = useState('10');
  const [allowFile, setAllowFile] = useState(true);
  const [allowText, setAllowText] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      courseId,
      sectionNum,
      name,
      intro,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      maxGrade: Number(maxGrade),
      allowFile,
      allowText,
    });
  };

  const handleClose = () => {
    setName('');
    setIntro('');
    setDueDate('');
    setMaxGrade('10');
    setAllowFile(true);
    setAllowText(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} width="md">
      <Modal.Header title="Nueva tarea" onClose={handleClose} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Título <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Título de la tarea"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Descripción</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white resize-none focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Instrucciones de la tarea"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-(--fg)">Fecha de entrega</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-28">
            <label className="text-sm font-medium text-(--fg)">Nota máxima</label>
            <input
              type="number"
              min="0"
              max="100"
              value={maxGrade}
              onChange={(e) => setMaxGrade(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-(--fg)">Tipos de entrega</span>
          <label className="flex items-center gap-2 text-sm text-(--fg-muted) cursor-pointer">
            <input
              type="checkbox"
              checked={allowFile}
              onChange={(e) => setAllowFile(e.target.checked)}
              className="rounded"
            />
            Subida de archivos
          </label>
          <label className="flex items-center gap-2 text-sm text-(--fg-muted) cursor-pointer">
            <input
              type="checkbox"
              checked={allowText}
              onChange={(e) => setAllowText(e.target.checked)}
              className="rounded"
            />
            Texto en línea
          </label>
        </div>
      </form>
      <Modal.Footer>
        <Button variant="ghost" type="button" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" type="button" onClick={handleSubmit as unknown as () => void} disabled={loading || !name}>
          {loading ? 'Creando…' : 'Crear tarea'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
