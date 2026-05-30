import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import BrandLogo from "@/components/ui/BrandLogo";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/whatsapp";

export default function Footer() {
  const t = useTranslations("footer");
  const tCta = useTranslations("cta");

  const links = [
    { key: "features", href: "#features" },
    { key: "pricing", href: "#pricing" },
    { key: "faq", href: "#faq" },
    { key: "support", href: "#support" },
  ] as const;

  const waHref = whatsappUrl(tCta("whatsappMessage"));

  return (
    <footer
      className="border-t py-12"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-start">
            <div className="flex items-center gap-2.5">
              <BrandLogo
                className="h-9 w-9 object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(139,92,246,0.3))" }}
              />
              <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                Playtime Manager
              </span>
            </div>
            <p className="text-xs max-w-sm" style={{ color: "var(--text-muted)" }}>
              {t("tagline")}
            </p>
            <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              {t("syriaBadge")}
            </p>
            <p className="text-[10px] max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("privacyShort")}
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:underline"
              style={{ color: "#25D366" }}
              dir="ltr"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </div>

          <nav className="flex flex-wrap justify-center gap-4">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm transition-colors duration-150 hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                {t(`links.${link.key}`)}
              </a>
            ))}
          </nav>

          <LanguageToggle compact />
        </div>

        <div
          className="mt-8 pt-8 border-t text-center text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          © {new Date().getFullYear()} {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
