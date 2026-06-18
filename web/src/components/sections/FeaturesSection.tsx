"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Monitor, Timer, Coffee, BarChart3, WifiOff, Languages } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import Card3D from "@/components/ui/Card3D";
import dynamic from "next/dynamic";

const PerspectiveGrid = dynamic(() => import("@/components/canvas/PerspectiveGrid"), { ssr: false });

const ICONS = [Monitor, Timer, Coffee, BarChart3, WifiOff, Languages];

const CARD_CONFIG = [
  { color: "#ff8780", rgb: "255,135,128" },
  { color: "#f25a58", rgb: "242,90,88" },
  { color: "#ee2226", rgb: "238,34,38" },
  { color: "#e6050d", rgb: "230,5,13" },
  { color: "#c6070d", rgb: "198,7,13" },
  { color: "#f25a58", rgb: "242,90,88" },
];

const revealCard = {
  hidden: { opacity: 0, y: 50, rotateX: -25, scale: 0.9, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" },
};

export default function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section id="features" className="py-28 relative overflow-hidden" style={{ background: "var(--bg-card)" }}>
      {/* 3D Perspective Grid floor */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <PerspectiveGrid opacity={0.14} color="#c6070d" />
      </div>

      {/* Ambient radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(198,7,13,0.1) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <motion.span variants={fadeUp} className="section-label">
            {t("sectionLabel")}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)", perspective: 800 }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ perspective: 1200 }}
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            const cfg = CARD_CONFIG[i] ?? CARD_CONFIG[0];

            return (
              <motion.div
                key={i}
              variants={revealCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 130, damping: 18, delay: i * 0.09 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card3D
                  tilt={14}
                  accent={`rgba(${cfg.rgb}, 0.25)`}
                  liftZ={24}
                  className="rounded-[22px] p-6 flex flex-col gap-4 cursor-default h-full"
                  style={{
                    background: `linear-gradient(145deg, rgba(${cfg.rgb},0.09) 0%, var(--bg-card) 100%)`,
                    border: `1px solid rgba(${cfg.rgb},0.28)`,
                    boxShadow: `0 12px 40px rgba(${cfg.rgb},0.1)`,
                  }}
                >
                  {/* Icon — lifted on Z axis */}
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `rgba(${cfg.rgb},0.14)`,
                      border: `1px solid rgba(${cfg.rgb},0.32)`,
                      boxShadow: `0 4px 20px rgba(${cfg.rgb},0.2)`,
                    }}
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 380, damping: 14 }}
                  >
                    <Icon size={21} color={cfg.color} />
                  </motion.div>

                  {/* Text — slightly lifted */}
                  <div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* Corner accent dot */}
                  <motion.div
                    className="absolute top-3 end-3 w-1.5 h-1.5 rounded-full pointer-events-none"
                    style={{ background: cfg.color }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }}
                  />
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
