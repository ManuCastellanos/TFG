import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import type { CreateForumInput } from '@/modules/course/domain/CreateForumInput';

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  sectionNum: number;
  loading: boolean;
  onSave: (input: CreateForumInput) => void;
};

export function CreateForumModal({ open, onClose, courseId, sectionNum, loading, onSave }: Props) {
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ courseId, sectionNum, name: name.trim(), intro: intro.trim(), type: 'general' });
  };

  return (
    <Modal open={open} onClose={onClose} width="sm">
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-semibold text-(--fg) mb-1">Crear foro</h2>
          <p className="text-sm text-(--fg-muted)">Los alumnos podrán publicar y responder hilos de debate.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-(--fg)">Título *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Foro de dudas"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-(--border) text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-(--fg)">Descripción</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Descripción del foro (opcional)"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-(--border) text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading || !name.trim()}>
            {loading ? 'Creando…' : 'Crear foro'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
