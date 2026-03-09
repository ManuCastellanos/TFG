import type { Auth } from "@/modules/auth/domain/Auth";
import type IAuthSessionStore from "@/modules/auth/domain/IAuthSessionStore";

const KEY = "pc_session";

export default class AuthStorage implements IAuthSessionStore {
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
  }

  save(auth: Auth): void {
    localStorage.setItem(KEY, JSON.stringify(auth));
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}