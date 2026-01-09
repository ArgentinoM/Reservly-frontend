import { User } from "../../auth/interfaces/user";
import { Catalog } from "../../customer/interfaces/response-catalog.interface";

export interface Reservations {
  id:          number;
  start_date:  Date;
  end_date:    Date;
  status:      string;
  user:     User;
  service: Catalog;
}
