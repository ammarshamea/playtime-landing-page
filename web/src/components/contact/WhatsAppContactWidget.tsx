"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useContactChat } from "@/hooks/useContactChat";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ContactInputArea from "./ContactInputArea";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

export default function WhatsAppContactWidget() {
  const chat = useContactChat();

  const handleSend = () => {
    void chat.sendMessage();
  };

  return (
    <>
      <FloatingWhatsAppButton onClick={chat.toggle} isOpen={chat.isOpen} />

      <AnimatePresence>
        {chat.isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close overlay"
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={chat.close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="fixed z-[60] flex flex-col overflow-hidden
                inset-x-0 bottom-0 h-[82dvh] rounded-t-3xl
                md:inset-auto md:end-6 md:bottom-24 md:w-[400px] md:h-[600px] md:rounded-3xl"
              style={{
                background: "#100A0A",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(198,7,13,0.18)",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div
                className="mx-auto mt-2 h-1 w-10 rounded-full md:hidden shrink-0"
                style={{ background: "rgba(255,255,255,0.2)" }}
              />
              <ChatHeader onClose={chat.close} />
              <MessageList messages={chat.messages} />
              <ContactInputArea
                phone={chat.phone}
                setPhone={chat.setPhone}
                message={chat.message}
                setMessage={chat.setMessage}
                onSend={handleSend}
                onRetry={chat.errorType === "network" ? () => void chat.retryLast() : undefined}
                isSending={chat.isSending}
                error={chat.error}
                phoneError={chat.errorType === "phone"}
                messageError={chat.errorType === "message"}
                whatsappFallbackUrl={chat.whatsappFallbackUrl}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
