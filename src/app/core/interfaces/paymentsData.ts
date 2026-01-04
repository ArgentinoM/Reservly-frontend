export interface PaymentsData {
  service_id: number;
  start_date: string;
  end_date: string;
}


export interface PaymentIntentResponse {
  message: string;
  client_secret: string;
}
