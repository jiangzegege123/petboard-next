import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { APIClient } from './APIClient';
import { CustomerKeys } from './keys';
import { CustomerDTO } from '@/lib/types/customer';

export const CustomersListQueryOptions = () =>
  queryOptions({
    queryKey: CustomerKeys.list(),
    queryFn: () => APIClient.customers.getAll(),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

export const CustomerDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: CustomerKeys.detail(id),
    queryFn: () => APIClient.customers.getById(id),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    enabled: !!id,
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CustomerDTO>) => APIClient.customers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CustomerKeys.list() });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CustomerDTO> }) =>
      APIClient.customers.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CustomerKeys.list() });
      queryClient.invalidateQueries({ queryKey: CustomerKeys.detail(data.id) });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => APIClient.customers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CustomerKeys.list() });
    },
  });
};
