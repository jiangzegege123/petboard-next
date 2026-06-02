'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, CalendarCheck, Loader2 } from 'lucide-react';
import { BookingsListQueryOptions } from '@/lib/api/booking';
import { bookingColumns } from './(components)/(data-tables)/booking/columns';
import { DataTableClient } from '@/components/ui/data-table-client';
import { TableSkeleton } from '@/components/table-skeleton';
import { StatsCards, StatsCardData } from '@/components/stats-cards';
import { FormDialog } from '@/components/form-dialog';
import BookingForm from './(components)/forms/booking-form';
import { notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';

export default function BookingsPage() {
  const { data: bookings, isLoading, isFetching, isError, error } = useQuery(BookingsListQueryOptions());

  React.useEffect(() => {
    if (isError && error) notifyError(extractErrorMessage(error));
  }, [isError, error]);

  const activeBookings = bookings?.filter((b) => b.status === 'BOOKED' || b.status === 'CHECKED_IN').length ?? 0;
  const checkedIn = bookings?.filter((b) => b.status === 'CHECKED_IN').length ?? 0;

  const statsCards: StatsCardData[] = [
    {
      title: 'Total Bookings',
      value: bookings?.length ?? 0,
      icon: CalendarDays,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      title: 'Currently Checked In',
      value: checkedIn,
      icon: CalendarCheck,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-700',
    },
    {
      title: 'Active (Booked + In)',
      value: activeBookings,
      icon: CalendarDays,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-700',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <FormDialog
          dialogTitle="New Booking"
          dialogDescription="Create a new boarding/daycare booking."
          buttonTitle="New Booking"
        >
          <BookingForm />
        </FormDialog>
      </div>

      <StatsCards cards={statsCards} isLoading={isLoading} mobileGridCols={2} desktopGridCols={3} />

      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        {isLoading ? (
          <TableSkeleton rows={8} columns={7} />
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-destructive">Error loading bookings</div>
        ) : (
          <div className="relative">
            {isFetching && !isLoading && (
              <div className="absolute top-2 right-2 z-10">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            <DataTableClient
              tableId="booking_main_data_table"
              data={bookings ?? []}
              columns={bookingColumns}
              searchPlaceHolder="Search bookings..."
              defaultSorting={[{ id: 'checkIn', desc: true }]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
