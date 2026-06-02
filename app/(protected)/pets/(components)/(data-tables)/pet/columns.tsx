'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PetDTO } from '@/lib/types/pet';
import { PetTableActions } from './pet-table-actions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const petColumns: ColumnDef<PetDTO>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Pet Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Owner',
  },
  {
    accessorKey: 'breed',
    header: 'Breed',
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: ({ row }) => `${row.original.age}y`,
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm truncate max-w-[200px] block">
        {row.original.notes || '-'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <PetTableActions pet={row.original} />,
  },
];
