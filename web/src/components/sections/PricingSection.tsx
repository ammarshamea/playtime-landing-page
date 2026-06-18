"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, CalendarRange, Crown, Gift, Sparkles, CreditCard, Check, Loader2 } from "lucide-react";
import { fadeUp, scaleIn, popIn, staggerContainer, viewportConfig } from "@/lib/animations";
import { fetchUsdExchangeRate } from "@/lib/exchange-rate-api";
import { computeSypPrice, formatExchangeFetchedAt, formatSyp } from "@/lib/format-currency";
import { openContactChat } from "@/lib/open-contact-chat";
import { getPlanPriceUsd } from "@/lib/pricing-plans";

type Plan = {
  id: string;
  title: string;
  duration: string;
  description: string;
  cta: string;
  features: string[];
};

const PLAN_STYLES = {
  monthly: {
    icon: Calendar,
    accent: "#5c8fd6",
    glow: "rgba(92,143,214,0.2)",
    border: "rgba(92,143,214,0.35)",
    bg: "linear-gradient(160deg, rgba(92,143,214,0.08) 0%, var(--bg-card) 100%)",
  },
  semiannual: {
    icon: CalendarRange,
    accent: "#9b8bc4",
    glow: "rgba(155,139,196,0.28)",
    border: "rgba(155,139,196,0.4)",
    bg: "linear-gradient(160deg, rgba(107,90,158,0.14) 0%, var(--bg-card) 100%)",
  },
  annual: {
    icon: Crown,
    accent: "#e879d9",
    glow: "rgba(232,121,217,0.45)",
    border: "rgba(232,121,217,0.55)",
    bg: "linear-gradient(160deg, rgba(232,121,217,0.13) 0%, var(--bg-card) 100%)",
  },
} as const;

type CurrencyMode = "USD" | "SYP";

