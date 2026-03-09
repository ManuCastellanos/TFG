import type { Auth } from "./Auth";

export default interface IAuthSessionStore {
  get(): Auth | null;
  save(auth: Auth): void;
  clear(): void;
}