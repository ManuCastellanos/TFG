import type { Token } from "../domain/Token";
import type IAuthRepository from "../domain/IAuthRepository";

type MoodleTokenOk = { token: string };
type MoodleTokenErr = { error: string; errorcode?: string; debuginfo?: string };
type MoodleTokenResponse = MoodleTokenOk | MoodleTokenErr;

export default class AuthRepository implements IAuthRepository {
  private readonly baseUrl: string;
  private readonly serviceShortName: string;

  constructor(baseUrl: string, serviceShortName: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.serviceShortName = serviceShortName;
  }

  async login(identifier: string, password: string): Promise<Token> {
    const body = new URLSearchParams();
    body.set("username", identifier.trim());
    body.set("password", password);
    body.set("service", this.serviceShortName);

    const res = await fetch(`${this.baseUrl}/login/token.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const raw = await res.text();

    let json: MoodleTokenResponse;
    try {
      json = JSON.parse(raw);
    } catch {
      throw new Error("Moodle no devolvió JSON");
    }

    if ("error" in json) {
      const code = json.errorcode ? ` (${json.errorcode})` : "";
      throw new Error(`${json.error}${code}`);
    }

    return { id: json.token };
  }
}
