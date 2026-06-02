export const CustomerKeys = {
  all: ['customers'] as const,
  list: () => [...CustomerKeys.all, 'list'] as const,
  detail: (id: number) => [...CustomerKeys.all, 'detail', id] as const,
};

export const PetKeys = {
  all: ['pets'] as const,
  list: () => [...PetKeys.all, 'list'] as const,
  detail: (id: number) => [...PetKeys.all, 'detail', id] as const,
  byCustomer: (customerId: number) => [...PetKeys.all, 'by-customer', customerId] as const,
};

export const BookingKeys = {
  all: ['bookings'] as const,
  list: () => [...BookingKeys.all, 'list'] as const,
  detail: (id: number) => [...BookingKeys.all, 'detail', id] as const,
};

export const InvoiceKeys = {
  all: ['invoices'] as const,
  list: () => [...InvoiceKeys.all, 'list'] as const,
  detail: (id: number) => [...InvoiceKeys.all, 'detail', id] as const,
  byBooking: (bookingId: number) => [...InvoiceKeys.all, 'by-booking', bookingId] as const,
};

export const DashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...DashboardKeys.all, 'stats'] as const,
  boardedPets: () => [...DashboardKeys.all, 'boarded-pets'] as const,
};
