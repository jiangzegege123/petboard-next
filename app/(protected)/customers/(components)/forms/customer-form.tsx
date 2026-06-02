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
import { CustomerFormSchema, CustomerFormValues } from './schemas/customer-form-schema';
import { useCreateCustomer, useUpdateCustomer, CustomerDetailQueryOptions } from '@/lib/api/customer';
import { notifySuccess, notifyError } from '@/lib/toast';
import { extractErrorMessage } from '@/lib/utils/error-message-helper';
import { addNewRecordId, scrollToFirstError } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

interface CustomerFormProps {
  id?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

export default function CustomerForm({ id, onSuccess, onCancel }: CustomerFormProps) {
  const isEditing = Boolean(id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: customer, isLoading } = useQuery({
    ...CustomerDetailQueryOptions(id ?? 0),
    enabled: isEditing && !!id,
  });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: { name: '', email: '', phone: '', address: '', status: 'ACTIVE' },
  });

  React.useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
      });
    }
  }, [customer, form]);

  async function onSubmit(values: CustomerFormValues) {
    console.log('[CustomerForm] submit', values);
    try {
      setIsSubmitting(true);
      if (isEditing && id) {
        await updateCustomer.mutateAsync({ id, data: values });
        notifySuccess('Customer updated successfully');
      } else {
        const result = await createCustomer.mutateAsync(values);
        notifySuccess('Customer added successfully');
        if (result?.id) addNewRecordId('customer_main_data_table', result.id);
      }
      onSuccess?.();
    } catch (error) {
      notifyError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function onError() {
    notifyError(isEditing ? 'Failed to update customer' : 'Failed to add customer', {
      description: 'Check required fields',
    });
    scrollToFirstError();
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <Spinner size="medium" />
        <p className="text-muted-foreground text-sm">Loading customer...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address*</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormSelect
          control={form.control}
          name="status"
          label="Status*"
          options={statusOptions}
          placeholder="Select status"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting
              ? isEditing ? 'Saving...' : 'Adding...'
              : isEditing ? 'Save Changes' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
