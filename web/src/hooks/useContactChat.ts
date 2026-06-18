"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContactMessage } from "@/lib/contact-api";
import { buildContactWhatsAppFallbackUrl } from "@/lib/contact-whatsapp-fallback";
import { OPEN_CONTACT_CHAT_EVENT, type OpenContactChatDetail } from "@/lib/open-contact-chat";
import { isValidPhone } from "@/lib/phone";
import type { ChatMessage } from "@/types/contact-chat";

const PHONE_STORAGE_KEY = "playtime_contact_phone";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useContactChat() {
  const t = useTranslations("contactChat");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"phone" | "message" | "network" | null>(null);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState<string | null>(null);
  const pendingRetryRef = useRef<ChatMessage | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PHONE_STORAGE_KEY);
      if (saved) setPhone(saved);
    } catch {
      /* private mode */
    }
  }, []);

  const showWelcome = useCallback(() => {
    if (welcomeShown) return;
    setWelcomeShown(true);
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        sender: "support",
        text: `${t("welcomeLine1")}\n${t("welcomeLine2")}`,
        createdAt: new Date(),
      },
    ]);
  }, [t, welcomeShown]);

  const open = useCallback(() => {
    setIsOpen(true);
    setError(null);
    setErrorType(null);
    showWelcome();
  }, [showWelcome]);

  const close = useCallback(() => {
    setIsOpen(false);
    setError(null);
    setErrorType(null);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<OpenContactChatDetail>).detail;
      open();
      if (detail?.prefillMessage) {
        setMessage(detail.prefillMessage);
      }
    };
    window.addEventListener(OPEN_CONTACT_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CONTACT_CHAT_EVENT, handler);
  }, [open]);

  const appendAutoReply = useCallback(
    (first: boolean, whatsappDelivered: boolean) => {
      const delay = 600 + Math.random() * 600;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            sender: "support",
            text: whatsappDelivered
              ? first
                ? `${t("autoReplyFirst")}\n${t("autoReplyFirstSub")}`
                : t("autoReply")
              : `${t("autoReplySaved")}\n${t("autoReplyWhatsAppOffline")}`,
            createdAt: new Date(),
          },
        ]);
      }, delay);
    },
    [t],
  );

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const body = (textOverride ?? message).trim();
      setError(null);
      setErrorType(null);

      if (!isValidPhone(phone)) {
        setError(t("errorPhone"));
        setErrorType("phone");
        return false;
      }

      if (body.length < 2) {
        setError(t("errorMessage"));
        setErrorType("message");
        return false;
      }

      try {
        localStorage.setItem(PHONE_STORAGE_KEY, phone.trim());
      } catch {
        /* ignore */
      }

      const userMsg: ChatMessage = {
        id: createId(),
        sender: "user",
        text: body,
        createdAt: new Date(),
        status: "sending",
      };

      setMessages((prev) => [...prev, userMsg]);
      setMessage("");
      setIsSending(true);

      const isFirst = !hasSubmittedBefore;

      try {
        const result = await submitContactMessage({
          phone: phone.trim(),
          message: body,
          locale,
        });

        const whatsappDelivered = result.whatsapp_delivered === true;

        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, status: "sent" as const } : m)),
        );
        setHasSubmittedBefore(true);

        if (!whatsappDelivered) {
          setWhatsappFallbackUrl(
            buildContactWhatsAppFallbackUrl(phone.trim(), body),
          );
        } else {
          setWhatsappFallbackUrl(null);
        }

        appendAutoReply(isFirst, whatsappDelivered);
        pendingRetryRef.current = null;
        return true;
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, status: "failed" as const } : m)),
        );
        setError(t("errorNetwork"));
        setErrorType("network");
        pendingRetryRef.current = userMsg;
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [appendAutoReply, hasSubmittedBefore, locale, message, phone, t],
  );

  const retryLast = useCallback(async () => {
    const failed = pendingRetryRef.current;
    if (!failed) return;
    setMessages((prev) => prev.filter((m) => m.id !== failed.id));
    pendingRetryRef.current = null;
    await sendMessage(failed.text);
  }, [sendMessage]);

  return {
    isOpen,
    phone,
    setPhone,
    message,
    setMessage,
    messages,
    isSending,
    error,
    errorType,
    hasSubmittedBefore,
    open,
    close,
    toggle,
    sendMessage,
    retryLast,
    whatsappFallbackUrl,
  };
}
