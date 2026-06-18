"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Calculator,
  Users,
  DollarSign,
  ShoppingCart,
  Tag,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const SLIDERS = [
  { key: "sessions",   icon: Users,          min: 5,  max: 80,   step: 1,  suffixKey: "" },
  { key: "avgPrice",   icon: DollarSign,     min: 200, max: 2000, step: 50, suffixKey: " ل.س" },
  { key: "orders",     icon: ShoppingCart,   min: 0,  max: 60,   step: 1,  suffixKey: "" },
  { key: "orderValue", icon: Tag,            min: 50, max: 500,  step: 25, suffixKey: " ل.س" },
  { key: "errorRate",  icon: AlertTriangle,  min: 2,  max: 20,   step: 1,  suffixKey: "%" },
] as const;

type SliderKey = typeof SLIDERS[number]["key"];

const DEFAULTS: Record<SliderKey, number> = {
  sessions: 20,
  avgPrice: 500,
  orders: 15,
  orderValue: 150,
  errorRate: 8,
};

export default function ROICalculatorSection() {
  const t = useTranslations("roiCalculator");
  const [vals, setVals] = useState<Record<SliderKey, number>>(DEFAULTS);

  const { dailyWaste, monthlyWaste, yearlyWaste } = useMemo(() => {
    const sessionLoss = vals.sessions * (vals.errorRate / 100) * vals.avgPrice * 0.5;
    const orderLoss = vals.orders * (vals.errorRate / 100) * vals.orderValue;
    const daily = Math.round(sessionLoss + orderLoss);
    return { dailyWaste: daily, monthlyWaste: daily * 30, yearlyWaste: daily * 365 };
  }, [vals]);

  const pct = (key: SliderKey) => {
    const s = SLIDERS.find((x) => x.key === key)!;
    return ((vals[key] - s.min) / (s.max - s.min)) * 100;
  };

  return (
    <section
      id="roi"
      className="relative py-28 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(198,7,13,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(238,34,38,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <motion.span variants={fadeUp} className="section-label">
            <Calculator size={13} />
            {t("sectionLabel")}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-5xl font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base max-w-xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Sliders panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-3xl p-6 sm:p-8 space-y-7"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            {SLIDERS.map(({ key, icon: Icon, min, max, step, suffixKey }) => (
              <SliderField
                key={key}
                icon={<Icon size={16} />}
                label={t(`${key}Label` as Parameters<typeof t>[0])}
                value={vals[key]}
                min={min}
                max={max}
                step={step}
                suffix={suffixKey}
                percent={pct(key)}
                onChange={(v) => setVals((prev) => ({ ...prev, [key]: v }))}
              />
            ))}
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-4 lg:sticky lg:top-28"
          >
            {/* Daily */}
            <ResultCard
              icon={<TrendingDown size={20} />}
              label={t("dailyWaste")}
              value={dailyWaste}
              unit={t("perDay")}
              accent="#F25A58"
              delay={0}
            />
            {/* Monthly */}
            <ResultCard
              icon={<TrendingDown size={20} />}
              label={t("monthlyWaste")}
              value={monthlyWaste}
              unit={t("perMonth")}
              accent="#EE2226"
              delay={0.08}
            />
            {/* Yearly big */}
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(198,7,13,0.25) 0%, rgba(238,34,38,0.12) 100%)",
                border: "1px solid rgba(238,34,38,0.3)",
                boxShadow: "0 8px 32px rgba(198,7,13,0.2)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(238,34,38,0.2) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: "rgba(238,34,38,0.2)" }}>
                  <Zap size={16} color="#EE2226" />
                </span>
                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,135,128,0.8)" }}>
                  الهدر السنوي
                </p>
              </div>
              <AnimatedValue value={yearlyWaste} className="text-4xl font-black" style={{ color: "#fff" }} />
              <p className="text-sm mt-1" style={{ color: "rgba(255,135,128,0.7)" }}>ل.س / سنة</p>

              {/* CTA hint */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(238,34,38,0.25)" }}>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} color="#FF8780" />
                  <p className="text-xs" style={{ color: "rgba(255,135,128,0.75)" }}>
                    PlayTime يوفّر عليك هذا الهدر كاملاً
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-center leading-relaxed px-2" style={{ color: "var(--text-muted)" }}>
              {t("disclaimer")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
function SliderField({
  icon,
  label,
  value,
  min,
  max,
  step,
  suffix,
  percent,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  percent: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3" dir="rtl">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={{ background: "rgba(238,34,38,0.15)", color: "#F25A58" }}
          >
            {icon}
          </span>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {label}
          </label>
        </div>
        <span
          className="text-sm font-bold font-mono px-2.5 py-0.5 rounded-lg"
          style={{
            background: "rgba(238,34,38,0.12)",
            color: "#FF8780",
            border: "1px solid rgba(238,34,38,0.2)",
          }}
        >
          {value}{suffix}
        </span>
      </div>

      {/* Custom slider track */}
      <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(to right, #C6070D, #FF8780)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {/* Thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-75"
          style={{
            left: `calc(${percent}% - 8px)`,
            background: "#fff",
            borderColor: "#EE2226",
            boxShadow: "0 0 10px rgba(238,34,38,0.5)",
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
function ResultCard({
  icon,
  label,
  value,
  unit,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{
        background: `rgba(255,255,255,0.03)`,
        border: `1px solid rgba(255,255,255,0.07)`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.25)`,
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ background: `${accent}18`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
        <div className="flex items-baseline gap-1.5">
          <AnimatedValue value={value} className="text-xl font-black" style={{ color: accent }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
function AnimatedValue({
  value,
  className,
  style,
}: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        className={className}
        style={style}
      >
        {value.toLocaleString("ar-SA")}
      </motion.span>
    </AnimatePresence>
  );
}
