"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

export default function HowItWorksSection() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { num: string; title: string; desc: string }[];

  return (
    <section id="how-it-works" className="py-24" style={{ background: "var(--bg-card)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
        </motion.div>

        <div className="relative">
          {/* Connector line — visible on md+ */}
          <div
            className="hidden md:block absolute top-10 left-[calc(1/6*100%)] right-[calc(1/6*100%)] h-px"
            style={{
              background: "linear-gradient(to right, transparent, var(--border-strong), transparent)",
            }}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Step number bubble */}
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "2px solid var(--primary)",
                      boxShadow: "0 0 24px var(--primary-glow)",
                    }}
                  >
                    <span
                      className="text-2xl font-black"
                      style={{ color: "var(--primary-light)" }}
                    >
                      {step.num}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
