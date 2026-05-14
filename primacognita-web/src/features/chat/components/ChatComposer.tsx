import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useSendMessage } from '../hooks/useSendMessage';

type ChatComposerProps = {
  conversationId: number;
};

export function ChatComposer({ conversationId }: ChatComposerProps) {
  const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const sendMessage = useSendMessage(conversationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sendMessage.isPending) return;
    sendMessage.mutate(text.trim());
    setText('');
  };

  return (
    <div className="p-4 border-t border-(--border) bg-white">
      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="size-10 rounded-2xl bg-(--tint-50) hover:bg-(--tint-100) grid place-items-center text-lg shrink-0"
              title="Emoji"
            >
              😊
            </button>
            {showPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setText((prev) => prev + emojiData.emoji);
                    setShowPicker(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex-1 rounded-2xl border border-(--border) bg-(--tint-50) px-4 py-2.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim() || sendMessage.isPending}
            className="size-10 rounded-2xl bg-[#274E38] hover:brightness-110 disabled:opacity-40 text-white grid place-items-center shrink-0 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-(--fg-subtle) font-bold">
        <span>🛡️</span>
        <span>Tus mensajes son privados. Si algo te preocupa, díselo a tu profe o familia.</span>
      </div>
    </div>
  );
}
