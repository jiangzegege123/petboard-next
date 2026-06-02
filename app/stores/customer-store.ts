import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CustomerDTO } from '@/lib/types/customer';

interface CustomerStore {
  selectedCustomer: CustomerDTO | null;
  setSelectedCustomer: (customer: CustomerDTO | null) => void;
}

export const useCustomerStore = create<CustomerStore>()(
  devtools(
    (set) => ({
      selectedCustomer: null,
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
    }),
    { name: 'customer-store' },
  ),
);
