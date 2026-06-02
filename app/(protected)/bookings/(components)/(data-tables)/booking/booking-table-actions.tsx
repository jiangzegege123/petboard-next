'use client';

import React from 'react';
import { MoreHorizontal, Pencil, LogIn, LogOut, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BookingDTO } from '@/lib/types/booking';
import { FormDialog } from '@/components/form-dialog';
import BookingForm from '../../forms/booking-form';
import { useUpdateBookingStatus } from '@/lib/api/booking';
import { notifySuccess, notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';

export function BookingTableActions({ booking }: { booking: BookingDTO }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = async (status: BookingDTO['status']) => {
    console.log(`[BookingTableActions] status change: ${booking.id} → ${status}`);
    try {
      await updateStatus.mutateAsync({ id: booking.id, status });
      notifySuccess(`Booking status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      notifyError(extractErrorMessage(error));
    }
  };

  return (
    <>
      <FormDialog dialogTitle="Edit Booking" buttonTitle="Edit" open={editOpen} onOpenChange={setEditOpen}>
        <BookingForm id={booking.id} />
      </FormDialog>

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
          <DropdownMenuSeparator />
          {booking.status === 'BOOKED' && (
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange('CHECKED_IN'); }}>
              <LogIn className="mr-2 h-4 w-4" /> Check In
            </DropdownMenuItem>
          )}
          {booking.status === 'CHECKED_IN' && (
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange('CHECKED_OUT'); }}>
              <LogOut className="mr-2 h-4 w-4" /> Check Out
            </DropdownMenuItem>
          )}
          {(booking.status === 'BOOKED' || booking.status === 'CHECKED_IN') && (
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); handleStatusChange('CANCELLED'); }}
              className="text-destructive focus:text-destructive"
            >
              <X className="mr-2 h-4 w-4" /> Cancel Booking
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
