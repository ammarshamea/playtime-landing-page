"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowDown, Gamepad2, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { fadeUp, staggerContainer } from "@/lib/animations";
import BrandLogo from "@/components/ui/BrandLogo";

const ParticleCanvas = dynamic(() => import("@/components/canvas/ParticleCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Full-bleed hero background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/playtime-hero-dashboard.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17,14,28,0.55) 0%, rgba(17,14,28,0.72) 55%, rgba(17,14,28,0.92) 100%)",
        }}
      />

      {/* Brand tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(53,42,95,0.2) 0%, rgba(92,78,138,0.1) 45%, transparent 75%)",
        }}
      />

      {/* Canvas particles on top */}
      <div className="absolute inset-0 opacity-40">
        <ParticleCanvas />
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg))",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          <motion.div variants={fadeUp} className="mx-auto mb-2">
            <BrandLogo
              className="h-32 w-32 sm:h-40 sm:w-40 object-contain"
              style={{ filter: "drop-shadow(0 0 48px rgba(139,92,246,0.5))" }}
            />
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="section-label">
              <Gamepad2 size={13} />
              {t("badge")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="gradient-text">{t("title")}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-xl sm:text-2xl font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("subtitle")}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("description")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-3 mt-2"
          >
            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 glow-primary"
              style={{ background: "var(--brand-gradient)" }}
            >
              <Zap size={16} />
              {t("ctaPrimary")}
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              }}
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("scrollHint")}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ArrowDown size={16} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
