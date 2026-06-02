export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export interface InvoiceDTO {
  id: number;
  bookingId: number;
  petName?: string;
  customerName?: string;
  amount: number;
  status: InvoiceStatus;
  createdAt?: string;
}
