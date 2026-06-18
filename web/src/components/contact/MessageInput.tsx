"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  hasError?: boolean;
};

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  hasError,
}: Props) {
  const t = useTranslations("contactChat");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("messagePlaceholder")}
        disabled={disabled}
        maxLength={1000}
        className="flex-1 resize-none rounded-2xl px-3.5 py-2.5 text-sm outline-none transition-colors min-h-[44px] max-h-28"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: hasError ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-primary)",
        }}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled}
        aria-label={t("sendAriaLabel")}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #16A34A, #22C55E)",
          boxShadow: "0 0 20px rgba(34,197,94,0.35)",
        }}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
