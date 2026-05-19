// store/useCheckoutStore.ts
import { create } from "zustand";

type CheckoutState = {
  isOpen: boolean;
  selectedRestaurant: string | null;

  openCheckout: () => void;
  closeCheckout: () => void;
  setSelectedRestaurant: (id: string | null) => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  isOpen: false,
  selectedRestaurant: null,

  openCheckout: () => set({ isOpen: true }),
  closeCheckout: () => set({ isOpen: false, selectedRestaurant: null }),

  setSelectedRestaurant: (id) => set({ selectedRestaurant: id }),
}));
