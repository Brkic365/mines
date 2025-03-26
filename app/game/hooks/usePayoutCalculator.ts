import { useMemo } from "react";

export function usePayoutCalculator(openedTiles: number, betAmount?: number) {
  return useMemo(() => {
    const multiplier = 1 + 0.2 * openedTiles;
    const payout =
      typeof betAmount === "number"
        ? +(betAmount * multiplier).toFixed(2)
        : undefined;

    return { multiplier, payout };
  }, [openedTiles, betAmount]);
}
