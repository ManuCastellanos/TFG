import { Button } from '@/components/ui/button/Button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface Props {
  currentPage: number;
  nextPage: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuizNavigation({ currentPage, nextPage, loading, onPrev, onNext, onSubmit }: Props) {
  const isFirst = currentPage === 0;
  const isLast = nextPage === -1;

  return (
    <div className="flex items-center justify-between pt-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onPrev}
        disabled={isFirst || loading}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>

      {isLast ? (
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Send className="size-4" />
          Enviar intento
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onNext}
          disabled={loading}
          className="flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
