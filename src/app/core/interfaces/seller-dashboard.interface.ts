export interface Summary {
  total_services:      number;
  total_sales:         number;
  total_revenue:       number;
  active_reservations: number;
}

export interface SaleMounth {
  labels: string[];
  values: number[];
}

export interface ReveuneMounth {
  labels: string[];
  values: number[];
}

export interface TopServices {
  id:          number;
  name:        string;
  total_sales: number;
}
