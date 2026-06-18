"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

type Props = {
  onClose: () => void;
};

export default function ChatHeader({ onClose }: Props) {
  const t = useTranslations("contactChat");

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
      style={{
        background: "linear-gradient(135deg, #100A0A, #2A0809)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="relative flex h-10 w-10 items-center justify-center rounded-full shrink-0"
        style={{ background: "#22C55E" }}
      >
        <WhatsAppIcon size={22} />
        <span
          className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-2"
          style={{ background: "#22C55E", borderColor: "#100A0A" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{t("headerTitle")}</p>
        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.65)" }}>
          {t("headerStatus")}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label={t("close")}
      >
        <X className="w-5 h-5 text-white/80" />
      </button>
    </header>
  );
}
