'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, CircleDollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { InvoicesListQueryOptions, useMarkInvoicePaid } from '@/lib/api/invoice';
import { DataTableClient } from '@/components/ui/data-table-client';
import { TableSkeleton } from '@/components/table-skeleton';
import { StatsCards, StatsCardData } from '@/components/stats-cards';
import { TableBadges } from '@/components/table-badges';
import { Button } from '@/components/ui/button';
import { notifySuccess, notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';
import { formatCurrency } from '@/lib/utils/currency';
import { ColumnDef } from '@tanstack/react-table';
import { InvoiceDTO } from '@/lib/types/invoice';

function InvoiceActions({ invoice }: { invoice: InvoiceDTO }) {
  const markPaid = useMarkInvoicePaid();

  const handleMarkPaid = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[InvoiceActions] mark paid', invoice.id);
    try {
      await markPaid.mutateAsync(invoice.id);
      notifySuccess('Invoice marked as paid');
    } catch (error) {
      notifyError(extractErrorMessage(error));
    }
  };

  if (invoice.status === 'PAID') return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleMarkPaid}
      disabled={markPaid.isPending}
    >
      Mark Paid
    </Button>
  );
}

const invoiceColumns: ColumnDef<InvoiceDTO>[] = [
  { accessorKey: 'id', header: 'Invoice #' },
  { accessorKey: 'customerName', header: 'Customer' },
  { accessorKey: 'petName', header: 'Pet' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TableBadges names={[row.original.status]} visibleCount={1} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => row.original.createdAt
      ? new Date(row.original.createdAt).toLocaleDateString()
      : '-',
  },
  {
    id: 'actions',
    cell: ({ row }) => <InvoiceActions invoice={row.original} />,
  },
];

export default function InvoicesPage() {
  const { data: invoices, isLoading, isFetching, isError, error } = useQuery(InvoicesListQueryOptions());

  React.useEffect(() => {
    if (isError && error) notifyError(extractErrorMessage(error));
  }, [isError, error]);

  const paid = invoices?.filter((i) => i.status === 'PAID').length ?? 0;
  const unpaid = invoices?.filter((i) => i.status === 'UNPAID').length ?? 0;
  const overdue = invoices?.filter((i) => i.status === 'OVERDUE').length ?? 0;

  const statsCards: StatsCardData[] = [
    {
      title: 'Total Invoices',
      value: invoices?.length ?? 0,
      icon: Receipt,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      title: 'Paid',
      value: paid,
      icon: CircleDollarSign,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-700',
    },
    {
      title: 'Unpaid / Overdue',
      value: unpaid + overdue,
      icon: AlertTriangle,
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-700',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground text-sm">Invoices are auto-generated when bookings are created.</p>
        </div>
      </div>

      <StatsCards cards={statsCards} isLoading={isLoading} mobileGridCols={2} desktopGridCols={3} />

      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        {isLoading ? (
          <TableSkeleton rows={8} columns={7} />
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-destructive">Error loading invoices</div>
        ) : (
          <div className="relative">
            {isFetching && !isLoading && (
              <div className="absolute top-2 right-2 z-10">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            <DataTableClient
              tableId="invoice_main_data_table"
              data={invoices ?? []}
              columns={invoiceColumns}
              searchPlaceHolder="Search invoices..."
              defaultSorting={[{ id: 'createdAt', desc: true }]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
