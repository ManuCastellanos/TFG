import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { ChatMessage } from '@/modules/chat/domain/ChatMessage';
import type { ChatConversationMember } from '@/modules/chat/domain/ChatConversation';

type MessageBubbleProps = {
  message: ChatMessage;
  isMine: boolean;
  member: ChatConversationMember | undefined;
  showAvatar: boolean;
};

export function MessageBubble({ message, isMine, member, showAvatar }: MessageBubbleProps) {
  const time = new Date(message.timecreated * 1000).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const colorIdx = (member?.id ?? 0) % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];

  return (
    <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : ''}`}>
      {!isMine && (
        showAvatar && member ? (
          member.profileimageurl ? (
            <img src={member.profileimageurl} alt={member.fullname} className="size-8 rounded-xl object-cover shrink-0" />
          ) : (
            <div className={`size-8 rounded-xl bg-gradient-to-br ${color.grad} grid place-items-center text-white text-xs font-extrabold shrink-0`}>
              {member.fullname.charAt(0).toUpperCase()}
            </div>
          )
        ) : (
          <div className="size-8 shrink-0" />
        )
      )}
      <div
        className={`max-w-md px-4 py-2.5 rounded-2xl ${
          isMine
            ? 'bg-[#274E38] text-white rounded-br-md'
            : 'bg-white border border-(--border) text-(--fg) rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`text-[10px] mt-1 font-bold ${isMine ? 'text-emerald-100' : 'text-(--fg-subtle)'}`}>{time}</div>
      </div>
    </div>
  );
}
