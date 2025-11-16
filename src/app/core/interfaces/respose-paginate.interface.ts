export interface PaginateResponse<T> {
  message: string;
  data:    T[];
  meta:    Meta;
}
export interface Meta {
  current_page: number;
  last_page:    number;
  per_page:     number;
  total:        number;
}

