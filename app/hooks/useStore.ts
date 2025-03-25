import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Store {
  balance: number;

  updateBalance: (amount: number) => void;
}

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    balance: 100,

    updateBalance: (amount) => {

        const {balance} = get();

        set({ balance: balance + amount })
    },
  }))
);
