import { User } from "../../auth/interfaces/user";

export interface Review {
  id:         number;
  rating:     number;
  comment:    string;
  user:    User;
  service_id: number;
}
