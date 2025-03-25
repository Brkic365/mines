import { useMemo } from "react";

export function usePayoutCalculator(openedTiles: number, betAmount?: number) {
  const multiplier = useMemo(() => {
    return 1 + 0.2 * openedTiles;
  }, [openedTiles]);

  const payout = useMemo(() => {
    if (typeof betAmount === "number") {
      return +(betAmount * multiplier).toFixed(2); // round to 2 decimals
    }
    return null;
  }, [multiplier, betAmount]);

  return { multiplier, payout };
}