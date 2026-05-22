"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUp, staggerContainer, popIn, viewportConfig, EASE_OUT_EXPO } from "@/lib/animations";

const STEP_COLORS = ["#9b8bc4", "#e879d9", "#10b981"] as const;

export default function HowItWorksSection() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { num: string; title: string; desc: string }[];

  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden" style={{ background: "var(--bg-card)" }}>
      {/* Ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(53,42,95,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-20"
        >
          <motion.span variants={fadeUp} className="section-label">
            {t("sectionLabel")}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* ── Animated connector SVG (desktop) ── */}
          <div className="hidden md:block absolute top-10 inset-x-[16.667%] h-px overflow-visible pointer-events-none">
            <svg
              width="100%"
              height="4"
              viewBox="0 0 100 4"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <motion.path
                d="M 0 2 L 100 2"
                stroke="url(#lineGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.3 }}
              />
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#352a5f" stopOpacity="0" />
                  <stop offset="30%"  stopColor="#9b8bc4" stopOpacity="0.7" />
                  <stop offset="70%"  stopColor="#e879d9" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10b981"  stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid md:grid-cols-3 gap-10"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-5"
              >
                {/* Step number — bounce in */}
                <motion.div
                  variants={popIn}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: `0 0 50px ${STEP_COLORS[i]}80`,
                    transition: { type: "spring", stiffness: 320, damping: 16 },
                  }}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 40% 35%, ${STEP_COLORS[i]}22, var(--bg-elevated) 70%)`,
                    border: `2px solid ${STEP_COLORS[i]}60`,
                    boxShadow: `0 0 28px ${STEP_COLORS[i]}35`,
                  }}
                >
                  {/* Orbiting dot */}
                  <motion.div
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{ background: STEP_COLORS[i], top: "6px", right: "6px" }}
                    animate={{
                      rotate: [0, 360],
                      x: [0, 6, 0, -6, 0],
                      y: [0, -6, 0, 6, 0],
                    }}
                    transition={{
                      rotate: { repeat: Infinity, duration: 4, ease: "linear" },
                      x: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                      y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    }}
                  />
                  <span
                    className="text-2xl font-black"
                    style={{ color: STEP_COLORS[i] }}
                  >
                    {step.num}
                  </span>
                </motion.div>

                <div className="flex flex-col gap-2">
                  <motion.h3
                    variants={fadeUp}
                    className="font-bold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    variants={fadeUp}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.desc}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
