import { useState, useRef, useEffect } from 'react';
import { Plus, ClipboardList, HelpCircle, FileUp, Link } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';

type ActivityType = 'assignment' | 'quiz' | 'resource' | 'url';

type AddActivityButtonProps = {
  onSelect: (type: ActivityType) => void;
};

const OPTIONS: { type: ActivityType; icon: React.ReactNode; label: string }[] = [
  { type: 'assignment', icon: <ClipboardList className="size-4" />, label: 'Tarea' },
  { type: 'quiz', icon: <HelpCircle className="size-4" />, label: 'Cuestionario' },
  { type: 'resource', icon: <FileUp className="size-4" />, label: 'Subir archivo' },
  { type: 'url', icon: <Link className="size-4" />, label: 'Enlace URL' },
];

export function AddActivityButton({ onSelect }: AddActivityButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <Button
        variant="success"
        size="sm"
        type="button"
        className="flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <Plus className="size-4" />
        Añadir actividad
      </Button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-(--border) rounded-2xl shadow-lg py-1 min-w-[180px]">
          {OPTIONS.map(({ type, icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setOpen(false);
                onSelect(type);
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-(--fg) hover:bg-(--tint-50) transition"
            >
              <span className="text-(--fg-muted)">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
