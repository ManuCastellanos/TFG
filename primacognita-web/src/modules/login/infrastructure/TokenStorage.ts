import type { Token } from "../domain/Token";

const KEY = "pc_token";

const TokenStorage = {
  get(): Token | null {
    const raw = localStorage.getItem(KEY);
    return raw ? { id: raw } : null;
  },

  set(token: Token): void {
    localStorage.setItem(KEY, token.id);
  },

  clear(): void {
    localStorage.removeItem(KEY);
  },
};

export default TokenStorage;
