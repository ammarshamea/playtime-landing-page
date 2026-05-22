"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Clock, MessageCircle, Headphones, Zap } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/whatsapp";

export default function SupportSection() {
  const t = useTranslations("support");
  const hours = t.raw("hours") as { label: string; value: string }[];
  const steps = t.raw("steps") as string[];

  return (
    <section id="support" className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center gap-4 mb-12 text-center"
        >
          <motion.span variants={fadeUp} className="section-label">
            {t("sectionLabel")}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base max-w-xl"
            style={{ color: "var(--text-muted)" }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Hours card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(53,42,95,0.2)" }}
              >
                <Clock size={22} color="var(--brand-pink)" />
              </div>
              <div className="text-start">
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  {t("hoursTitle")}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("timezoneNote")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {hours.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    {item.label}
                  </span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: "var(--text-primary)" }}
                    dir="ltr"
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "var(--text-primary)",
              }}
            >
              <Zap size={16} color="#10b981" />
              {t("responseTime")}
            </div>
          </motion.div>

          {/* WhatsApp card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(37,211,102,0.25)",
              boxShadow: "0 0 40px rgba(37,211,102,0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(37,211,102,0.15)" }}
              >
                <Headphones size={22} color="#25D366" />
              </div>
              <div className="text-start">
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  {t("whatsappTitle")}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("whatsappDesc")}
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl(t("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-white text-base transition-opacity hover:opacity-90"
              style={{
                background: "#25D366",
                boxShadow: "0 8px 32px rgba(37,211,102,0.3)",
              }}
            >
              <MessageCircle size={22} />
              {t("whatsappButton")}
            </a>

            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                {t("phoneLabel")}
              </p>
              <a
                href={whatsappUrl(t("whatsappMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-black tracking-wide hover:underline"
                style={{ color: "var(--text-primary)" }}
                dir="ltr"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                {t("stepsTitle")}
              </p>
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(53,42,95,0.25)",
                      color: "var(--brand-pink)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm pt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
