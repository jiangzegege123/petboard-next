export interface PetDTO {
  id: number;
  customerId: number;
  customerName?: string;
  name: string;
  breed: string;
  age: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
