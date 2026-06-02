export type BookingStatus = 'BOOKED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface BookingDTO {
  id: number;
  petId: number;
  petName?: string;
  customerName?: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  dailyRate: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}
