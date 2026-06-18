export function computeSypPrice(priceUsd: number, rate: number): number {
  return Math.round(priceUsd * rate);
}

export function formatSyp(value: number, locale = "ar-SY"): string {
  return (
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(value))
  );
}

export function formatSypWithSuffix(value: number, locale = "ar-SY"): string {
  return `${formatSyp(value, locale)} ل.س`;
}

export function formatExchangeFetchedAt(iso: string, locale: string): string {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  } catch {
    return iso;
  }
}
