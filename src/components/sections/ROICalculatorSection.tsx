"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calculator, TrendingUp } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function ROICalculatorSection() {
  const t = useTranslations("roiCalculator");

  const [sessions, setSessions] = useState(20);
  const [avgPrice, setAvgPrice] = useState(500);
  const [errorRate, setErrorRate] = useState(8);

  const { hoursSaved, moneySaved } = useMemo(() => {
    const minutesPerSession = 12;
    const hours = Math.round((sessions * minutesPerSession * 30) / 60);
    const errors = Math.round(sessions * 30 * (errorRate / 100) * avgPrice * 0.5);
    return {
      hoursSaved: hours,
      moneySaved: errors,
    };
  }, [sessions, avgPrice, errorRate]);

  return (
    <section id="roi" className="py-28" style={{ background: "var(--bg-card)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-12"
        >
          <motion.span variants={fadeUp} className="section-label">
            <Calculator size={13} />
            {t("sectionLabel")}
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base max-w-xl" style={{ color: "var(--text-muted)" }}>
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="card p-6 sm:p-8 space-y-8"
        >
          <div className="space-y-6">
            <SliderField label={t("sessionsLabel")} value={sessions} min={5} max={80} onChange={setSessions} suffix="" />
            <SliderField label={t("priceLabel")} value={avgPrice} min={200} max={2000} step={50} onChange={setAvgPrice} suffix=" ل.س" />
            <SliderField label={t("errorLabel")} value={errorRate} min={2} max={20} onChange={setErrorRate} suffix="%" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <ResultCard label={t("hoursSaved")} value={String(hoursSaved)} unit=" ساعة" accent="#5c8fd6" />
            <ResultCard label={t("moneySaved")} value={String(moneySaved)} unit={` ${t("perMonth")}`} accent="#10b981" />
          </div>

          <div
            className="flex items-center gap-3 rounded-2xl p-4"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <TrendingUp size={22} color="#10b981" />
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {t("roiNote")} — {t("annualPlan")}: $25
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
        <span className="text-sm font-bold" style={{ color: "var(--brand-pink)" }}>{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "var(--primary-light)" }}
      />
    </div>
  );
}

function ResultCard({ label, value, unit, accent }: { label: string; value: string; unit: string; accent: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: `1px solid ${accent}30` }}>
      <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-2xl sm:text-3xl font-black" style={{ color: accent }}>
        {value}
        <span className="text-sm font-semibold ms-1">{unit}</span>
      </p>
    </div>
  );
}
