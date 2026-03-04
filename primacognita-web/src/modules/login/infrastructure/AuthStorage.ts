import type { Auth } from "@/modules/login/domain/Auth";

const KEY = "pc_session";

const SessionStorage = {
  get(): Auth | null {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as Auth;
    } catch {
      return null;
    }
  },

  set(session: Auth): void {
    localStorage.setItem(KEY, JSON.stringify(session));
  },

  clear(): void {
    localStorage.removeItem(KEY);
  },
};

export default SessionStorage;