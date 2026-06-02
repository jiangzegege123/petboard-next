import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { APIClient } from './APIClient';
import { InvoiceKeys } from './keys';

export const InvoicesListQueryOptions = () =>
  queryOptions({
    queryKey: InvoiceKeys.list(),
    queryFn: () => APIClient.invoices.getAll(),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

export const useMarkInvoicePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => APIClient.invoices.markPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: InvoiceKeys.list() });
    },
  });
};
