"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  const toggle = () => {
    const next = locale === "ar" ? "en" : "ar";
    // Replace locale prefix in path
    const withoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";
    router.push(`/${next}${withoutLocale}`);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer"
      style={{
        borderColor: "var(--border-strong)",
        color: "var(--text-secondary)",
        background: "var(--bg-card)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
    >
      <Globe size={14} />
      <span>{t("toggleLang")}</span>
    </button>
  );
}
