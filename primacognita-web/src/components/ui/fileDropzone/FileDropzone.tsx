import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button/Button';

type FileDropzoneProps = {
  maxFiles?: number;
  maxSizeBytes?: number;
  currentCount?: number;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
};

export function FileDropzone({
  maxFiles = 1,
  maxSizeBytes,
  currentCount = 0,
  accept,
  onFilesSelected,
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const maxMb = maxSizeBytes ? Math.round(maxSizeBytes / 1024 / 1024) : null;
  const remaining = maxFiles - currentCount;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || disabled) return;
    onFilesSelected(Array.from(fileList).slice(0, remaining));
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => !disabled && e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition select-none ${
        disabled
          ? 'border-(--border) bg-(--tint-50) opacity-50 cursor-not-allowed'
          : dragging
            ? 'border-emerald-400 bg-emerald-50/60'
            : 'border-(--border) bg-(--tint-50) hover:bg-(--tint-100)'
      }`}
    >
      <div className="size-14 rounded-2xl bg-white border-2 border-(--border) grid place-items-center text-2xl mx-auto mb-3">
        📎
      </div>
      <h3 className="text-base font-semibold text-(--fg) mb-1">Arrastra y suelta archivos aquí</h3>
      <p className="text-sm text-(--fg-muted) mb-4">o haz clic para elegirlos del ordenador</p>
      <Button
        variant="outline"
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Seleccionar archivos
      </Button>
      {(maxMb !== null || maxFiles > 1) && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-(--fg-subtle) font-bold">
          {maxMb !== null && <span>📦 Máx {maxMb} MB</span>}
          {maxMb !== null && maxFiles > 1 && <span>·</span>}
          {maxFiles > 1 && (
            <span>📎 Hasta {maxFiles} {maxFiles === 1 ? 'archivo' : 'archivos'}</span>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
