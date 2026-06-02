import z from 'zod';

export const BookingFormSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  dailyRate: z.string().min(1, 'Daily rate is required'),
  status: z.enum(['BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']),
});

export type BookingFormValues = z.infer<typeof BookingFormSchema>;
