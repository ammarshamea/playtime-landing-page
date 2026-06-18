"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import FlagSyria from "@/components/icons/FlagSyria";
import FlagUS from "@/components/icons/FlagUS";

const LOCALES = [
  { code: "ar" as const, Flag: FlagSyria, labelKey: "langAr" as const },
  { code: "en" as const, Flag: FlagUS, labelKey: "langEn" as const },
];

export default function LanguageToggle({ compact }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  const setLocale = (next: "ar" | "en") => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-xl p-0.5 ${compact ? "" : ""}`}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--border)",
      }}
      role="group"
      aria-label={t("langSwitcher")}
    >
      {LOCALES.map(({ code, Flag, labelKey }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            title={t(labelKey)}
            aria-label={t(labelKey)}
            aria-pressed={active}
            className="relative flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              width: compact ? 36 : 40,
              height: compact ? 28 : 30,
              opacity: active ? 1 : 0.55,
              boxShadow: active ? "0 0 0 2px rgba(155,139,196,0.55)" : "none",
              background: active ? "rgba(53,42,95,0.35)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.opacity = "0.55";
            }}
          >
            <Flag className="w-7 h-5 rounded-[3px] overflow-hidden shadow-sm" />
          </button>
        );
      })}
    </div>
  );
}
