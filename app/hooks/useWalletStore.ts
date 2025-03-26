import { loadBalance } from "@/lib/wallet";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface WalletStore {
  balance: number;
  currency: string;
  updateBalance: (amount: number) => void;
  loadBalance: () => Promise<void>;
}

/**
 * Zustand store for tracking user wallet state (balance & currency).
 */
export const useWalletStore = create<WalletStore>()(
  subscribeWithSelector((set) => ({
    balance: 0,
    currency: "EUR",

    /**
     * Overwrites the balance (typically after game result or reload).
     */
    updateBalance: (amount: number) => {
      set({ balance: amount });
    },

    /**
     * Loads the latest balance and currency from the wallet API.
     */
    loadBalance: async () => {
      try {
        const { balance: loadedBalance, currency: loadedCurrency } = await loadBalance();
        set({
          balance: loadedBalance,
          currency: loadedCurrency,
        });
      } catch (error) {
        console.error("Failed to load wallet balance:", error);
      }
    },
  }))
);
