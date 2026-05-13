import { useState } from 'react';
import { Button } from '@/components/ui/button/Button';

type NewDiscussionFormProps = {
  onSubmit: (subject: string, message: string) => Promise<void>;
  onCancel: () => void;
};

export function NewDiscussionForm({ onSubmit, onCancel }: NewDiscussionFormProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(subject.trim(), message.trim());
      setSubject('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Asunto del anuncio"
        className="w-full px-4 py-2.5 rounded-xl border border-(--border) bg-white text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu anuncio aquí…"
        rows={4}
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
        <Button type="submit" disabled={!subject.trim() || !message.trim() || submitting}>
          {submitting ? 'Publicando…' : 'Publicar anuncio'}
        </Button>
      </div>
    </form>
  );
}
