import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PetDTO } from '@/lib/types/pet';

interface PetStore {
  selectedPet: PetDTO | null;
  setSelectedPet: (pet: PetDTO | null) => void;
}

export const usePetStore = create<PetStore>()(
  devtools(
    (set) => ({
      selectedPet: null,
      setSelectedPet: (pet) => set({ selectedPet: pet }),
    }),
    { name: 'pet-store' },
  ),
);
