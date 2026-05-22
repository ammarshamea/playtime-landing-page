"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar, CalendarRange, Crown, Gift, Sparkles, CreditCard } from "lucide-react";
import { fadeUp, scaleIn, popIn, staggerContainer, viewportConfig, EASE_OUT_EXPO } from "@/lib/animations";

type Plan = { id: string; title: string; price: string; currency: string; duration: string };

const PLAN_STYLES = {
  monthly: {
    icon: Calendar,
    accent: "#5c8fd6",
    glow: "rgba(92,143,214,0.35)",
    border: "rgba(92,143,214,0.45)",
    bg: "linear-gradient(160deg, rgba(92,143,214,0.1) 0%, var(--bg-card) 100%)",
  },
  semiannual: {
    icon: CalendarRange,
    accent: "#9b8bc4",
    glow: "rgba(155,139,196,0.35)",
    border: "rgba(155,139,196,0.45)",
    bg: "linear-gradient(160deg, rgba(107,90,158,0.16) 0%, var(--bg-card) 100%)",
  },
  annual: {
    icon: Crown,
    accent: "#e879d9",
    glow: "rgba(232,121,217,0.45)",
    border: "rgba(232,121,217,0.55)",
    bg: "linear-gradient(160deg, rgba(232,121,217,0.13) 0%, var(--bg-card) 100%)",
  },
} as const;

export default function PricingSection() {
  const t = useTranslations("pricing");
  const plans = t.raw("plans") as Plan[];
  const promos = t.raw("promos") as { title: string; desc: string }[];

  return (
    <section id="pricing" className="relative py-28 overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 35%, rgba(53,42,95,0.32) 0%, transparent 70%)",
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
            <CreditCard size={13} />
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
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch"
        >
          {plans.map((plan) => {
            const style = PLAN_STYLES[plan.id as keyof typeof PLAN_STYLES];
            const Icon = style.icon;
            const featured = plan.id === "annual";

            return (
              <motion.div
                key={plan.id}
                variants={featured ? popIn : scaleIn}
                animate={featured ? { y: [0, -8, 0] } : undefined}
                transition={featured ? { y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } } : undefined}
                whileHover={{
                  y: featured ? -14 : -6,
                  boxShadow: `0 32px 80px ${style.glow}`,
                  transition: { duration: 0.28 },
                }}
                className={`relative flex flex-col rounded-[28px] p-6 sm:p-7 ${featured ? "md:-mt-3 md:mb-3 md:scale-[1.05]" : ""}`}
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  boxShadow: featured
                    ? `0 24px 64px ${style.glow}, 0 0 0 1px ${style.border}`
                    : `0 12px 40px ${style.glow}`,
                }}
              >
                {featured && (
                  <motion.span
                    initial={{ opacity: 0, y: -8, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #e879d9, #9b8bc4)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(232,121,217,0.45)",
                    }}
                  >
                    {t("mostSavings")}
                  </motion.span>
                )}

                {/* Featured gradient border sweep */}
                {featured && (
                  <div
                    className="absolute inset-0 rounded-[28px] pointer-events-none gradient-border-live"
                    style={{ opacity: 0.5 }}
                  />
                )}

                <motion.div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: `${style.accent}18`,
                    border: `1px solid ${style.accent}40`,
                    boxShadow: `0 0 30px ${style.glow}`,
                  }}
                  whileHover={{ rotate: 12, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <Icon size={28} color={style.accent} strokeWidth={1.75} />
                </motion.div>

                <h3 className="text-center text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  {plan.title}
                </h3>

                <div className="text-center mb-6">
                  <motion.span
                    className="text-5xl sm:text-6xl font-black tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={viewportConfig}
                    transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.2 }}
                  >
                    {plan.price}
                  </motion.span>
                  <span className="text-2xl font-bold ms-1 align-top" style={{ color: style.accent }}>
                    {plan.currency}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <span
                    className="block text-center rounded-full py-2.5 text-sm font-semibold"
                    style={{
                      background: `${style.accent}20`,
                      border: `1px solid ${style.accent}35`,
                      color: style.accent,
                    }}
                  >
                    {plan.duration}
                  </span>

                  <motion.a
                    href="#cta"
                    className="block text-center rounded-2xl py-3 text-sm font-semibold text-white"
                    style={{
                      background: featured
                        ? `linear-gradient(135deg, ${style.accent}, var(--brand-violet))`
                        : "var(--brand-gradient)",
                    }}
                    whileHover={{ scale: 1.03, opacity: 0.92 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {t("choosePlan")}
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-8 grid sm:grid-cols-2 gap-4"
        >
          {promos.map((promo, i) => {
            const PromoIcon = i === 0 ? Gift : Sparkles;
            const accent = i === 0 ? "#5c8fd6" : "#e879d9";
            return (
              <motion.div
                key={promo.title}
                variants={fadeUp}
                whileHover={{ y: -3, boxShadow: `0 16px 40px ${accent}18` }}
                className="flex items-center gap-4 rounded-2xl p-4 sm:p-5"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${accent}35`,
                  boxShadow: `0 8px 32px ${accent}10`,
                }}
              >
                <motion.div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                >
                  <PromoIcon size={22} color={accent} />
                </motion.div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{promo.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{promo.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
