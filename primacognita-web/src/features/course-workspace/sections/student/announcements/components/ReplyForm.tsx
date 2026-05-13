import { useState } from 'react';
import { Button } from '@/components/ui/button/Button';

type ReplyFormProps = {
  onSubmit: (message: string) => Promise<void>;
  onCancel: () => void;
};

export function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(message.trim());
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu respuesta…"
        rows={3}
        autoFocus
        className="w-full px-4 py-2.5 rounded-xl border border-(--border) bg-white text-sm outline-none resize-y focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
      />
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-(--fg-muted) hover:text-(--fg) transition"
        >
          Cancelar
        </button>
        <Button type="submit" disabled={!message.trim() || submitting}>
          {submitting ? 'Enviando…' : 'Responder'}
        </Button>
      </div>
    </form>
  );
}
