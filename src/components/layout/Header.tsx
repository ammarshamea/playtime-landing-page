"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import BrandLogo from "@/components/ui/BrandLogo";

const NAV_LINKS = [
  { key: "features", href: "#features" },
  { key: "preview", href: "#preview" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "reports", href: "#reports" },
  { key: "pricing", href: "#pricing" },
  { key: "comparison", href: "#comparison" },
  { key: "faq", href: "#faq" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(17, 14, 28, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <BrandLogo
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
            style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.35))" }}
          />
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            Playtime
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors duration-150"
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a
            href="#cta"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "var(--brand-gradient)" }}
          >
            {t("getStarted")}
          </a>
          <button
            className="md:hidden p-2 rounded-lg"
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
          className="md:hidden border-t py-4 px-4 flex flex-col gap-1"
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
          <a
            href="#cta"
            className="mt-2 text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--brand-gradient)" }}
            onClick={() => setMenuOpen(false)}
          >
            {t("getStarted")}
          </a>
        </div>
      )}
    </header>
  );
}
