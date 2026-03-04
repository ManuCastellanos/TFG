export type MoodleWsError = {
  error: string;
  errorcode?: string;
  debuginfo?: string;
};

export const isMoodleWsError = (value: unknown): value is MoodleWsError => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "error" in value;
};