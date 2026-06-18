"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X, Minus, Scale } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

type CellValue = boolean | "partial";

type ComparisonRow = {
  feature: string;
  pen: CellValue;
  excel: CellValue;
  playtime: CellValue;
};

function CellIcon({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  const t = useTranslations("comparison");

  if (value === true) {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          background: highlight ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.12)",
          border: `1px solid ${highlight ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.25)"}`,
        }}
      >
        <Check size={16} color={highlight ? "#34d399" : "#10b981"} strokeWidth={2.5} />
      </span>
    );
  }

  if (value === "partial") {
    return (
      <span
        className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2"
        style={{
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.3)",
        }}
      >
        <Minus size={14} color="#f59e0b" className="sm:hidden" />
        <span className="hidden sm:inline text-[10px] font-semibold" style={{ color: "#f59e0b" }}>
          {t("partial")}
        </span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full"
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      <X size={15} color="#f87171" strokeWidth={2.5} />
    </span>
  );
}

function MobileComparisonCard({
  row,
  columns,
}: {
  row: ComparisonRow;
  columns: { key: "pen" | "excel" | "playtime"; label: string; highlight?: boolean }[];
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        {row.feature}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col) => (
          <div key={col.key} className="flex flex-col items-center gap-1.5 text-center">
            <span className="text-[10px] font-medium" style={{ color: col.highlight ? "var(--brand-pink)" : "var(--text-muted)" }}>
              {col.label}
            </span>
            <CellIcon value={row[col.key]} highlight={col.highlight} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparisonSection() {
  const t = useTranslations("comparison");
  const rows = t.raw("rows") as ComparisonRow[];

  const columns = [
    { key: "pen" as const, label: t("columns.pen") },
    { key: "excel" as const, label: t("columns.excel") },
    { key: "playtime" as const, label: t("columns.playtime"), highlight: true },
  ];

  return (
    <section id="comparison" className="relative py-28 overflow-hidden" style={{ background: "var(--bg-card)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(53,42,95,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-12"
        >
          <motion.span variants={fadeUp} className="section-label">
            <Scale size={13} />
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
            className="text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Mobile: stacked cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="md:hidden flex flex-col gap-3"
        >
          {rows.map((row) => (
            <motion.div key={row.feature} variants={fadeUp}>
              <MobileComparisonCard row={row} columns={columns} />
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop: table */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="hidden md:block overflow-x-auto rounded-[28px] border"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg)",
            boxShadow: "0 20px 60px rgba(53,42,95,0.15)",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="p-4 sm:p-5 text-start text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {t("columns.feature")}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="p-4 sm:p-5 text-center text-sm font-semibold"
                    style={{
                      color: col.highlight ? "var(--brand-pink)" : "var(--text-secondary)",
                      background: col.highlight ? "rgba(53,42,95,0.25)" : "transparent",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <td className="p-4 sm:p-5 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {row.feature}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="p-4 sm:p-5 text-center"
                      style={{
                        background: col.highlight ? "rgba(53,42,95,0.12)" : "transparent",
                      }}
                    >
                      <CellIcon value={row[col.key]} highlight={col.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
