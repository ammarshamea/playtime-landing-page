"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function AppPreviewSection() {
  const t = useTranslations("preview");

  return (
    <section id="preview" className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-12"
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
          className="flex justify-center"
        >
          <div
            className="relative w-full max-w-md sm:max-w-lg"
            style={{
              filter: "drop-shadow(0 32px 64px rgba(135,3,5,0.45))",
            }}
          >
            <img
              src="/playtime-mobile-red.png"
              alt={t("imageAlt")}
              className="w-full h-auto object-contain rounded-2xl"
              loading="lazy"
              width={600}
              height={900}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
