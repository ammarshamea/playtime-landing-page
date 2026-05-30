"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Smartphone, Lock, Database, Cloud, ShieldCheck } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const ICONS = [Smartphone, Lock, Database, Cloud];
const COLORS = ["#9b8bc4", "#f59e0b", "#10b981", "#5c8fd6"];

export default function SecuritySection() {
  const t = useTranslations("security");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="relative py-28 overflow-hidden" style={{ background: "var(--bg-card)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(53,42,95,0.2) 0%, transparent 70%)",
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
            <ShieldCheck size={13} />
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
            className="text-base max-w-2xl leading-relaxed"
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
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="card p-5 sm:p-6 flex flex-col gap-4 h-full"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${COLORS[i]}15`,
                    border: `1px solid ${COLORS[i]}35`,
                  }}
                >
                  <Icon size={20} color={COLORS[i]} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
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
