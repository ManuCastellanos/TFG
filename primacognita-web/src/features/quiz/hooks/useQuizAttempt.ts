import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { QuizAttempt } from '@/modules/quiz/domain/QuizAttempt';
import type { QuizQuestion, QuizAnswers } from '@/modules/quiz/domain/QuizQuestion';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UseQuizAttemptResult = {
  attempt: QuizAttempt | null;
  questions: QuizQuestion[];
  nextPage: number;
  answers: QuizAnswers;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setAnswer: (name: string, value: string) => void;
  navigateTo: (page: number) => void;
  submit: () => void;
};

export function useQuizAttempt(quizId: number): UseQuizAttemptResult {
  const { quizRepository } = useDependencies();
  const { token } = useSession();

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [nextPage, setNextPage] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef<QuizAttempt | null>(null);
  const answersRef = useRef<QuizAnswers>({});
  useLayoutEffect(() => {
    attemptRef.current = attempt;
    answersRef.current = answers;
  });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const started = await quizRepository.startAttempt(token, quizId);
        if (cancelled) return;
        const data = await quizRepository.getAttemptData(token, started.id, 0);
        if (cancelled) return;
        setAttempt(data.attempt);
        setQuestions(data.questions);
        setNextPage(data.nextPage);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al iniciar el cuestionario.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void init();
    return () => {
      cancelled = true;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [quizRepository, token, quizId]);

  const save = useCallback(async () => {
    const current = attemptRef.current;
    if (!token || !current) return;
    setSaving(true);
    try {
      await quizRepository.saveAttempt(token, current.id, answersRef.current);
    } catch {
      // silent fail on autosave
    } finally {
      setSaving(false);
    }
  }, [quizRepository, token]);

  const setAnswer = useCallback(
    (name: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [name]: value }));
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => void save(), 2000);
    },
    [save],
  );

  const navigateTo = useCallback(
    async (page: number) => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
        autosaveTimer.current = null;
      }
      await save();
      const current = attemptRef.current;
      if (!token || !current) return;
      setLoading(true);
      setError(null);
      try {
        const data = await quizRepository.getAttemptData(token, current.id, page);
        setAttempt(data.attempt);
        setQuestions(data.questions);
        setNextPage(data.nextPage);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar las preguntas.');
      } finally {
        setLoading(false);
      }
    },
    [quizRepository, token, save],
  );

  const submit = useCallback(async () => {
    if (!token) return;
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }
    const current = attemptRef.current;
    if (!current) return;
    setLoading(true);
    setError(null);
    try {
      const result = await quizRepository.processAttempt(token, current.id, answersRef.current);
      setAttempt(result.attempt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar el cuestionario.');
    } finally {
      setLoading(false);
    }
  }, [quizRepository, token]);

  return {
    attempt,
    questions,
    nextPage,
    answers,
    loading,
    saving,
    error,
    setAnswer,
    navigateTo: (page) => void navigateTo(page),
    submit: () => void submit(),
  };
}
