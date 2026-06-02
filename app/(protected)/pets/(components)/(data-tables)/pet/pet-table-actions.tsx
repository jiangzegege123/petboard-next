'use client';

import React from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PetDTO } from '@/lib/types/pet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FormDialog } from '@/components/form-dialog';
import PetForm from '../../forms/pet-form';
import { useDeletePet } from '@/lib/api/pet';
import { notifySuccess, notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';

export function PetTableActions({ pet }: { pet: PetDTO }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const deletePet = useDeletePet();

  const handleDelete = async () => {
    try {
      await deletePet.mutateAsync(pet.id);
      notifySuccess('Pet deleted successfully');
    } catch (error) {
      notifyError(extractErrorMessage(error));
    }
  };

  return (
    <>
      <FormDialog dialogTitle="Edit Pet" buttonTitle="Edit" open={editOpen} onOpenChange={setEditOpen}>
        <PetForm id={pet.id} />
      </FormDialog>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Pet"
        description={`Are you sure you want to delete "${pet.name}"?`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        isDestructive
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => { e.stopPropagation(); setDeleteOpen(true); }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
