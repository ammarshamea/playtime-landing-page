export const WHATSAPP_DISPLAY = "0981175877";
export const WHATSAPP_E164 = "963981175877";

export function whatsappUrl(message?: string) {
  const text = message ?? "";
  const params = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${WHATSAPP_E164}${params}`;
}
