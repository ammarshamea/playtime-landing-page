"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Smartphone } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function PlatformsSection() {
  const t = useTranslations("platforms");

  return (
    <section className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center gap-4 mb-10"
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
          <motion.p variants={fadeUp} className="text-base max-w-xl" style={{ color: "var(--text-muted)" }}>
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="rounded-[28px] p-8 flex flex-col items-center gap-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 16px 48px rgba(53,42,95,0.12)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <Smartphone size={32} color="#10b981" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("currentTitle")}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t("currentDesc")}
          </p>
          <p className="text-xs pt-2 border-t w-full" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            {t("comingNote")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
