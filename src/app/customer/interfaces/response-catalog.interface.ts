import { User } from "../../auth/interfaces/user";


export interface Catalog {
  id:       number;
  name:     string;
  desc:     string;
  price:    number;
  duration: number;
  img:      string;
  user:     User;
  category: number;
  rating:   Rating | null;
}

export interface Rating {
  average_rating: string;
  total_reviews:  number;
}

