import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { QuizAttempt } from '@/modules/quiz/domain/QuizAttempt';
import type { QuizQuestion, QuizAnswers } from '@/modules/quiz/domain/QuizQuestion';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';
import { parseQuizQuestion } from '@/features/quiz/utils/parseQuizQuestion';

type UseQuizAttemptResult = {
  attempt: QuizAttempt | null;
  questions: QuizQuestion[];
  answers: QuizAnswers;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setAnswer: (name: string, value: string) => void;
  clearAnswer: (name: string) => void;
  submit: () => void;
};

export function useQuizAttempt(quizId: number): UseQuizAttemptResult {
  const { quizRepository } = useDependencies();
  const { token, userId } = useSession();

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef<QuizAttempt | null>(null);
  const answersRef = useRef<QuizAnswers>({});
  const hiddenRef = useRef<QuizAnswers>({});
  const passwordRef = useRef<string | undefined>(undefined);

  useLayoutEffect(() => {
    attemptRef.current = attempt;
    answersRef.current = answers;
  });

  useEffect(() => {
    if (!token || !userId) return;
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const password = sessionStorage.getItem(`qp_${quizId}`) ?? undefined;
        passwordRef.current = password;

        const existing = await quizRepository.getUserAttempts(token, quizId, Number(userId));
        if (cancelled) return;
        const inprogress = existing.find((a) => a.state === 'inprogress');
        let attemptId: number;
        if (inprogress) {
          attemptId = inprogress.id;
        } else {
          attemptId = (await quizRepository.startAttempt(token, quizId, password)).id;
        }
        if (cancelled) return;

        
        const allQuestions: QuizQuestion[] = [];
        let page = 0;
        let lastAttempt = null;
        do {
          const data = await quizRepository.getAttemptData(token, attemptId, page, password);
          if (cancelled) return;
          allQuestions.push(...data.questions);
          lastAttempt = data.attempt;
          page = data.nextPage === -1 ? -1 : data.nextPage;
        } while (page !== -1);

        const hidden: QuizAnswers = {};
        allQuestions.forEach((q) => {
          const parsed = parseQuizQuestion(q.html);
          parsed.hiddenInputs.forEach(({ name, value }) => {
            hidden[name] = value;
          });
        });
        hiddenRef.current = hidden;

        setAttempt(lastAttempt);
        setQuestions(allQuestions);
      } catch (e) {
        if (!cancelled) {
          const raw = e instanceof Error ? e.message : '';
          if (raw.includes('noquestionsfound')) {
            setError('Este cuestionario no tiene preguntas. Contacta con tu profesor.');
          } else {
            setError(raw || 'Error al iniciar el cuestionario.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void init();
    return () => {
      cancelled = true;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [quizRepository, token, userId, quizId]);

  const buildPayload = (): QuizAnswers => ({
    ...hiddenRef.current,
    ...answersRef.current,
  });

  const save = useCallback(async () => {
    const current = attemptRef.current;
    if (!token || !current) return;
    setSaving(true);
    try {
      await quizRepository.saveAttempt(token, current.id, buildPayload(), passwordRef.current);
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

  const clearAnswer = useCallback(
    (name: string) => {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => void save(), 2000);
    },
    [save],
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
      await quizRepository.processAttempt(token, current.id, buildPayload(), passwordRef.current);
      sessionStorage.removeItem(`qp_${quizId}`);
      setAttempt((prev) => (prev ? { ...prev, state: 'finished' } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar el cuestionario.');
    } finally {
      setLoading(false);
    }
  }, [quizRepository, token, quizId]);

  return {
    attempt,
    questions,
    answers,
    loading,
    saving,
    error,
    setAnswer,
    clearAnswer,
    submit: () => void submit(),
  };
}
