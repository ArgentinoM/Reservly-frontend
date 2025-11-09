import { User } from "../../../auth/interfaces/user";


export interface Catalog {
  id:       number;
  name:     string;
  desc:     string;
  price:    number;
  duration: number;
  img:      string;
  user:     User;
  category: string;
  rating:   Rating;
}

export interface Rating {
  average_rating: string;
  total_reviews:  number;
}

