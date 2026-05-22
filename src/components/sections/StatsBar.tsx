"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { staggerContainer, popIn, viewportConfig } from "@/lib/animations";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STAT_ACCENTS = ["#9b8bc4", "#10b981", "#5c8fd6", "#e879d9"] as const;

export default function StatsBar() {
  const t = useTranslations("stats");

  const stats = [
    { label: t("offline"),    sub: t("offlineSub"),    el: <AnimatedCounter target={100} suffix="%" /> },
    { label: t("sessions"),   sub: t("sessionsSub"),   el: <AnimatedCounter target={0} infinity /> },
    { label: t("languages"),  sub: t("languagesSub"),  el: <AnimatedCounter target={2} /> },
    { label: t("themes"),     sub: t("themesSub"),     el: <AnimatedCounter target={4} /> },
  ];

  return (
    <section
      className="py-16 border-y relative overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      {/* Scan sweep */}
      <div className="absolute inset-0 scan-overlay pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={popIn}
            whileHover={{
              scale: 1.06,
              transition: { type: "spring", stiffness: 340, damping: 20 },
            }}
            className="flex flex-col items-center gap-1.5 text-center cursor-default"
          >
            {/* Value */}
            <motion.span
              className="text-3xl sm:text-4xl font-black"
              style={{ color: STAT_ACCENTS[i] }}
              whileInView={{
                filter: ["blur(8px)", "blur(0px)"],
                opacity: [0, 1],
              }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              {s.el}
            </motion.span>

            {/* Bottom glow line */}
            <motion.div
              className="h-0.5 rounded-full w-10 mb-0.5"
              style={{ background: `linear-gradient(to right, transparent, ${STAT_ACCENTS[i]}, transparent)` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 0.7, delay: i * 0.12 + 0.3 }}
            />

            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {s.label}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {s.sub}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
