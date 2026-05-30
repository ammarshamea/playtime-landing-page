"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WifiOff, LayoutGrid, Coffee, BarChart3 } from "lucide-react";
import { staggerContainer, popIn, viewportConfig } from "@/lib/animations";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STAT_ACCENTS = ["#10b981", "#9b8bc4", "#5c8fd6", "#e879d9"] as const;
const STAT_ICONS = [WifiOff, LayoutGrid, Coffee, BarChart3] as const;

export default function StatsBar() {
  const t = useTranslations("stats");

  const stats = [
    {
      label: t("offline"),
      sub: t("offlineSub"),
      el: <AnimatedCounter target={100} suffix="%" />,
    },
    { label: t("devices"), sub: t("devicesSub"), el: null },
    { label: t("snacks"), sub: t("snacksSub"), el: null },
    { label: t("reports"), sub: t("reportsSub"), el: null },
  ];

  return (
    <section
      className="py-16 border-y relative overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div className="absolute inset-0 scan-overlay pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((s, i) => {
          const Icon = STAT_ICONS[i];
          return (
            <motion.div
              key={i}
              variants={popIn}
              whileHover={{
                scale: 1.04,
                transition: { type: "spring", stiffness: 340, damping: 20 },
              }}
              className="flex flex-col items-center gap-1.5 text-center cursor-default"
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-2xl mb-1"
                style={{
                  background: `${STAT_ACCENTS[i]}18`,
                  border: `1px solid ${STAT_ACCENTS[i]}40`,
                }}
              >
                {s.el ? (
                  <motion.span
                    className="text-2xl font-black"
                    style={{ color: STAT_ACCENTS[i] }}
                  >
                    {s.el}
                  </motion.span>
                ) : (
                  <Icon size={22} color={STAT_ACCENTS[i]} strokeWidth={1.75} />
                )}
              </motion.div>

              <motion.div
                className="h-0.5 rounded-full w-10 mb-0.5"
                style={{
                  background: `linear-gradient(to right, transparent, ${STAT_ACCENTS[i]}, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.7, delay: i * 0.12 + 0.3 }}
              />

              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {s.label}
              </span>
              <span className="text-xs leading-relaxed px-1" style={{ color: "var(--text-muted)" }}>
                {s.sub}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
