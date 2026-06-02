import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { APIClient } from './APIClient';
import { PetKeys } from './keys';
import { PetDTO } from '@/lib/types/pet';

export const PetsListQueryOptions = () =>
  queryOptions({
    queryKey: PetKeys.list(),
    queryFn: () => APIClient.pets.getAll(),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

export const PetDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: PetKeys.detail(id),
    queryFn: () => APIClient.pets.getById(id),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    enabled: !!id,
  });

export const useCreatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PetDTO>) => APIClient.pets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PetKeys.list() });
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PetDTO> }) =>
      APIClient.pets.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PetKeys.list() });
      queryClient.invalidateQueries({ queryKey: PetKeys.detail(data.id) });
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => APIClient.pets.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PetKeys.list() });
    },
  });
};
