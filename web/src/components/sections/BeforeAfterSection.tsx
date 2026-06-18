"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Check, ArrowLeftRight } from "lucide-react";
import { fadeUp, slideInLeft, slideInRight, staggerContainer, listItemLeft, listItemRight, viewportConfig } from "@/lib/animations";

export default function BeforeAfterSection() {
  const t = useTranslations("beforeAfter");
  const before = t.raw("before") as string[];
  const after = t.raw("after") as string[];

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-card)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(135,3,5,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
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
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
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

        <div className="grid md:grid-cols-2 gap-5">
          {/* ── Before card — slides from left ── */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="rounded-[28px] p-6 sm:p-8 relative overflow-hidden"
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)",
              boxShadow: "0 20px 60px rgba(239,68,68,0.06)",
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-10 -end-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)" }}
            />

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#f87171" }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <X size={20} />
              </motion.div>
              {t("beforeTitle")}
            </h3>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="space-y-3"
            >
              {before.map((item, i) => (
                <motion.li
                  key={i}
                  variants={listItemLeft}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  <X size={15} className="shrink-0 mt-0.5" color="#f87171" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── After card — slides from right ── */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="rounded-[28px] p-6 sm:p-8 relative overflow-hidden"
            style={{
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.25)",
              boxShadow: "0 20px 60px rgba(16,185,129,0.06)",
            }}
          >
            {/* Scan line */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] pointer-events-none scan-overlay" />

            {/* Ambient glow */}
            <div
              className="absolute -top-10 -end-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)" }}
            />

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#34d399" }}>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <Check size={20} />
              </motion.div>
              {t("afterTitle")}
            </h3>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="space-y-3"
            >
              {after.map((item, i) => (
                <motion.li
                  key={i}
                  variants={listItemRight}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                  whileHover={{ x: -4, transition: { duration: 0.2 } }}
                >
                  <Check size={15} className="shrink-0 mt-0.5" color="#34d399" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
