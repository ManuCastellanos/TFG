import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useForumByCourse(courseId: string) {
  const { token } = useSession();
  const { forumRepository } = useDependencies();

  return useQuery({
    queryKey: queryKeys.forum.forumsByCourse(Number(courseId)),
    queryFn: () => forumRepository.getForumsByCourse(token!, Number(courseId)),
    enabled: !!token && !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForumDiscussions(forumId: number | null) {
  const { token } = useSession();
  const { forumRepository } = useDependencies();

  return useQuery({
    queryKey: queryKeys.forum.discussions(forumId ?? 0),
    queryFn: () => forumRepository.getForumDiscussions(token!, forumId!),
    enabled: !!token && forumId !== null,
    staleTime: 30 * 1000,
  });
}

export function useDiscussionPosts(discussionId: number | null) {
  const { token } = useSession();
  const { forumRepository } = useDependencies();

  return useQuery({
    queryKey: queryKeys.forum.posts(discussionId ?? 0),
    queryFn: () => forumRepository.getDiscussionPosts(token!, discussionId!),
    enabled: !!token && discussionId !== null,
    staleTime: 30 * 1000,
  });
}

export function useAddDiscussion(forumId: number) {
  const { token } = useSession();
  const { forumRepository } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subject, message }: { subject: string; message: string }) =>
      forumRepository.addDiscussion(token!, forumId, subject, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.discussions(forumId) });
    },
  });
}

export function useAddDiscussionPost(discussionId: number) {
  const { token } = useSession();
  const { forumRepository } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, subject, message }: { postId: number; subject: string; message: string }) =>
      forumRepository.addDiscussionPost(token!, postId, subject, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.posts(discussionId) });
    },
  });
}
