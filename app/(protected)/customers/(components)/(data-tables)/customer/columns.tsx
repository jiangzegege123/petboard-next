'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CustomerDTO } from '@/lib/types/customer';
import { TableBadges } from '@/components/table-badges';
import { CustomerTableActions } from './customer-table-actions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const customerColumns: ColumnDef<CustomerDTO>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TableBadges names={[row.original.status]} visibleCount={1} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CustomerTableActions customer={row.original} />,
  },
];
