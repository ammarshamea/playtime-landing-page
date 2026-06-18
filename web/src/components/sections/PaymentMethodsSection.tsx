"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Banknote, Smartphone, Wallet } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { openContactChat } from "@/lib/open-contact-chat";

export default function PaymentMethodsSection() {
  const t = useTranslations("paymentMethods");
  const methods = t.raw("methods") as string[];

  return (
    <section className="relative pb-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="rounded-[24px] p-6 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(167, 139, 250, 0.18)",
            backdropFilter: "blur(12px)",
          }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
            <Wallet size={22} style={{ color: "#a78bfa" }} />
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {t("title")}
            </h3>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
            {t("description")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-5">
            {methods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "rgba(167, 139, 250, 0.1)",
                  border: "1px solid rgba(167, 139, 250, 0.22)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <Smartphone size={12} style={{ color: "#c4b5fd" }} />
                {method}
              </span>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            {t("note")}
          </motion.p>

          <motion.button
            variants={fadeUp}
            type="button"
            onClick={() => openContactChat({ prefillMessage: t("ctaPrefill") })}
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold"
            style={{
              background: "rgba(167, 139, 250, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.35)",
              color: "#e9d5ff",
            }}
          >
            <Banknote size={16} />
            {t("cta")}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
