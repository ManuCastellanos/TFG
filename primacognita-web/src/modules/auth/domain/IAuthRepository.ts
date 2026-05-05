import type { Auth } from "./Auth";

export default interface IAuthRepository {
  login(username: string, password: string): Promise<Auth>;
}
