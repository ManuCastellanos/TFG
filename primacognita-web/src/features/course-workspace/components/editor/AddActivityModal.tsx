import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import type { CreateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';
import type { CreateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';
import type { CreateResourceInput } from '@/modules/course/domain/CreateResourceInput';
import type { CreateForumInput } from '@/modules/course/domain/CreateForumInput';

type ActivityType = 'assignment' | 'quiz' | 'resource' | 'forum';

type AddActivityModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  sectionNum: number;
  onCreateAssignment: (input: CreateAssignmentInput) => void;
  onCreateQuiz: (input: CreateQuizInput) => void;
  onCreateResource: (input: CreateResourceInput) => void;
  onCreateForum: (input: CreateForumInput) => void;
  createAssignmentPending: boolean;
  createQuizPending: boolean;
  createResourcePending: boolean;
  createForumPending: boolean;
};

const ACTIVITY_TYPES: { type: ActivityType; emoji: string; label: string; description: string }[] = [
  {
    type: 'resource',
    emoji: '📄',
    label: 'Subir fichero',
    description: 'Un archivo PDF, imagen o documento para descargar',
  },
  {
    type: 'assignment',
    emoji: '📝',
    label: 'Crear tarea',
    description: 'Una actividad para entregar con fecha límite',
  },
  {
    type: 'quiz',
    emoji: '🧩',
    label: 'Crear cuestionario',
    description: 'Preguntas tipo test con calificación automática',
  },
  { type: 'forum', emoji: '💬', label: 'Crear foro', description: 'Un espacio de debate para los alumnos' },
];

export function AddActivityModal({
  open,
  onClose,
  courseId,
  sectionNum,
  onCreateAssignment,
  onCreateQuiz,
  onCreateResource,
  onCreateForum,
  createAssignmentPending,
  createQuizPending,
  createResourcePending,
  createForumPending,
}: AddActivityModalProps) {
  const [step, setStep] = useState<'select' | 'config'>('select');
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);

  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxGrade, setMaxGrade] = useState('10');

  const handleClose = () => {
    setStep('select');
    setSelectedType(null);
    setName('');
    setIntro('');
    setDueDate('');
    setMaxGrade('10');
    onClose();
  };

  const handleSelectType = (type: ActivityType) => {
    setSelectedType(type);
    setStep('config');
  };

  const handleSubmit = () => {
    if (!selectedType) return;

    switch (selectedType) {
      case 'assignment':
        onCreateAssignment({
          courseId,
          sectionNum,
          name,
          intro,
          dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
          maxGrade: Number(maxGrade),
          allowFile: true,
          allowText: false,
        });
        handleClose();
        break;
      case 'quiz':
        onCreateQuiz({ courseId, sectionNum, name, intro });
        handleClose();
        break;
      case 'resource':
        onCreateResource({ courseId, sectionNum, name, intro, draftItemId: 0 });
        handleClose();
        break;
      case 'forum':
        onCreateForum({ courseId, sectionNum, name, intro });
        handleClose();
        break;
    }
  };

  const isPending =
    selectedType === 'assignment'
      ? createAssignmentPending
      : selectedType === 'quiz'
        ? createQuizPending
        : selectedType === 'resource'
          ? createResourcePending
          : selectedType === 'forum'
            ? createForumPending
            : false;

  return (
    <Modal open={open} onClose={handleClose} width={step === 'select' ? 'lg' : 'md'}>
      <Modal.Header
        title={step === 'select' ? 'Añadir actividad' : `Configurar: ${selectedType}`}
        onClose={handleClose}
      />

      {step === 'select' ? (
        <div className="px-7 py-6">
          <div className="grid grid-cols-2 gap-3">
            {ACTIVITY_TYPES.map(({ type, emoji, label, description }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectType(type)}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-(--border) bg-white hover:border-emerald-300 hover:shadow-sm transition text-center"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="font-extrabold text-sm text-(--fg)">{label}</span>
                <span className="text-xs text-(--fg-muted)">{description}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--fg)">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Nombre de la actividad"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--fg)">Descripción</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Instrucciones para los alumnos"
            />
          </div>

          {selectedType === 'assignment' && (
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-medium text-(--fg)">Fecha de entrega</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-xl border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                  className="rounded-xl border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'config' && (
        <Modal.Footer>
          <Button variant="ghost" type="button" onClick={() => setStep('select')}>
            Atrás
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit} disabled={!name || isPending}>
            {isPending ? 'Creando…' : 'Crear'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
