'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Loader2 } from 'lucide-react';
import { CustomersListQueryOptions } from '@/lib/api/customer';
import { customerColumns } from './(components)/(data-tables)/customer/columns';
import { DataTableClient } from '@/components/ui/data-table-client';
import { TableSkeleton } from '@/components/table-skeleton';
import { StatsCards, StatsCardData } from '@/components/stats-cards';
import { FormDialog } from '@/components/form-dialog';
import CustomerForm from './(components)/forms/customer-form';
import { notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';

export default function CustomersPage() {
  const { data: customers, isLoading, isFetching, isError, error } = useQuery(CustomersListQueryOptions());

  React.useEffect(() => {
    if (isError && error) notifyError(extractErrorMessage(error));
  }, [isError, error]);

  const totalCustomers = customers?.length ?? 0;
  const activeCustomers = customers?.filter((c) => c.status === 'ACTIVE').length ?? 0;

  const statsCards: StatsCardData[] = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      title: 'Active Customers',
      value: activeCustomers,
      description: `${totalCustomers ? Math.round((activeCustomers / totalCustomers) * 100) : 0}% of total`,
      icon: UserCheck,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-700',
      descriptionColor: 'text-muted-foreground',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <FormDialog
          dialogTitle="Add New Customer"
          dialogDescription="Fill in the required fields to add a new customer."
          buttonTitle="Add Customer"
        >
          <CustomerForm />
        </FormDialog>
      </div>

      <StatsCards cards={statsCards} isLoading={isLoading} mobileGridCols={2} desktopGridCols={2} />

      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        {isLoading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-destructive">
            Error loading customers
          </div>
        ) : (
          <div className="relative">
            {isFetching && !isLoading && (
              <div className="absolute top-2 right-2 z-10">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            <DataTableClient
              tableId="customer_main_data_table"
              data={customers ?? []}
              columns={customerColumns}
              searchPlaceHolder="Search customers..."
              defaultSorting={[{ id: 'name', desc: false }]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
