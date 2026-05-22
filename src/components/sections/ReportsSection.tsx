"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TrendingUp, BarChart3 } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function ReportsSection() {
  const t = useTranslations("reports");

  const periods = [
    t("periodDay"),
    t("periodWeek"),
    t("periodMonth"),
    t("periodYear"),
  ];

  return (
    <section id="reports" className="relative py-28 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(53,42,95,0.25) 0%, transparent 70%)",
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

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="section-visual lg:col-span-7 min-h-[280px] sm:min-h-[340px]"
          >
            <img
              src="/playtime-reports-analytics.png"
              alt=""
              aria-hidden="true"
              className="opacity-95"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background: "linear-gradient(to top, var(--bg-card), transparent)",
              }}
            />
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="stat-card lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  {t("revenue")}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: "var(--green)" }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--green)" }}>
                    +12% {t("periodWeek")}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {periods.map((p, i) => (
                  <span
                    key={p}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: i === 1 ? "var(--primary)" : "var(--bg-elevated)",
                      color: i === 1 ? "#fff" : "var(--text-muted)",
                      border: `1px solid ${i === 1 ? "transparent" : "var(--border)"}`,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div
                className="text-4xl sm:text-5xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                87,500
                <span className="text-lg font-semibold ms-2" style={{ color: "var(--text-muted)" }}>
                  ل.س
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  {t("sessions")}
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  143
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  {t("topStation")}
                </p>
                <p className="text-lg font-bold truncate" style={{ color: "var(--brand-pink)" }}>
                  PlayStation 2
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
