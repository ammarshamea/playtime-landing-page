import { whatsappUrl } from "@/lib/whatsapp";

/** Open native WhatsApp when the server-side Evolution session is offline. */
export function buildContactWhatsAppFallbackUrl(userPhone: string, message: string): string {
  const text = [
    "مرحباً، أرسلت رسالة من موقع Playtime Manager.",
    `رقمي للتواصل: ${userPhone}`,
    "",
    message,
  ].join("\n");

  return whatsappUrl(text);
}
