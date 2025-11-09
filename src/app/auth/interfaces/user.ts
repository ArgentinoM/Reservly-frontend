import { Roles } from "../../core/interfaces/roles.interface";

export interface User {
  id:      number;
  name:    string;
  surname: string;
  img:     string|null;
  email:   string;
  rol:  Roles;
}
