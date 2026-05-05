import type IAuthRepository from '@/modules/auth/domain/IAuthRepository';
import type { Auth } from '@/modules/auth/domain/Auth';
import { env } from '@/shared/utils/env';
import { isMoodleWsError, type MoodleWsError } from '@/shared/clients/moodle-errors';

type TokenResponse = { token: string } | MoodleWsError;

export default class AuthRepository implements IAuthRepository {
  
  async login(username: string, password: string): Promise<Auth> {
    const body = new URLSearchParams({
      username,
      password,
      service: env.shortName,
    });

    const res = await fetch(`${env.baseUrl}/login/token.php`, {
      method: 'POST',
      body,
    });

    const json = (await res.json()) as unknown;

    if (isMoodleWsError(json)) {
      const code = json.errorcode ? ` (${json.errorcode})` : '';
      throw new Error(`${json.error}${code}`);
    }

    const tokenJson = json as TokenResponse;

    if (!('token' in tokenJson)) {
      throw new Error('Invalid token response from Moodle.');
    }

    const token = tokenJson.token;

    return { token };
  }
}
