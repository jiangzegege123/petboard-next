import z from 'zod';

export const CustomerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type CustomerFormValues = z.infer<typeof CustomerFormSchema>;
