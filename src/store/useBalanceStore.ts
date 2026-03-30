import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BalanceState {
  balance: number;
  deduct: (amount: number) => void;
  reset: () => void;
}

const INITIAL_BALANCE = 5000;

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set) => ({
      balance: INITIAL_BALANCE,
      deduct: (amount) => set((state) => ({ balance: state.balance - amount })),
      reset: () => set({ balance: INITIAL_BALANCE }),
    }),
    { name: "onda-balance" },
  ),
);
