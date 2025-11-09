import { User } from "./user";

export interface AuthResponse {
  message: string;
  data:    User[];
  token:   string;
}
