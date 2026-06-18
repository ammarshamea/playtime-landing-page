"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
};

export default function PhoneInput({ value, onChange, hasError }: Props) {
  const t = useTranslations("contactChat");

  return (
    <div className="relative">
      <Phone
        className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 pointer-events-none"
        style={{ color: "var(--text-muted)" }}
      />
      <input
        type="tel"
        inputMode="tel"
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("phonePlaceholder")}
        className="w-full rounded-2xl py-2.5 ps-10 pe-3 text-sm outline-none transition-colors"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: hasError ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}
