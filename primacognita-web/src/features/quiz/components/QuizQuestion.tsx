import { useEffect, useLayoutEffect, useRef } from 'react';
import type { QuizQuestion as QuizQuestionType } from '@/modules/quiz/domain/QuizQuestion';

interface Props {
  question: QuizQuestionType;
  onAnswerChange: (name: string, value: string) => void;
}

export default function QuizQuestion({ question, onAnswerChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef(onAnswerChange);
  useLayoutEffect(() => {
    handlerRef.current = onAnswerChange;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handle = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (target.name) handlerRef.current(target.name, target.value);
    };

    container.addEventListener('change', handle);
    container.addEventListener('input', handle);
    return () => {
      container.removeEventListener('change', handle);
      container.removeEventListener('input', handle);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-lg border border-(--border) bg-(--surface) p-6"
      dangerouslySetInnerHTML={{ __html: question.html }}
    />
  );
}
