import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button/Button';

type Props = {
  maxFiles: number;
  maxSizeBytes: number;
  currentCount: number;
  onFilesSelected: (files: File[]) => void;
};

export function AssignmentDropzone({ maxFiles, maxSizeBytes, currentCount, onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const maxMb = Math.round(maxSizeBytes / 1024 / 1024);
  const remaining = maxFiles - currentCount;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    onFilesSelected(Array.from(fileList).slice(0, remaining));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition select-none ${
        dragging
          ? 'border-violet-400 bg-violet-100/60'
          : 'border-violet-300 bg-violet-50/50 hover:bg-violet-50'
      }`}
    >
      <div className="size-16 rounded-2xl bg-violet-100 text-violet-700 grid place-items-center text-3xl mx-auto mb-4">
        ⬆️
      </div>
      <h3 className="text-lg font-semibold text-(--fg) mb-1">Arrastra y suelta tus archivos aquí</h3>
      <p className="text-sm text-(--fg-muted) mb-5">o haz clic para elegirlos del ordenador</p>
      <Button
        variant="primary"
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="px-5 py-2.5"
      >
        Seleccionar archivos
      </Button>
      <div className="mt-5 flex items-center justify-center gap-4 text-xs text-(--fg-subtle) font-bold">
        <span>📦 Máx {maxMb} MB</span>
        <span>·</span>
        <span>📎 Hasta {maxFiles} {maxFiles === 1 ? 'archivo' : 'archivos'}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
