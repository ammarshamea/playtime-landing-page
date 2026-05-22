"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Monitor,
  Timer,
  BarChart3,
  WifiOff,
  Languages,
  ShieldCheck,
} from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const ICONS = [Monitor, Timer, BarChart3, WifiOff, Languages, ShieldCheck];
const COLORS = [
  "rgba(53,42,95,0.16)",
  "rgba(16,185,129,0.12)",
  "rgba(245,158,11,0.12)",
  "rgba(92,78,138,0.18)",
  "rgba(236,72,153,0.12)",
  "rgba(239,68,68,0.12)",
];
const ICON_COLORS = ["#352a5f", "#10b981", "#f59e0b", "#6b5a9e", "#9b8bc4", "#f87171"];

export default function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section id="features" className="py-24" style={{ background: "var(--bg-card)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base max-w-xl"
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
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card p-6 flex flex-col gap-4 cursor-default"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: COLORS[i], border: `1px solid ${ICON_COLORS[i]}30` }}
                >
                  <Icon size={20} color={ICON_COLORS[i]} />
                </div>
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
