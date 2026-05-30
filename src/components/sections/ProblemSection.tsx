"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Timer, Coffee, TrendingDown, Eye, ArrowRight, CheckCircle2 } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const ICONS = [Timer, Coffee, TrendingDown, Eye];

export default function ProblemSection() {
  const t = useTranslations("problem");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="py-24" style={{ background: "var(--bg)" }}>
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
            className="text-base max-w-xl leading-relaxed"
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
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card p-6 flex flex-col gap-4"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <Icon size={18} color="var(--red)" />
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Solution callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl mx-auto max-w-sm"
          style={{
            background: "rgba(53,42,95,0.12)",
            border: "1px solid var(--border-strong)",
          }}
        >
          <CheckCircle2 size={20} style={{ color: "var(--green)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            {t("solution")}
          </span>
          <ArrowRight size={16} style={{ color: "var(--primary-light)" }} />
        </motion.div>
      </div>
    </section>
  );
}
