import { Products } from './product';

export type DeliveryStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid';

export interface DeliveryRequest {
  id: string;
  deliveryDetails: string;
  date: string;
  customerId: string;
  deliveryStatus: DeliveryStatus;
  driverId: number;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  product: Products[];
}
