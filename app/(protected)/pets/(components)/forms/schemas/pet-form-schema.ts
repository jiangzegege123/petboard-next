import z from 'zod';

export const PetFormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  name: z.string().min(1, 'Name is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.string().min(1, 'Age is required'),
  notes: z.string().optional(),
});

export type PetFormValues = z.infer<typeof PetFormSchema>;
