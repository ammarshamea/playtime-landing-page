"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Zap, MessageCircle, Phone } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/whatsapp";

export default function CTASection() {
  const t = useTranslations("cta");
  const waHref = whatsappUrl(t("whatsappMessage"));

  return (
    <section id="cta" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(53,42,95,0.24) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center gap-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-5xl font-black leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </motion.h2>

          <motion.p variants={fadeUp} className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t("subtitle")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-opacity hover:opacity-90"
              style={{
                background: "#25D366",
                boxShadow: "0 8px 32px rgba(37,211,102,0.4)",
              }}
            >
              <MessageCircle size={22} />
              {t("whatsappButton")}
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-opacity hover:opacity-90"
              style={{
                background: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
              }}
            >
              <Zap size={20} />
              {t("button")}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Phone size={16} />
            <span>{t("phoneLabel")}:</span>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
              style={{ color: "#25D366" }}
              dir="ltr"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("note")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
