import type IAuthRepository from "@/modules/login/domain/IAuthRepository";
import type { Auth } from "@/modules/login/domain/Auth";
import type IMoodleClient from "@/shared/clients/IMoodleClient";
import { env } from "@/shared/utils/env";
import { isMoodleWsError, type MoodleWsError } from "@/shared/clients/moodle-errors";


type TokenResponse = { token: string } | MoodleWsError;

type SiteInfoResponse = {
  userid: number;
};

export default class AuthRepository implements IAuthRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async login(username: string, password: string): Promise<Auth> {
    const body = new URLSearchParams({
      username,
      password,
      service: env.shortName,
    });

    const res = await fetch(`${env.baseUrl}/login/token.php`, {
      method: "POST",
      body,
    });

    const json = (await res.json()) as unknown;

    if (isMoodleWsError(json)) {
      const code = json.errorcode ? ` (${json.errorcode})` : "";
      throw new Error(`${json.error}${code}`);
    }

    const tokenJson = json as TokenResponse;

    if (!("token" in tokenJson)) {
      throw new Error("Invalid token response from Moodle.");
    }

    const token = tokenJson.token;
    const userId = await this.getMyUserId(token);

    return { token, userId };
  }

  async getMyUserId(token: string): Promise<string> {
    const response = await this.moodleClient.call<SiteInfoResponse>(
      token,
      "core_webservice_get_site_info",
      {}
    );

    return String(response.userid);
  }
}