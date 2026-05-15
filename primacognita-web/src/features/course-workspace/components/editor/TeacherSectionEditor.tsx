import { useState, useRef, useEffect } from 'react';

type TeacherSectionEditorProps = {
  sectionName: string;
  sectionSummary: string;
  onSave: (name: string, summary: string) => void;
  onCancel: () => void;
};

export function TeacherSectionEditor({ sectionName, sectionSummary, onSave, onCancel }: TeacherSectionEditorProps) {
  const [name, setName] = useState(sectionName);
  const [summary, setSummary] = useState(sectionSummary ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
  };

  return (
    <div className="p-3 rounded-2xl bg-emerald-50/40 mb-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border-2 border-emerald-300 bg-white text-sm font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <textarea
        ref={textareaRef}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        onInput={handleInput}
        rows={1}
        className="w-full px-3 py-2 rounded-xl border-2 border-emerald-300 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <div className="flex gap-2 mt-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm font-bold text-(--fg-muted) hover:text-(--fg) transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(name, summary)}
          className="px-3 py-1.5 text-sm font-bold bg-[#274E38] text-white rounded-xl hover:brightness-110 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
