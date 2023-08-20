export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  passwordConfirm: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
