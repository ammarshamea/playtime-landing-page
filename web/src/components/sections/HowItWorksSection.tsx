"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig, EASE_OUT_EXPO } from "@/lib/animations";
import { whatsappUrl } from "@/lib/whatsapp";
import Card3D from "@/components/ui/Card3D";

const STEP_COLORS   = ["#FF8780", "#EE2226", "#C6070D"] as const;
const STEP_COLORS_R = ["255,135,128", "238,34,38", "198,7,13"] as const;

// Each step enters from a different 3D angle
const stepReveal = [
  { hidden: { opacity: 0, x: -60, rotateY: -30, rotateX: 10 }, delay: 0 },
  { hidden: { opacity: 0, y:  70, rotateX: -30,              }, delay: 0.15 },
  { hidden: { opacity: 0, x:  60, rotateY:  30, rotateX: 10 }, delay: 0.3 },
];

export default function HowItWorksSection() {
  const t    = useTranslations("howItWorks");
  const tCta = useTranslations("cta");
  const steps = t.raw("steps") as { num: string; title: string; desc: string }[];

  return (
    <section
      id="how-it-works"
      className="py-28 relative overflow-hidden"
      style={{ background: "var(--bg-card)" }}
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(135,3,5,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Heading */}
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
          <motion.p
            variants={fadeUp}
            className="text-base max-w-xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <div className="relative" style={{ perspective: 1400 }}>
          {/* SVG connector line */}
          <div className="hidden md:block absolute top-10 inset-x-[16.667%] h-px overflow-visible pointer-events-none">
            <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none" className="overflow-visible">
              <motion.path
                d="M 0 2 L 100 2"
                stroke="url(#lineGrad2)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.4 }}
              />
              <defs>
                <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#870305" stopOpacity="0" />
                  <stop offset="30%"  stopColor="#FF8780" stopOpacity="0.8" />
                  <stop offset="70%"  stopColor="#EE2226" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C6070D" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Steps — 3D entrance from different angles */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const cfg    = STEP_COLORS[i];
              const cfgRgb = STEP_COLORS_R[i];
              const rev    = stepReveal[i];

              return (
                <motion.div
                  key={i}
                  initial={{ ...rev.hidden, opacity: 0, filter: "blur(8px)" }}
                  whileInView={{
                    opacity: 1, x: 0, y: 0,
                    rotateX: 0, rotateY: 0,
                    filter: "blur(0px)",
                  }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    type: "spring", stiffness: 110, damping: 18,
                    delay: rev.delay,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card3D
                    tilt={10}
                    accent={`rgba(${cfgRgb}, 0.3)`}
                    liftZ={18}
                    className="rounded-[22px] p-6 flex flex-col items-center text-center gap-5"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, rgba(${cfgRgb},0.1) 0%, var(--bg-card) 70%)`,
                      border: `1px solid rgba(${cfgRgb},0.28)`,
                      boxShadow: `0 16px 48px rgba(${cfgRgb},0.1)`,
                    }}
                  >
                    {/* Step bubble — pop in */}
                    <motion.div
                      initial={{ scale: 0, rotateY: -180 }}
                      whileInView={{ scale: 1, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: rev.delay + 0.2 }}
                      whileHover={{
                        scale: 1.12,
                        boxShadow: `0 0 50px ${cfg}80`,
                        transition: { type: "spring", stiffness: 320, damping: 16 },
                      }}
                      className="relative w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at 40% 35%, rgba(${cfgRgb},0.22), var(--bg-elevated) 70%)`,
                        border: `2px solid rgba(${cfgRgb},0.6)`,
                        boxShadow: `0 0 28px rgba(${cfgRgb},0.35)`,
                      }}
                    >
                      {/* Orbiting particle */}
                      <motion.div
                        className="absolute w-2.5 h-2.5 rounded-full"
                        style={{ background: cfg, top: "6px", right: "6px" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ rotate: { repeat: Infinity, duration: 3.5, ease: "linear" } }}
                      />
                      <span className="text-2xl font-black" style={{ color: cfg }}>
                        {step.num}
                      </span>
                    </motion.div>

                    {/* Step text */}
                    <div>
                      <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="flex justify-center mt-14"
          >
            <motion.a
              href={whatsappUrl(tCta("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
              style={{
                background: "#25D366",
                boxShadow: "0 8px 32px rgba(37,211,102,0.35)",
              }}
              whileHover={{ scale: 1.04, y: -3, boxShadow: "0 14px 40px rgba(37,211,102,0.45)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
            >
              <MessageCircle size={20} />
              {t("whatsappCta")}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
