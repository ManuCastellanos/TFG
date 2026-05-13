import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { ForumPost } from '@/modules/forum/domain/ForumPost';

type CommentItemProps = {
  post: ForumPost;
};

export function CommentItem({ post }: CommentItemProps) {
  if (post.isdeleted) {
    return (
      <div className="ml-9 px-4 py-2 rounded-xl bg-neutral-50 border border-dashed border-neutral-200 text-sm text-(--fg-muted) italic">
        Este mensaje fue eliminado.
      </div>
    );
  }

  const colorIdx = (post.author.id ?? 0) % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];
  const initial = post.author.fullname?.charAt(0).toUpperCase() ?? '?';
  const date = post.timecreated
    ? new Date(post.timecreated * 1000).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="flex gap-3">
      <div
        className={`size-7 shrink-0 rounded-full bg-gradient-to-br ${color.grad} grid place-items-center text-white text-[10px] font-bold`}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-sm text-(--fg) truncate">
            {post.author.fullname}
          </span>
          <span className="text-xs text-(--fg-muted) shrink-0">{date}</span>
        </div>
        <div
          className="text-sm text-(--fg-muted) leading-relaxed [&_a]:text-emerald-600 overflow-x-hidden break-words [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: post.message }}
        />
      </div>
    </div>
  );
}
