"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STATS = [
  { valueKey: "offline", subKey: "offlineSub", display: "100%", suffix: "", infinity: false },
  { valueKey: "sessions", subKey: "sessionsSub", display: "", suffix: "", infinity: true },
  { valueKey: "languages", subKey: "languagesSub", display: "", suffix: "", target: 2 },
  { valueKey: "themes", subKey: "themesSub", display: "", suffix: "", target: 4 },
] as const;

export default function StatsBar() {
  const t = useTranslations("stats");

  return (
    <section
      className="py-14 border-y"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {/* 100% Offline */}
        <motion.div
          variants={scaleIn}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--primary-light)" }}
          >
            <AnimatedCounter target={100} suffix="%" />
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("offline")}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("offlineSub")}
          </span>
        </motion.div>

        {/* Sessions */}
        <motion.div
          variants={scaleIn}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--primary-light)" }}
          >
            <AnimatedCounter target={0} infinity />
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("sessions")}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("sessionsSub")}
          </span>
        </motion.div>

        {/* Languages */}
        <motion.div
          variants={scaleIn}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--primary-light)" }}
          >
            <AnimatedCounter target={2} />
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("languages")}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("languagesSub")}
          </span>
        </motion.div>

        {/* Themes */}
        <motion.div
          variants={scaleIn}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--primary-light)" }}
          >
            <AnimatedCounter target={4} />
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("themes")}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("themesSub")}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
