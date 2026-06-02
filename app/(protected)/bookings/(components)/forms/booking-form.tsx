'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormSelect } from '@/components/ui/form-select';
import { BookingFormSchema, BookingFormValues } from './schemas/booking-form-schema';
import { useCreateBooking, useUpdateBooking, BookingDetailQueryOptions } from '@/lib/api/booking';
import { PetsListQueryOptions } from '@/lib/api/pet';
import { notifySuccess, notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';
import { scrollToFirstError } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

interface BookingFormProps {
  id?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { label: 'Booked', value: 'BOOKED' },
  { label: 'Checked In', value: 'CHECKED_IN' },
  { label: 'Checked Out', value: 'CHECKED_OUT' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function BookingForm({ id, onSuccess, onCancel }: BookingFormProps) {
  const isEditing = Boolean(id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: booking, isLoading } = useQuery({
    ...BookingDetailQueryOptions(id ?? 0),
    enabled: isEditing && !!id,
  });

  const { data: pets = [] } = useQuery(PetsListQueryOptions());
  const petOptions = pets.map((p) => ({
    label: `${p.name} (${p.customerName ?? 'Unknown owner'})`,
    value: String(p.id),
  }));

  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: { petId: '', checkIn: '', checkOut: '', dailyRate: '50', status: 'BOOKED' as const },
  });

  React.useEffect(() => {
    if (booking) {
      form.reset({
        petId: String(booking.petId),
        checkIn: booking.checkIn.split('T')[0],
        checkOut: booking.checkOut.split('T')[0],
        dailyRate: String(booking.dailyRate),
        status: booking.status,
      });
    }
  }, [booking, form]);

  async function onSubmit(values: BookingFormValues) {
    console.log('[BookingForm] submit', values);
    try {
      setIsSubmitting(true);
      const payload = {
        ...values,
        petId: parseInt(values.petId, 10),
        dailyRate: parseFloat(values.dailyRate),
      };
      if (isEditing && id) {
        await updateBooking.mutateAsync({ id, data: payload });
        notifySuccess('Booking updated successfully');
      } else {
        await createBooking.mutateAsync(payload);
        notifySuccess('Booking created successfully');
      }
      onSuccess?.();
    } catch (error) {
      notifyError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function onError() {
    notifyError(isEditing ? 'Failed to update booking' : 'Failed to create booking', {
      description: 'Check required fields',
    });
    scrollToFirstError();
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <Spinner size="medium" />
        <p className="text-muted-foreground text-sm">Loading booking...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
        <FormSelect
          control={form.control}
          name="petId"
          label="Pet*"
          options={petOptions}
          placeholder="Select pet"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in Date*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out Date*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dailyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Rate ($)*</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} placeholder="50.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormSelect
            control={form.control}
            name="status"
            label="Status*"
            options={statusOptions}
            placeholder="Select status"
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting
              ? isEditing ? 'Saving...' : 'Creating...'
              : isEditing ? 'Save Changes' : 'Create Booking'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