function CurrencyToggle({
  mode,
  loading,
  onSelectUsd,
  onSelectSyp,
  labels,
}: {
  mode: CurrencyMode;
  loading: boolean;
  onSelectUsd: () => void;
  onSelectSyp: () => void;
  labels: { usd: string; syp: string };
}) {
  return (
    <div
      className="inline-flex items-center rounded-full p-1 gap-0.5"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      role="group"
      aria-label={labels.usd}
    >
      <button
        type="button"
        disabled={loading}
        onClick={onSelectUsd}
        className="rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[72px]"
        style={{
          background: mode === "USD" ? "rgba(255,255,255,0.12)" : "transparent",
          color: mode === "USD" ? "#fff" : "rgba(255,255,255,0.55)",
        }}
      >
        USD
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={onSelectSyp}
        className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[88px]"
        style={{
          background: mode === "SYP" ? "rgba(167, 139, 250, 0.25)" : "transparent",
          color: mode === "SYP" ? "#fff" : "rgba(255,255,255,0.55)",
        }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        {labels.syp}
      </button>
    </div>
  );
}

export default function PricingSection() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const plans = t.raw("plans") as Plan[];
  const promos = t.raw("promos") as { title: string; desc: string }[];
  const sypLocale = locale === "ar" ? "ar-SY" : "en-US";

  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>("USD");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeFetchedAt, setExchangeFetchedAt] = useState<string | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  const loadRateAndShowSyp = useCallback(async () => {
    try {
      setIsLoadingRate(true);
      setExchangeError(null);
      const data = await fetchUsdExchangeRate();
      setExchangeRate(data.rate);
      setExchangeFetchedAt(data.fetched_at);
      setCurrencyMode("SYP");
    } catch (err) {
      setExchangeError(err instanceof Error ? err.message : t("currency.error"));
      setCurrencyMode("USD");
    } finally {
      setIsLoadingRate(false);
    }
  }, [t]);

  const handleSelectUsd = () => {
    setExchangeError(null);
    setCurrencyMode("USD");
  };

  const handleSelectSyp = () => {
    if (currencyMode === "SYP") return;
    if (exchangeRate !== null) {
      setCurrencyMode("SYP");
      return;
    }
    void loadRateAndShowSyp();
  };

  const handlePlanCta = (planTitle: string) => {
    openContactChat({
      prefillMessage: t("planContactPrefill", { plan: planTitle }),
    });
  };

  return (
    <section id="pricing" className="relative py-28 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 35%, rgba(53,42,95,0.32) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center gap-4 mb-8"
        >
          <motion.span variants={fadeUp} className="section-label">
            <CreditCard size={13} />
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

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-2 mt-2">
            <CurrencyToggle
              mode={currencyMode}
              loading={isLoadingRate}
              onSelectUsd={handleSelectUsd}
              onSelectSyp={handleSelectSyp}
              labels={{ usd: t("currency.usdShort"), syp: t("currency.sypShort") }}
            />
            {exchangeError && (
              <p className="text-xs max-w-sm" style={{ color: "#fca5a5" }}>
                {exchangeError}{" "}
                <button type="button" className="underline" onClick={() => void loadRateAndShowSyp()}>
                  {t("currency.retry")}
                </button>
              </p>
            )}
            {currencyMode === "SYP" && exchangeFetchedAt && !exchangeError && (
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {t("currency.lastUpdate", {
                  time: formatExchangeFetchedAt(exchangeFetchedAt, locale),
                })}
              </p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch"
        >
          {plans.map((plan) => {
            const style = PLAN_STYLES[plan.id as keyof typeof PLAN_STYLES];
            const Icon = style.icon;
            const featured = plan.id === "annual";
            const priceUsd = getPlanPriceUsd(plan.id);
            const showSyp = currencyMode === "SYP" && exchangeRate !== null;
            const priceSyp = showSyp ? computeSypPrice(priceUsd, exchangeRate) : null;

            return (
              <motion.div
                key={plan.id}
                variants={featured ? popIn : scaleIn}
                animate={featured ? { y: [0, -6, 0] } : undefined}
                transition={featured ? { y: { repeat: Infinity, duration: 4, ease: "easeInOut" } } : undefined}
                whileHover={{
                  y: featured ? -10 : -4,
                  boxShadow: `0 24px 56px ${style.glow}`,
                  transition: { duration: 0.25 },
                }}
                className={`relative flex flex-col rounded-[28px] p-6 sm:p-7 ${featured ? "md:-mt-2 md:scale-[1.03]" : ""}`}
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  boxShadow: featured ? `0 20px 48px ${style.glow}` : `0 8px 24px ${style.glow}`,
                }}
              >
                {featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-0.5 text-[11px] font-bold"
                    style={{
                      background: "linear-gradient(135deg, #e879d9, #9b8bc4)",
                      color: "#fff",
                    }}
                  >
                    {t("mostSavings")}
                  </span>
                )}

                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${style.accent}15`, border: `1px solid ${style.accent}30` }}
                >
                  <Icon size={22} color={style.accent} strokeWidth={1.75} />
                </div>

                <h3 className="text-center text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  {plan.title}
                </h3>

                <div className="text-center mb-3 min-h-[4.5rem] flex flex-col items-center justify-center">
                  {showSyp && priceSyp !== null ? (
                    <>
                      <div className="flex items-baseline justify-center gap-1 flex-wrap">
                        <span
                          className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatSyp(priceSyp, sypLocale)}
                        </span>
                        <span className="text-lg font-semibold" style={{ color: style.accent }}>
                          ل.س
                        </span>
                      </div>
                      <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                        {t("currency.approx")}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-baseline justify-center">
                      <span
                        className="text-5xl sm:text-6xl font-black tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {priceUsd}
                      </span>
                      <span className="text-2xl font-bold ms-1" style={{ color: style.accent }}>
                        $
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-center mb-4 leading-relaxed px-1" style={{ color: "var(--text-muted)" }}>
                  {plan.description}
                </p>

                <ul className="flex flex-col gap-2 mb-5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <Check size={14} className="shrink-0 mt-0.5" style={{ color: style.accent }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3">
                  <span
                    className="block text-center rounded-full py-2 text-xs font-medium"
                    style={{
                      background: `${style.accent}15`,
                      border: `1px solid ${style.accent}25`,
                      color: style.accent,
                    }}
                  >
                    {plan.duration}
                  </span>

                  <motion.button
                    type="button"
                    onClick={() => handlePlanCta(plan.title)}
                    className="block w-full text-center rounded-xl py-3 text-sm font-semibold text-white"
                    style={{
                      background: featured
                        ? `linear-gradient(135deg, ${style.accent}, var(--brand-violet))`
                        : "rgba(139, 92, 246, 0.5)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {currencyMode === "SYP" && (
          <p className="mt-5 text-center text-[11px] max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            {t("currency.disclaimer")}
          </p>
        )}

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-8 text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("paymentNote")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-1 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {t("trustNote")}
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-8 grid sm:grid-cols-2 gap-4"
        >
          {promos.map((promo, i) => {
            const PromoIcon = i === 0 ? Gift : Sparkles;
            const accent = i === 0 ? "#5c8fd6" : "#e879d9";
            return (
              <motion.div
                key={promo.title}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="flex items-center gap-4 rounded-2xl p-4 border"
                style={{ background: "var(--bg-card)", borderColor: `${accent}30` }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${accent}12` }}
                >
                  <PromoIcon size={20} color={accent} />
                </div>
                <div className="text-start">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {promo.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {promo.desc}
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
