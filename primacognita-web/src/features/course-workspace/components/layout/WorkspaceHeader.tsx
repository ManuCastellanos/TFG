import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';

type WorkspaceHeaderProps = {
  title: string | undefined | null;
  emoji: string;
  colorSoft: string;
  onBack: () => void;
};

export const WorkspaceHeader = ({ title, emoji, colorSoft, onBack }: WorkspaceHeaderProps) => (
  <div className="flex items-center gap-4 min-w-0">
    <Button variant="outline" size="icon" type="button" onClick={onBack} aria-label="Volver a cursos">
      <ArrowLeft className="size-5" />
    </Button>
    <div className={`size-14 shrink-0 rounded-2xl ${colorSoft} grid place-items-center text-4xl`}>{emoji}</div>
    <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">{title ?? 'Curso'}</h1>
  </div>
);
