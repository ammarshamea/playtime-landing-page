"use client";

import { useTranslations } from "next-intl";
import PhoneInput from "./PhoneInput";
import MessageInput from "./MessageInput";

type Props = {
  phone: string;
  setPhone: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  onRetry?: () => void;
  isSending: boolean;
  error: string | null;
  phoneError: boolean;
  messageError: boolean;
  whatsappFallbackUrl?: string | null;
};

export default function ContactInputArea({
  phone,
  setPhone,
  message,
  setMessage,
  onSend,
  onRetry,
  isSending,
  error,
  phoneError,
  messageError,
  whatsappFallbackUrl,
}: Props) {
  const t = useTranslations("contactChat");

  return (
    <div
      className="shrink-0 px-4 pt-3 pb-4 space-y-2 border-t"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        background: "#0E0B14",
      }}
    >
      <PhoneInput value={phone} onChange={setPhone} hasError={phoneError} />
      <MessageInput
        value={message}
        onChange={setMessage}
        onSend={onSend}
        disabled={isSending}
        hasError={messageError}
      />
      {error && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-red-400">
          <span>{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="underline hover:text-red-300"
            >
              {t("retry")}
            </button>
          )}
        </div>
      )}
      {whatsappFallbackUrl && (
        <a
          href={whatsappFallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
        >
          {t("whatsappFallbackButton")}
        </a>
      )}
      {isSending && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {t("sending")}
        </p>
      )}
      <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
        {t("privacyNote")}
      </p>
    </div>
  );
}
