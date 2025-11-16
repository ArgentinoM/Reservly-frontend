import { Catalog } from "./response-catalog.interface";

export interface Favorite {
  id:      number;
  user_id: number;
  service: Catalog;
}
