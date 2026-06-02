export interface DashboardStats {
  todayCheckIns: number;
  todayCheckOuts: number;
  currentlyBoarded: number;
  totalBookingsThisMonth: number;
}

export interface BoardedPet {
  bookingId: number;
  petName: string;
  customerName: string;
  checkIn: string;
  checkOut: string;
}
