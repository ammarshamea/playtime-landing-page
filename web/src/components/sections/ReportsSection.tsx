"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BarChart3, TrendingUp } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function ReportsSection() {
  const t = useTranslations("reports");
  const metrics = t.raw("metrics") as { label: string; value: string }[];

  return (
    <section id="reports" className="relative py-28 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(135,3,5,0.25) 0%, transparent 70%)",
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
            <BarChart3 size={13} />
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
            className="text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="rounded-[28px] border p-6 sm:p-8"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "0 20px 60px rgba(135,3,5,0.18)",
          }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl p-4"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  {metric.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-3 rounded-2xl p-4 border border-dashed"
            style={{ borderColor: "var(--border-strong)", background: "var(--bg-elevated)" }}
          >
            <TrendingUp size={22} style={{ color: "var(--green)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t("placeholderNote")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
