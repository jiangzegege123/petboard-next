import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { APIClient } from './APIClient';
import { BookingKeys } from './keys';
import { BookingDTO, BookingStatus } from '@/lib/types/booking';

export const BookingsListQueryOptions = () =>
  queryOptions({
    queryKey: BookingKeys.list(),
    queryFn: () => APIClient.bookings.getAll(),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

export const BookingDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: BookingKeys.detail(id),
    queryFn: () => APIClient.bookings.getById(id),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    enabled: !!id,
  });

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BookingDTO>) => APIClient.bookings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BookingKeys.list() });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BookingDTO> }) =>
      APIClient.bookings.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: BookingKeys.detail(data.id) });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatus }) =>
      APIClient.bookings.updateStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: BookingKeys.detail(data.id) });
    },
  });
};
