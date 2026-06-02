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
import { Textarea } from '@/components/ui/textarea';
import { PetFormSchema, PetFormValues } from './schemas/pet-form-schema';
import { useCreatePet, useUpdatePet, PetDetailQueryOptions } from '@/lib/api/pet';
import { CustomersListQueryOptions } from '@/lib/api/customer';
import { notifySuccess, notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';
import { scrollToFirstError } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

interface PetFormProps {
  id?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PetForm({ id, onSuccess, onCancel }: PetFormProps) {
  const isEditing = Boolean(id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: pet, isLoading } = useQuery({
    ...PetDetailQueryOptions(id ?? 0),
    enabled: isEditing && !!id,
  });

  const { data: customers = [] } = useQuery(CustomersListQueryOptions());
  const customerOptions = customers.map((c) => ({ label: c.name, value: String(c.id) }));

  const createPet = useCreatePet();
  const updatePet = useUpdatePet();

  const form = useForm<PetFormValues>({
    resolver: zodResolver(PetFormSchema),
    defaultValues: { customerId: '', name: '', breed: '', age: '0', notes: '' },
  });

  React.useEffect(() => {
    if (pet) {
      form.reset({
        customerId: String(pet.customerId),
        name: pet.name,
        breed: pet.breed,
        age: String(pet.age),
        notes: pet.notes ?? '',
      });
    }
  }, [pet, form]);

  async function onSubmit(values: PetFormValues) {
    console.log('[PetForm] submit', values);
    try {
      setIsSubmitting(true);
      const payload = {
        ...values,
        customerId: parseInt(values.customerId, 10),
        age: parseInt(values.age, 10),
      };
      if (isEditing && id) {
        await updatePet.mutateAsync({ id, data: payload });
        notifySuccess('Pet updated successfully');
      } else {
        await createPet.mutateAsync(payload);
        notifySuccess('Pet added successfully');
      }
      onSuccess?.();
    } catch (error) {
      notifyError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function onError() {
    notifyError(isEditing ? 'Failed to update pet' : 'Failed to add pet', {
      description: 'Check required fields',
    });
    scrollToFirstError();
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <Spinner size="medium" />
        <p className="text-muted-foreground text-sm">Loading pet...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
        <FormSelect
          control={form.control}
          name="customerId"
          label="Owner (Customer)*"
          options={customerOptions}
          placeholder="Select customer"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Name*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Buddy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Golden Retriever" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (years)*</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes / Special Requirements</FormLabel>
              <FormControl>
                <Textarea placeholder="Allergies, medications, behaviour notes..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting
              ? isEditing ? 'Saving...' : 'Adding...'
              : isEditing ? 'Save Changes' : 'Add Pet'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
