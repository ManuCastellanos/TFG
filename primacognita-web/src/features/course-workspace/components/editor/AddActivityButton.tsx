import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';

type ActivityType = 'assignment' | 'quiz' | 'resource' | 'url' | 'forum';

type AddActivityButtonProps = {
  onSelect: (type: ActivityType) => void;
};

const OPTIONS: { type: ActivityType; emoji: string; label: string; sublabel: string; soft: string; text: string }[] = [
  {
    type: 'quiz',
    emoji: '🧩',
    label: 'Crear cuestionario',
    sublabel: 'Cuestionario',
    soft: 'bg-green-100',
    text: 'text-green-700',
  },
  {
    type: 'assignment',
    emoji: '📝',
    label: 'Crear tarea',
    sublabel: 'Tarea',
    soft: 'bg-violet-100',
    text: 'text-violet-700',
  },
  {
    type: 'forum',
    emoji: '📣',
    label: 'Crear foro',
    sublabel: 'Foro',
    soft: 'bg-neutral-100',
    text: 'text-neutral-600',
  },
  {
    type: 'resource',
    emoji: '📄',
    label: 'Subir archivo',
    sublabel: 'Archivo',
    soft: 'bg-neutral-100',
    text: 'text-neutral-600',
  },
];

export function AddActivityButton({ onSelect }: AddActivityButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="success"
        size="md"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
      >
        {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
        Añadir actividad
      </Button>

      {open && (
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map(({ type, emoji, label, sublabel, soft, text }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setOpen(false);
                onSelect(type);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-(--border) bg-white hover:border-(--fg-muted) hover:shadow-sm transition text-left w-full"
            >
              <div className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${soft}`}>
                <span>{emoji}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-(--fg) text-[15px] leading-tight">{label}</span>
                <span className={`text-xs font-bold ${text}`}>{sublabel}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
