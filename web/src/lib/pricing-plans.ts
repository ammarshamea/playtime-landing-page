/** Single source of truth for plan prices in USD */
export const PLAN_PRICES_USD = {
  monthly: 3,
  semiannual: 15,
  annual: 25,
} as const;

export type PlanId = keyof typeof PLAN_PRICES_USD;

export function getPlanPriceUsd(planId: string): number {
  if (planId in PLAN_PRICES_USD) {
    return PLAN_PRICES_USD[planId as PlanId];
  }
  return 0;
}
