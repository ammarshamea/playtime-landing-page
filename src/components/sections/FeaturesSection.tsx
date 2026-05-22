"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Monitor, Timer, BarChart3, WifiOff, Languages, ShieldCheck } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const ICONS = [Monitor, Timer, BarChart3, WifiOff, Languages, ShieldCheck];

const CARD_CONFIG = [
  { bg: "rgba(53,42,95,0.18)",   border: "rgba(107,90,158,0.35)",  glow: "rgba(107,90,158,0.2)",  color: "#9b8bc4" },
  { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)",   glow: "rgba(16,185,129,0.18)", color: "#10b981" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)",   glow: "rgba(245,158,11,0.18)", color: "#f59e0b" },
  { bg: "rgba(92,78,138,0.18)",  border: "rgba(92,78,138,0.4)",    glow: "rgba(92,78,138,0.2)",   color: "#6b5a9e" },
  { bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.28)",  glow: "rgba(236,72,153,0.16)", color: "#ec4899" },
  { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.28)",   glow: "rgba(239,68,68,0.16)",  color: "#f87171" },
];

// ── 3-D tilt card ─────────────────────────────────────────────────────────────
function TiltCard({
  item,
  index,
}: {
  item: { title: string; desc: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = CARD_CONFIG[index];
  const Icon = ICONS[index];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });
  const rotateX = useTransform(sy, [-40, 40], [6, -6]);
  const rotateY = useTransform(sx, [-40, 40], [-6, 6]);
  const glowX = useTransform(sx, [-40, 40], ["0%", "100%"]);
  const glowY = useTransform(sy, [-40, 40], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ z: 20 }}
      className="relative flex flex-col gap-4 rounded-[24px] p-6 cursor-default overflow-hidden"
    >
      {/* Base background */}
      <div
        className="absolute inset-0 rounded-[24px] transition-all duration-300"
        style={{
          background: "var(--bg-card)",
          border: `1px solid ${cfg.border}`,
          boxShadow: `0 12px 40px ${cfg.glow}`,
        }}
      />

      {/* Dynamic spotlight follow */}
      <motion.div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at ${glowX} ${glowY}, ${cfg.bg}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Icon */}
      <motion.div
        className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        whileHover={{ scale: 1.15, rotate: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon size={21} color={cfg.color} />
      </motion.div>

      <div className="relative">
        <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {item.desc}
        </p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 inset-x-8 h-px rounded-full"
        style={{ background: `linear-gradient(to right, transparent, ${cfg.color}, transparent)` }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section id="features" className="py-28 relative overflow-hidden" style={{ background: "var(--bg-card)" }}>
      {/* Top ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(53,42,95,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
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
            style={{ color: "var(--text-primary)" }}
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

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {items.map((item, i) => (
            <TiltCard key={i} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
