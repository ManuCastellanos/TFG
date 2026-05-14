import { Button } from '@/components/ui/button/Button';
import type { AssignmentFile } from '@/modules/assignment/domain/AssignmentFile';
import { useSession } from '@/shared/hooks/useSession';

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function withToken(url: string, token: string): string {
  if (url.includes('token=')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}token=${token}`;
}

type Props = {
  files: AssignmentFile[];
  onRemove?: (index: number) => void;
  showDownload?: boolean;
};

export function AssignmentFilesList({ files, onRemove, showDownload }: Props) {
  const { token } = useSession();

  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {files.map((f, i) => (
        <div key={f.fileUrl ?? f.filename} className="flex items-center gap-3 p-3 rounded-2xl border border-(--border) bg-(--tint-50)">
          <div className="size-11 rounded-xl bg-rose-100 text-rose-700 grid place-items-center text-xl shrink-0">📄</div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-sm text-(--fg) truncate">{f.filename}</div>
            <div className="text-xs text-(--fg-muted)">
              {formatSize(f.fileSize)}
              {f.uploadedAt ? ` · ${formatDate(f.uploadedAt)}` : ''}
            </div>
          </div>
          {showDownload && token && (
            <a
              href={withToken(f.fileUrl, token)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-white border border-(--border) text-xs font-extrabold text-(--fg) hover:bg-(--tint-100)"
            >
              Descargar
            </a>
          )}
          {onRemove && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => onRemove(i)}
              className="size-9 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-base"
              aria-label={`Eliminar ${f.filename}`}
            >
              ×
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
