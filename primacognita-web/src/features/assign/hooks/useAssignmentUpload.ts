import { useState, useCallback, useEffect, useRef } from 'react';
import type { AssignmentFile } from '@/modules/assignment/domain/AssignmentFile';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UploadedFile = {
  file: File;
  done: boolean;
};

type UseAssignmentUploadResult = {
  files: UploadedFile[];
  draftItemId: number | null;
  initializing: boolean;
  uploading: boolean;
  uploadError: string | null;
  addFiles: (newFiles: File[], maxFiles: number, maxSizeBytes: number) => Promise<void>;
  removeFile: (index: number) => void;
  reset: () => void;
};

function withToken(url: string, token: string): string {
  if (url.includes('token=')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}token=${token}`;
}

export function useAssignmentUpload(existingFiles?: AssignmentFile[]): UseAssignmentUploadResult {
  const { assignmentRepository } = useDependencies();
  const { token } = useSession();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [draftItemId, setDraftItemId] = useState<number | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // useRef guard prevents double-execution when deps change multiple times
  const initialized = useRef(false);

  useEffect(() => {
    // AssignUpload only mounts when assignment is fully loaded, so token and existingFiles
    // are both stable on first render — run once on mount, no deps needed
    if (!token || !existingFiles?.length) return;
    initialized.current = true;

    let cancelled = false;

    const init = async () => {
      setInitializing(true);
      setUploadError(null);
      try {
        const itemId = await assignmentRepository.getDraftItemId(token);
        if (cancelled) return;
        setDraftItemId(itemId);

        for (const ef of existingFiles) {
          if (cancelled) return;
          const url = withToken(ef.fileUrl, token);
          const res = await fetch(url);
          if (!res.ok) continue;
          const blob = await res.blob();
          const file = new File([blob], ef.filename, { type: ef.mimeType ?? blob.type });
          await assignmentRepository.uploadFileToDraft(token, file, itemId);
          if (cancelled) return;
          setFiles((prev) => [...prev, { file, done: true }]);
        }
      } catch {
        if (!cancelled) setUploadError('Error al cargar los archivos enviados anteriormente.');
      } finally {
        if (!cancelled) setInitializing(false);
      }
    };

    void init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addFiles = useCallback(async (newFiles: File[], maxFiles: number, maxSizeBytes: number) => {
    if (!token) return;
    setUploadError(null);

    for (const file of newFiles) {
      if (files.length >= maxFiles) {
        setUploadError(`Máximo ${maxFiles} archivo${maxFiles !== 1 ? 's' : ''} permitido${maxFiles !== 1 ? 's' : ''}.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        const mb = Math.round(maxSizeBytes / 1024 / 1024);
        setUploadError(`"${file.name}" supera el tamaño máximo de ${mb} MB.`);
        return;
      }
    }

    setUploading(true);
    try {
      let itemId = draftItemId;
      for (const file of newFiles) {
        if (itemId === null) {
          itemId = await assignmentRepository.uploadDraftFile(token, file);
          setDraftItemId(itemId);
        } else {
          await assignmentRepository.uploadFileToDraft(token, file, itemId);
        }
        setFiles((prev) => [...prev, { file, done: true }]);
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Error al subir el archivo.');
    } finally {
      setUploading(false);
    }
  }, [assignmentRepository, token, files.length, draftItemId]);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setDraftItemId(null);
    setUploadError(null);
    initialized.current = false;
  }, []);

  return { files, draftItemId, initializing, uploading, uploadError, addFiles, removeFile, reset };
}
