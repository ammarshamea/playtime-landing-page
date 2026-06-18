"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WifiOff, LayoutGrid, Coffee, BarChart3 } from "lucide-react";
import { viewportConfig } from "@/lib/animations";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Card3D from "@/components/ui/Card3D";

const STAT_ACCENTS = ["#FF8780", "#F25A58", "#EE2226", "#C6070D"] as const;
const STAT_ICONS = [WifiOff, LayoutGrid, Coffee, BarChart3] as const;

const flip3D = {
  hidden: { opacity: 0, rotateX: -90, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" },
};

export default function StatsBar() {
  const t = useTranslations("stats");

  const stats = [
    { label: t("offline"),  sub: t("offlineSub"),  el: <AnimatedCounter target={100} suffix="%" /> },
    { label: t("devices"),  sub: t("devicesSub"),  el: null },
    { label: t("snacks"),   sub: t("snacksSub"),   el: null },
    { label: t("reports"),  sub: t("reportsSub"),  el: null },
  ];

  return (
    <section
      className="py-20 border-y relative overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      {/* Scan line */}
      <div className="absolute inset-0 scan-overlay pointer-events-none" />

      {/* Subtle ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(198,7,13,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = STAT_ICONS[i];
          const accent = STAT_ACCENTS[i];

          return (
            <motion.div
              key={i}
              variants={flip3D}
              initial="hidden"
              whileInView="visible"
              viewport={{ ...viewportConfig, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.12 }}
              style={{ perspective: 800 }}
            >
              <Card3D
                tilt={8}
                accent={`rgba(${
                  i === 0 ? "255,135,128"
                  : i === 1 ? "242,90,88"
                  : i === 2 ? "238,34,38"
                  : "198,7,13"
                }, 0.15)`}
                liftZ={16}
                className="rounded-2xl min-h-[132px] p-5 flex flex-col items-center justify-center gap-2.5 text-center cursor-default"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: `0 8px 28px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                <div className="flex w-full flex-col items-center gap-2.5 text-center">
                {/* Icon / counter box */}
                <motion.div
                  className={`flex items-center justify-center rounded-2xl ${
                    s.el ? "h-[52px] min-w-[68px] px-3.5 py-2" : "h-[52px] w-[52px] p-2.5"
                  }`}
                  style={{
                    background: `rgba(${
                      i === 0 ? "255,135,128"
                      : i === 1 ? "242,90,88"
                      : i === 2 ? "238,34,38"
                      : "198,7,13"
                    }, 0.12)`,
                    border: `1px solid ${accent}55`,
                  }}
                  animate={{ boxShadow: [`0 0 8px ${accent}20`, `0 0 22px ${accent}40`] }}
                  transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, ease: "easeInOut", repeatType: "mirror" }}
                >
                  {s.el ? (
                    <span className="text-xl font-black leading-none whitespace-nowrap" style={{ color: accent }}>
                      {s.el}
                    </span>
                  ) : (
                    <Icon size={24} color={accent} strokeWidth={1.6} />
                  )}
                </motion.div>

                {/* Glow line */}
                <motion.div
                  className="h-0.5 rounded-full w-12"
                  style={{
                    background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={viewportConfig}
                  transition={{ duration: 0.8, delay: i * 0.12 + 0.35 }}
                />

                <div className="flex w-full flex-col items-center gap-1">
                  <span
                    className="block w-full text-[15px] font-extrabold leading-tight tracking-[-0.01em]"
                    style={{ color: "#FFFFFF", textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="block w-full text-xs font-medium leading-relaxed px-1.5"
                    style={{ color: "rgba(255,255,255,0.68)", textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}
                  >
                    {s.sub}
                  </span>
                </div>
                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
