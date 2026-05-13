import { useState } from 'react';
import { Alert } from '@/components/ui/alert/Alert';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import { useDiscussionPosts, useAddDiscussionPost } from '../hooks/useAnnouncements';
import { ReplyForm } from './ReplyForm';
import { CommentItem } from './CommentItem';
import type { ForumDiscussion } from '@/modules/forum/domain/ForumDiscussion';

type ArticleCardProps = {
  discussion: ForumDiscussion;
};

export function ArticleCard({ discussion }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { data: posts, isError, error } = useDiscussionPosts(discussion.discussion);
  const addPost = useAddDiscussionPost(discussion.discussion);
  const colorIdx = discussion.userid % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];
  const initials = (discussion.userfullname ?? '?').charAt(0).toUpperCase();
  const date = new Date(discussion.created * 1000).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleReply = async (message: string) => {
    await addPost.mutateAsync({
      postId: discussion.id,
      subject: discussion.subject,
      message,
    });
  };

  return (
    <article
      className={`rounded-3xl border bg-white p-6 ${
        discussion.pinned
          ? 'border-amber-300 ring-1 ring-amber-200'
          : 'border-(--border)'
      }`}
    >
      {discussion.pinned && (
        <div className="flex items-center gap-1.5 mb-3 text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
          📌 Mensaje destacado
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div
          className={`size-11 rounded-2xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold`}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-(--fg) text-sm leading-tight">
            {discussion.userfullname ?? 'Usuario'}
          </div>
          <div className="text-xs text-(--fg-muted)">profesor/a · {date}</div>
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-(--fg) mb-2 leading-tight">
        {discussion.name}
      </h3>

      <div
        className="text-(--fg-muted) leading-relaxed mb-4 [&_a]:text-emerald-600 overflow-x-hidden break-words [&_img]:max-w-full [&_table]:w-full [&_table]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: discussion.message }}
      />

      <div className="flex items-center justify-between pt-4 border-t border-dashed border-(--border)">
        <div />
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-extrabold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition"
        >
          💬 {discussion.numreplies}{' '}
          {discussion.numreplies === 1 ? 'comentario' : 'comentarios'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {isError && (
            <Alert variant="error">Error cargando comentarios: {String(error)}</Alert>
          )}

          {addPost.error && (
            <Alert variant="error">
              Error al responder: {(addPost.error as Error).message}
            </Alert>
          )}

          <div className="space-y-3">
            {(posts ?? [])
              .filter((p) => p.id !== discussion.id)
              .map((post) => (
                <CommentItem key={post.id} post={post} />
              ))}
          </div>

          {discussion.canreply && (
            <ReplyForm onSubmit={handleReply} onCancel={() => setExpanded(false)} />
          )}
        </div>
      )}
    </article>
  );
}
