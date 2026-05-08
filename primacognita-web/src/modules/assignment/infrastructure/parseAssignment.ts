import type { AssignmentRaw } from './AssignmentResponse';

const DEFAULT_MAX_FILES = 1;
const DEFAULT_MAX_SIZE = 52428800; // 50 MB

export function parseAssignment(raw: AssignmentRaw) {
  const configs = raw.configs ?? [];

  const getConfig = (plugin: string, name: string) =>
    configs.find((c) => c.plugin === plugin && c.name === name)?.value;

  const maxFilesStr = getConfig('file', 'maxfilesubmissions');
  const maxSizeStr = getConfig('file', 'maxsubmissionsizebytes');
  const fileTypesStr = getConfig('file', 'filetypeslist');

  const maxFiles = maxFilesStr ? parseInt(maxFilesStr, 10) : DEFAULT_MAX_FILES;
  const maxFileSizeBytes = maxSizeStr ? parseInt(maxSizeStr, 10) : DEFAULT_MAX_SIZE;
  const acceptedTypes = fileTypesStr
    ? fileTypesStr.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    id: raw.id,
    cmId: raw.cmid,
    title: raw.name,
    description: raw.intro ?? '',
    openDate: raw.allowsubmissionsfromdate ? raw.allowsubmissionsfromdate * 1000 : undefined,
    dueDate: raw.duedate ? raw.duedate * 1000 : undefined,
    cutoffDate: raw.cutoffdate ? raw.cutoffdate * 1000 : undefined,
    maxFiles,
    maxFileSizeBytes,
    acceptedTypes,
  };
}
