"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calculator } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

export default function ROICalculatorSection() {
  const t = useTranslations("roiCalculator");

  const [sessions, setSessions] = useState(20);
  const [avgPrice, setAvgPrice] = useState(500);
  const [orders, setOrders] = useState(15);
  const [orderValue, setOrderValue] = useState(150);
  const [errorRate, setErrorRate] = useState(8);

  const { dailyWaste, monthlyWaste } = useMemo(() => {
    const sessionLoss = sessions * (errorRate / 100) * avgPrice * 0.5;
    const orderLoss = orders * (errorRate / 100) * orderValue;
    const daily = Math.round(sessionLoss + orderLoss);
    return { dailyWaste: daily, monthlyWaste: daily * 30 };
  }, [sessions, avgPrice, orders, orderValue, errorRate]);

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
          dir="ltr"
        >
          <div className="space-y-6">
            <SliderField label={t("sessionsLabel")} value={sessions} min={5} max={80} onChange={setSessions} suffix="" />
            <SliderField label={t("priceLabel")} value={avgPrice} min={200} max={2000} step={50} onChange={setAvgPrice} suffix=" ل.س" />
            <SliderField label={t("ordersLabel")} value={orders} min={0} max={60} onChange={setOrders} suffix="" />
            <SliderField label={t("orderValueLabel")} value={orderValue} min={50} max={500} step={25} onChange={setOrderValue} suffix=" ل.س" />
            <SliderField label={t("errorLabel")} value={errorRate} min={2} max={20} onChange={setErrorRate} suffix="%" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <ResultCard label={t("dailyWaste")} value={String(dailyWaste)} unit={t("perDay")} accent="#F25A58" />
            <ResultCard label={t("monthlyWaste")} value={String(monthlyWaste)} unit={t("perMonth")} accent="#E6050D" />
          </div>

          <p className="text-xs text-center leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t("disclaimer")}
          </p>
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
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
        <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl p-4 text-center" style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}>
      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-2xl font-black" style={{ color: accent }}>
        {value}
        <span className="text-sm font-semibold ms-1">{unit}</span>
      </p>
    </div>
  );
}
