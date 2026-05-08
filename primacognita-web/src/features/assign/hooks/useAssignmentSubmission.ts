import { useState, useCallback } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UseAssignmentSubmissionResult = {
  saving: boolean;
  submitting: boolean;
  error: string | null;
  saveDraft: (assignId: number, draftItemId: number, note?: string) => Promise<void>;
  submit: (assignId: number, draftItemId: number, note?: string) => Promise<void>;
};

export function useAssignmentSubmission(): UseAssignmentSubmissionResult {
  const { assignmentRepository } = useDependencies();
  const { token } = useSession();

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveDraft = useCallback(async (assignId: number, draftItemId: number, note?: string) => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await assignmentRepository.saveSubmission(token, assignId, draftItemId, note);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar borrador.');
    } finally {
      setSaving(false);
    }
  }, [assignmentRepository, token]);

  const submit = useCallback(async (assignId: number, draftItemId: number, note?: string) => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await assignmentRepository.saveSubmission(token, assignId, draftItemId, note);
      await assignmentRepository.submitForGrading(token, assignId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar la entrega.');
    } finally {
      setSubmitting(false);
    }
  }, [assignmentRepository, token]);

  return { saving, submitting, error, saveDraft, submit };
}
