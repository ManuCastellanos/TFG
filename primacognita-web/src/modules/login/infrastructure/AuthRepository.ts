import type { Token } from "../domain/Token";
import type IAuthRepository from "../domain/IAuthRepository";
import { env } from "../../shared/env";

type ApiResponse =
  | { token: string }
  | { error: string; errorcode?: string; debuginfo?: string };

export default class AuthRepository implements IAuthRepository {
  async login(username: string, password: string): Promise<Token> {
    const body = new URLSearchParams({
      username,
      password,
      service: env.shortName,
    });

    const res = await fetch(`${env.baseUrl}/login/token.php`, {
      method: "POST",
      body,
    });

    const json = (await res.json()) as ApiResponse;

    if ("error" in json) {
      const code = json.errorcode ? ` (${json.errorcode})` : "";
      throw new Error(`${json.error}${code}`);
    }

    return { id: json.token };
  }
}
