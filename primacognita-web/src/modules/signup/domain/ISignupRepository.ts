import type { SignupRequest } from "./SignupRequest";
import type { SignupResponse } from "./SignupResponse";

export default interface ISignupRepository {
  signup(request: SignupRequest): Promise<SignupResponse>;
}
