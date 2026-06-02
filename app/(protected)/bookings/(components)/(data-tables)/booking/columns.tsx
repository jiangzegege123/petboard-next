'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BookingDTO } from '@/lib/types/booking';
import { TableBadges } from '@/components/table-badges';
import { BookingTableActions } from './booking-table-actions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export const bookingColumns: ColumnDef<BookingDTO>[] = [
  {
    accessorKey: 'petName',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Pet <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Owner',
  },
  {
    accessorKey: 'checkIn',
    header: 'Check-in',
    cell: ({ row }) => new Date(row.original.checkIn).toLocaleDateString(),
  },
  {
    accessorKey: 'checkOut',
    header: 'Check-out',
    cell: ({ row }) => new Date(row.original.checkOut).toLocaleDateString(),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.original.total),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TableBadges names={[row.original.status]} visibleCount={1} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <BookingTableActions booking={row.original} />,
  },
];
