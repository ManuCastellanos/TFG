// src/modules/signup/infrastructure/SignupRepository.ts
import type ISignupRepository from "../domain/ISignupRepository";
import type { SignupRequest } from "../domain/SignupRequest";
import type { SignupResponse } from "../domain/SignupResponse";
import { env } from "../../../shared/utils/env";

export default class SignupRepository implements ISignupRepository {
  async signup(request: SignupRequest): Promise<SignupResponse> {
   
    const res = await fetch(`${env.baseUrl}/signup`, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const json = (await res.json()) as SignupResponse;

    return json;
  }
}
