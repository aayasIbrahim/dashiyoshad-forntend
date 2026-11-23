export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone:string
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: import("./user.types").IUser;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}