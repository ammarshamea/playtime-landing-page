"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Monitor, Cpu, Circle } from "lucide-react";
import { fadeUp, staggerContainer, scaleIn, viewportConfig } from "@/lib/animations";

function useSessionTimer(initialSeconds: number, running: boolean) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useRevenueCounter(base: number, running: boolean) {
  const [revenue, setRevenue] = useState(base);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRevenue((r) => r + Math.floor(Math.random() * 3) + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);
  return revenue;
}

interface StationCardProps {
  name: string;
  type: "PS" | "PC";
  status: "available" | "active";
  initialSeconds?: number;
  ratePerHour?: number;
  t: ReturnType<typeof useTranslations<"preview">>;
}

function StationCard({ name, type, status, initialSeconds = 0, ratePerHour = 500, t }: StationCardProps) {
  const running = status === "active";
  const elapsed = useSessionTimer(initialSeconds, running);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const price = Math.floor((seconds / 3600) * ratePerHour);
  const Icon = type === "PS" ? Monitor : Cpu;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${running ? "var(--border-strong)" : "var(--border)"}`,
        boxShadow: running ? "0 0 20px rgba(53,42,95,0.18)" : "none",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: running ? "rgba(53,42,95,0.2)" : "rgba(255,255,255,0.04)",
            }}
          >
            <Icon size={14} color={running ? "var(--brand-pink)" : "var(--text-muted)"} />
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            {name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Circle
            size={6}
            fill={running ? "var(--green)" : "var(--text-muted)"}
            color={running ? "var(--green)" : "var(--text-muted)"}
          />
          <span
            className="text-xs font-medium"
            style={{ color: running ? "var(--green)" : "var(--text-muted)" }}
          >
            {running ? t("active") : t("available")}
          </span>
        </div>
      </div>

      {running && (
        <div className="flex justify-between text-xs">
          <div>
            <div style={{ color: "var(--text-muted)" }}>{t("elapsed")}</div>
            <div className="font-mono font-bold mt-0.5" style={{ color: "var(--brand-pink)" }}>
              {elapsed}
            </div>
          </div>
          <div className="text-end">
            <div style={{ color: "var(--text-muted)" }}>{t("price")}</div>
            <div className="font-bold mt-0.5" style={{ color: "var(--green)" }} suppressHydrationWarning>
              {String(price)} {t("currency")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppPreviewSection() {
  const t = useTranslations("preview");
  const revenue = useRevenueCounter(12400, true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="preview" className="py-24" style={{ background: "var(--bg)" }}>
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
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="max-w-2xl mx-auto"
        >
          {/* Mock app window */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(53,42,95,0.14)",
            }}
          >
            {/* Window chrome */}
            <div
              className="px-4 py-3 flex items-center gap-2 border-b"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--red)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--orange)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--green)" }} />
              <span
                className="mx-auto text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Playtime Manager
              </span>
            </div>

            {/* Dashboard content */}
            <div className="p-5 flex flex-col gap-4">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    صالة الألعاب
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    اليوم
                  </div>
                </div>
                {/* Revenue card */}
                <div
                  className="px-4 py-2 rounded-2xl text-end"
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                  }}
                >
                  <div className="text-xs text-white/70">{t("todayRevenue")}</div>
                  <div className="text-lg font-bold text-white font-mono" suppressHydrationWarning>
                    {mounted ? String(revenue) : "12400"} {t("currency")}
                  </div>
                </div>
              </div>

              {/* Station cards */}
              <div className="grid gap-3">
                <StationCard
                  name="PlayStation 1"
                  type="PS"
                  status="available"
                  t={t}
                />
                <StationCard
                  name="PlayStation 2"
                  type="PS"
                  status="active"
                  initialSeconds={3621}
                  ratePerHour={500}
                  t={t}
                />
                <StationCard
                  name="PC Gaming 1"
                  type="PC"
                  status="active"
                  initialSeconds={1840}
                  ratePerHour={400}
                  t={t}
                />
              </div>

              {/* Active sessions pill */}
              <div
                className="flex items-center justify-center gap-2 py-2 rounded-xl"
                style={{ background: "var(--bg-elevated)" }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "var(--green)" }}
                />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  2 {t("activeSessions")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
