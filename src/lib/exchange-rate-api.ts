/** Minimal public payload — no upstream API details or token. */
export type ExchangeRateData = {
  rate: number;
  fetched_at: string;
};

export type ExchangeRateResponse = {
  success: boolean;
  data?: ExchangeRateData;
  message?: string;
};

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return base;
}

export async function fetchUsdExchangeRate(): Promise<ExchangeRateData> {
  const response = await fetch(`${apiBase()}/api/exchange-rate/usd`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const json = (await response.json().catch(() => ({}))) as ExchangeRateResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(
      json.message || "تعذر تحديث سعر الصرف حالياً. تواصل معنا لمعرفة السعر بالليرة.",
    );
  }

  return json.data;
}
