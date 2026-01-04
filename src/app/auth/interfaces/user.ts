import { Roles } from "../../core/interfaces/roles.interface";

export interface User {
  id:      number;
  name:    string;
  surname: string;
  img_perfil:  any|null;
  email:   string;
  phone:   string|null;
  bio:     string|null;
  rol:  Roles;
  created_at: string;
}
