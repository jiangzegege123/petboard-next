import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { APIClient } from './APIClient';
import { DashboardKeys } from './keys';

export const DashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: DashboardKeys.stats(),
    queryFn: () => APIClient.dashboard.getStats(),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const BoardedPetsQueryOptions = () =>
  queryOptions({
    queryKey: DashboardKeys.boardedPets(),
    queryFn: () => APIClient.dashboard.getBoardedPets(),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
