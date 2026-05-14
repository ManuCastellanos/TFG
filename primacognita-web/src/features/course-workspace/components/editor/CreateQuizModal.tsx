import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import type { CreateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';

type CreateQuizModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  sectionNum: number;
  onSave: (input: CreateQuizInput) => void;
  loading?: boolean;
};

export function CreateQuizModal({
  open,
  onClose,
  courseId,
  sectionNum,
  onSave,
  loading,
}: CreateQuizModalProps) {
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [timeOpen, setTimeOpen] = useState('');
  const [timeClose, setTimeClose] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [maxAttempts, setMaxAttempts] = useState('-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      courseId,
      sectionNum,
      name,
      intro,
      timeOpen: timeOpen ? Math.floor(new Date(timeOpen).getTime() / 1000) : undefined,
      timeClose: timeClose ? Math.floor(new Date(timeClose).getTime() / 1000) : undefined,
      timeLimit: timeLimit ? Number(timeLimit) * 60 : undefined,
      maxAttempts: Number(maxAttempts),
    });
  };

  const handleClose = () => {
    setName('');
    setIntro('');
    setTimeOpen('');
    setTimeClose('');
    setTimeLimit('');
    setMaxAttempts('-1');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} width="md">
      <Modal.Header title="Nuevo cuestionario" onClose={handleClose} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--fg)">Título <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Título del cuestionario"
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
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-(--fg)">Apertura</label>
            <input
              type="datetime-local"
              value={timeOpen}
              onChange={(e) => setTimeOpen(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-(--fg)">Cierre</label>
            <input
              type="datetime-local"
              value={timeClose}
              onChange={(e) => setTimeClose(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-(--fg)">Límite de tiempo (min)</label>
            <input
              type="number"
              min="0"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
              placeholder="Sin límite"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-(--fg)">Máx. intentos</label>
            <input
              type="number"
              min="-1"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--fg) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
              placeholder="-1 = ilimitado"
            />
          </div>
        </div>
        <p className="text-xs text-(--fg-subtle)">Las preguntas se añaden desde Moodle tras crear el cuestionario.</p>
      </form>
      <Modal.Footer>
        <Button variant="ghost" type="button" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" type="button" onClick={handleSubmit as unknown as () => void} disabled={loading || !name}>
          {loading ? 'Creando…' : 'Crear cuestionario'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
