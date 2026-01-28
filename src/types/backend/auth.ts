export type userTypes = "admin" | "agent" | null;

export interface loginResponse {
  access_token: string;
  expired_at: string;
}

export interface userData {
  id: string | null;
  name: string | null;
  email: string | null;
  role: userTypes | null;
  surname: string | null;
  created_at: string | null;
  email_verified: boolean | null;
  language: string | null;
}
