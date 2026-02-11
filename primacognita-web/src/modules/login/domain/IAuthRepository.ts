import type { Token } from "./Token";

export default interface IAuthRepository {
  login(username: string, password: string): Promise<Token>;
}
