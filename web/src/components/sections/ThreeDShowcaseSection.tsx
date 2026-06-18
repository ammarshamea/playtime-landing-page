"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Layers, Cpu, Globe2 } from "lucide-react";
import dynamic from "next/dynamic";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const FloatingCrystals = dynamic(() => import("@/components/three/FloatingCrystals"), { ssr: false });
const GalaxyScene      = dynamic(() => import("@/components/three/GalaxyScene"),      { ssr: false });

const PILLS = [
  { icon: Layers, label: "Offline-first SQLite" },
  { icon: Cpu,    label: "Flutter / Android" },
  { icon: Globe2, label: "Arabic RTL" },
];

export default function ThreeDShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const crystalY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const galaxyY  = useTransform(scrollYProgress, [0, 1], ["-5%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-0 min-h-[70vh] flex items-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Galaxy background */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ y: galaxyY }}
      >
        <GalaxyScene className="w-full h-full" />
      </motion.div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(3,1,1,0.85) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 items-center py-20">
        {/* ── Left: Text ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col gap-6"
        >
          <motion.span variants={fadeUp} className="section-label w-fit">
            <Layers size={12} />
            تقنية متقدمة
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="gradient-text">تطبيق يعمل</span>
            <br />
            بدون إنترنت
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg max-w-md leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            قاعدة بيانات SQLite محلية على جهازك — بياناتك لا تغادر الصالة. لا سحابة، لا اشتراك شهري للسيرفر، لا اتصال مطلوب.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            {PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-light text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                <Icon size={14} style={{ color: "var(--primary-light)" }} />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Three.js crystals ── */}
        <motion.div
          style={{ y: crystalY }}
          className="relative h-[420px] lg:h-[520px] w-full"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow behind crystals */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(198,7,13,0.12) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <FloatingCrystals className="w-full h-full" />
        </motion.div>
      </div>
    </section>
  );
}
