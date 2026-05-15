import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { CreateSectionInput, UpdateSectionInput } from '@/modules/course/domain/CreateSectionInput';
import type { CreateResourceInput } from '@/modules/course/domain/CreateResourceInput';
import type { CreateUrlInput } from '@/modules/course/domain/CreateUrlInput';
import type { CreateForumInput } from '@/modules/course/domain/CreateForumInput';
import type { CreateAssignmentInput, UpdateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';
import type { CreateQuizInput, UpdateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';

export function useCourseEditor(courseId: string, token: string | null) {
  const { courseRepository, assignmentRepository, quizRepository } = useDependencies();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.courses.contents(courseId) });

  const createSection = useMutation({
    mutationFn: (input: CreateSectionInput) => courseRepository.createSection(token!, input),
    onSuccess: invalidate,
  });

  const updateSection = useMutation({
    mutationFn: (input: UpdateSectionInput) => courseRepository.updateSection(token!, input),
    onSuccess: invalidate,
  });

  const createAssignment = useMutation({
    mutationFn: (input: CreateAssignmentInput) => assignmentRepository.createAssignment(token!, input),
    onSuccess: invalidate,
  });

  const updateAssignment = useMutation({
    mutationFn: (input: UpdateAssignmentInput) => assignmentRepository.updateAssignment(token!, input),
    onSuccess: invalidate,
  });

  const createResource = useMutation({
    mutationFn: (input: CreateResourceInput) => courseRepository.createResource(token!, input),
    onSuccess: invalidate,
  });

  const createUrl = useMutation({
    mutationFn: (input: CreateUrlInput) => courseRepository.createUrl(token!, input),
    onSuccess: invalidate,
  });

  const createForum = useMutation({
    mutationFn: (input: CreateForumInput) => courseRepository.createForum(token!, input),
    onSuccess: invalidate,
  });

  const createQuiz = useMutation({
    mutationFn: (input: CreateQuizInput) => quizRepository.createQuiz(token!, input),
    onSuccess: invalidate,
  });

  const updateQuiz = useMutation({
    mutationFn: (input: UpdateQuizInput) => quizRepository.updateQuiz(token!, input),
    onSuccess: invalidate,
  });

  const deleteModule = useMutation({
    mutationFn: (cmid: number) => courseRepository.deleteModule(token!, cmid),
    onSuccess: invalidate,
  });

  const deleteSection = useMutation({
    mutationFn: ({ sectionId }: { sectionId: number }) =>
      courseRepository.deleteSection(token!, Number(courseId), sectionId),
    onSuccess: invalidate,
  });

  return {
    createSection,
    updateSection,
    createAssignment,
    updateAssignment,
    createResource,
    createUrl,
    createForum,
    createQuiz,
    updateQuiz,
    deleteModule,
    deleteSection,
  };
}
