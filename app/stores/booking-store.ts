import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BookingDTO } from '@/lib/types/booking';

interface BookingStore {
  selectedBooking: BookingDTO | null;
  setSelectedBooking: (booking: BookingDTO | null) => void;
}

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set) => ({
      selectedBooking: null,
      setSelectedBooking: (booking) => set({ selectedBooking: booking }),
    }),
    { name: 'booking-store' },
  ),
);
