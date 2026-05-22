"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Check, ArrowLeftRight } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function BeforeAfterSection() {
  const t = useTranslations("beforeAfter");
  const before = t.raw("before") as string[];
  const after = t.raw("after") as string[];

  return (
    <section className="py-24" style={{ background: "var(--bg-card)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-14"
        >
          <motion.span variants={fadeUp} className="section-label">
            <ArrowLeftRight size={13} />
            {t("sectionLabel")}
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base max-w-xl" style={{ color: "var(--text-muted)" }}>
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="rounded-[28px] p-6 sm:p-7"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "#f87171" }}>
              <X size={20} />
              {t("beforeTitle")}
            </h3>
            <ul className="space-y-3">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <X size={16} className="shrink-0 mt-0.5" color="#f87171" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="rounded-[28px] p-6 sm:p-7"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "#34d399" }}>
              <Check size={20} />
              {t("afterTitle")}
            </h3>
            <ul className="space-y-3">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Check size={16} className="shrink-0 mt-0.5" color="#34d399" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
