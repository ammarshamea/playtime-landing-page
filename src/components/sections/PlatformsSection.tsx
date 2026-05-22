"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Monitor, Smartphone, Apple, Terminal } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

const ICONS = [Monitor, Smartphone, Apple, Terminal];

export default function PlatformsSection() {
  const t = useTranslations("platforms");
  const items = t.raw("items") as { name: string; desc: string }[];

  return (
    <section className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center gap-4 mb-16"
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
          className="flex flex-wrap justify-center gap-4"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px var(--primary-glow)",
                  transition: { duration: 0.2 },
                }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl cursor-default"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(53,42,95,0.16)" }}
                >
                  <Icon size={18} color="var(--brand-pink)" />
                </div>
                <div className="text-start">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.desc}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
