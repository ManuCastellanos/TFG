import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { ChatConversation } from '@/modules/chat/domain/ChatConversation';

type ConversationItemProps = {
  conversation: ChatConversation;
  active: boolean;
  onClick: () => void;
  currentUserId: number;
};

export function ConversationItem({ conversation, active, onClick, currentUserId }: ConversationItemProps) {
  const otherMember = conversation.members.find((m) => m.id !== currentUserId) ?? conversation.members[0];
  const colorIdx = (otherMember?.id ?? 0) % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];
  const displayName = conversation.name || otherMember?.fullname || 'Usuario';
  const initials = displayName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const lastText = conversation.lastMessage?.text ?? '';
  const cleaned = lastText.replace(/<[^>]+>/g, '').trim();
  const preview = cleaned.length > 60 ? cleaned.slice(0, 60) + '…' : cleaned;

  const time = conversation.lastMessage?.timecreated
    ? new Date(conversation.lastMessage.timecreated * 1000).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 text-left transition border-b border-(--border)/50 ${
        active ? 'bg-white' : 'hover:bg-white/60'
      }`}
    >
      <div className="relative shrink-0">
        {otherMember?.profileimageurl ? (
          <img
            src={otherMember.profileimageurl}
            alt={displayName}
            className="size-12 rounded-2xl object-cover shadow-sm"
          />
        ) : (
          <div
            className={`size-12 rounded-2xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold shadow-sm`}
          >
            {initials}
          </div>
        )}
        {otherMember?.isonline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-400 border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="font-extrabold text-sm text-(--fg) truncate">{displayName}</span>
          <span className="text-[10px] font-bold text-(--fg-subtle) shrink-0">{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-(--fg-muted) truncate flex-1">{preview || 'Sin mensajes'}</span>
          {conversation.unreadcount > 0 && (
            <span className="size-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold grid place-items-center shrink-0">
              {conversation.unreadcount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
