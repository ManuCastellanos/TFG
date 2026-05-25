import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { CreateQuestionInput, DeleteQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';

export function useEditQuestions(cmid: number) {
  const { token } = useSession();
  const { quizRepository } = useDependencies();
  const queryClient = useQueryClient();
  const [showAddPanel, setShowAddPanel] = useState(false);

  const questionsQuery = useQuery({
    queryKey: queryKeys.quizQuestions.byCmid(cmid),
    queryFn: () => quizRepository.getQuizQuestions(token!, cmid),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateQuestionInput) => quizRepository.createQuestion(token!, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.quizQuestions.byCmid(cmid) });
      setShowAddPanel(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (input: DeleteQuestionInput) => quizRepository.deleteQuestion(token!, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.quizQuestions.byCmid(cmid) });
    },
  });

  return {
    questions: questionsQuery.data ?? [],
    isLoading: questionsQuery.isLoading,
    showAddPanel,
    setShowAddPanel,
    addQuestion: createMutation.mutate,
    isAdding: createMutation.isPending,
    addError: createMutation.error ? (createMutation.error as Error).message : null,
    deleteQuestion: (slotId: number) => deleteMutation.mutate({ cmid, slotId }),
    isDeleting: deleteMutation.isPending,
    deletingSlotId: deleteMutation.isPending ? (deleteMutation.variables as DeleteQuestionInput).slotId : null,
  };
}
