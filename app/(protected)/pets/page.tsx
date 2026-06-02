'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PawPrint, Loader2 } from 'lucide-react';
import { PetsListQueryOptions } from '@/lib/api/pet';
import { petColumns } from './(components)/(data-tables)/pet/columns';
import { DataTableClient } from '@/components/ui/data-table-client';
import { TableSkeleton } from '@/components/table-skeleton';
import { StatsCards, StatsCardData } from '@/components/stats-cards';
import { FormDialog } from '@/components/form-dialog';
import PetForm from './(components)/forms/pet-form';
import { notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';

export default function PetsPage() {
  const { data: pets, isLoading, isFetching, isError, error } = useQuery(PetsListQueryOptions());

  React.useEffect(() => {
    if (isError && error) notifyError(extractErrorMessage(error));
  }, [isError, error]);

  const statsCards: StatsCardData[] = [
    {
      title: 'Total Pets',
      value: pets?.length ?? 0,
      icon: PawPrint,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-700',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className="text-2xl font-semibold">Pets</h1>
        <FormDialog
          dialogTitle="Add New Pet"
          dialogDescription="Fill in the required fields to add a new pet."
          buttonTitle="Add Pet"
        >
          <PetForm />
        </FormDialog>
      </div>

      <StatsCards cards={statsCards} isLoading={isLoading} mobileGridCols={1} desktopGridCols={1} />

      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        {isLoading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-destructive">Error loading pets</div>
        ) : (
          <div className="relative">
            {isFetching && !isLoading && (
              <div className="absolute top-2 right-2 z-10">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            <DataTableClient
              tableId="pet_main_data_table"
              data={pets ?? []}
              columns={petColumns}
              searchPlaceHolder="Search pets..."
              defaultSorting={[{ id: 'name', desc: false }]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
