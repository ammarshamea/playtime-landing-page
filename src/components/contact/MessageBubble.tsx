"use client";

import type { ChatMessage } from "@/types/contact-chat";

type Props = {
  message: ChatMessage;
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex max-w-[88%] ${isUser ? "ms-auto justify-end" : "me-auto justify-start"}`}
    >
      <div
        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser ? "rounded-ee-md" : "rounded-es-md"
        }`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #16A34A, #22C55E)",
                color: "#fff",
              }
            : {
                background: "#1C1726",
                color: "var(--text-primary)",
                border: "1px solid rgba(255,255,255,0.06)",
              }
        }
      >
        <p>{message.text}</p>
        <div
          className="flex items-center gap-1 mt-1 text-[10px] opacity-70 justify-end"
          style={{ color: isUser ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isUser && message.status === "sending" && <span>…</span>}
          {isUser && message.status === "sent" && <span>✓</span>}
          {isUser && message.status === "failed" && <span>!</span>}
        </div>
      </div>
    </div>
  );
}
