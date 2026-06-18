"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import LanguageToggle from "./LanguageToggle";
import { whatsappUrl } from "@/lib/whatsapp";

const NAV_LINKS = [
  { key: "features", href: "#features" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "pricing", href: "#pricing" },
  { key: "faq", href: "#faq" },
  { key: "support", href: "#support" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const waHref = whatsappUrl(tCta("whatsappMessage"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(17, 14, 28, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo — start in RTL = right */}
        <a href="#" className="flex items-center gap-2 shrink-0 group z-10">
          <BrandLogo
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain transition-transform group-hover:scale-105"
            style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.35))" }}
          />
          <span
            className="font-bold text-sm hidden sm:inline"
            style={{ color: "var(--text-primary)" }}
          >
            Playtime
          </span>
        </a>

        {/* Center nav — desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="px-2.5 xl:px-3 py-1.5 text-sm rounded-lg transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "var(--text-secondary)")
              }
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* Language + WhatsApp + menu — end in RTL = left */}
        <div className="flex items-center gap-2 z-10">
          <LanguageToggle compact />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold text-white shrink-0 transition-opacity hover:opacity-90 active:scale-95"
            style={{
              background: "#25D366",
              boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
            }}
          >
            <WhatsAppIcon size={18} />
            <span>{t("whatsapp")}</span>
          </a>
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t py-4 px-4 flex flex-col gap-1"
          style={{
            background: "rgba(17, 14, 28, 0.97)",
            backdropFilter: "blur(16px)",
            borderColor: "var(--border)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMenuOpen(false)}
            >
              {t(link.key)}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t flex justify-center" style={{ borderColor: "var(--border)" }}>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
