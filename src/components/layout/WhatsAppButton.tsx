"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const cta = useTranslations("cta");

  return (
    <a
      href={whatsappUrl(cta("whatsappMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
      title={t("tooltip")}
      className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 end-6"
      style={{
        background: "#25D366",
        boxShadow: "0 8px 32px rgba(37,211,102,0.45)",
      }}
    >
      <MessageCircle size={28} color="#fff" fill="#fff" />
    </a>
  );
}
