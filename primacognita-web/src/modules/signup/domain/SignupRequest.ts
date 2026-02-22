export interface SignupRequest {
  username: string,
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  email2?: string;
  city?: string;
  country?: string;
};
