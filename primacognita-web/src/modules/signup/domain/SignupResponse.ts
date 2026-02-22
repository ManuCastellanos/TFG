export interface SignupSuccess {
  ok: true;
  message?: string;
}

export interface SignupError {
  ok: false;
  fieldErrors?: Record<string, string>;
  globalError?: string;
}

export type SignupResponse = SignupSuccess | SignupError;
