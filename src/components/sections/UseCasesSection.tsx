"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gamepad2, Monitor, CircleDot, Building2, Users } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const ICONS = [Gamepad2, Monitor, CircleDot, Building2];

export default function UseCasesSection() {
  const t = useTranslations("useCases");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-14"
        >
          <motion.span variants={fadeUp} className="section-label">
            <Users size={13} />
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
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div key={item.title} variants={fadeUp} whileHover={{ y: -4 }} className="card p-5 flex flex-col gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(53,42,95,0.2)", border: "1px solid var(--border)" }}>
                  <Icon size={20} color="var(--brand-pink)" />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
