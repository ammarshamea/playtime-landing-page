"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowDown, Gamepad2, Zap, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { staggerContainer, wordReveal, fadeUp, blurReveal, EASE_OUT_EXPO } from "@/lib/animations";
import BrandLogo from "@/components/ui/BrandLogo";
import { openContactChat } from "@/lib/open-contact-chat";

const ParticleCanvas = dynamic(() => import("@/components/canvas/ParticleCanvas"), { ssr: false });

// ── Magnetic CTA button ──────────────────────────────────────────────────────
function MagneticBtn({
  href,
  children,
  primary,
  whatsapp,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  whatsapp?: boolean;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 18 });
  const sy = useSpring(my, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.22);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.22);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  const bg = whatsapp
    ? "#25D366"
    : primary
    ? "var(--brand-gradient)"
    : undefined;

  return (
    <motion.a
      href={href}
      target={whatsapp ? "_blank" : undefined}
      rel={whatsapp ? "noopener noreferrer" : undefined}
      style={{
        x: sx, y: sy,
        background: bg,
        border: primary || whatsapp ? undefined : "1px solid var(--border-strong)",
        color: primary || whatsapp ? "#fff" : "var(--text-primary)",
        boxShadow: primary
          ? "0 8px 40px var(--primary-glow)"
          : whatsapp
          ? "0 8px 32px rgba(37,211,102,0.35)"
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.04 }}
      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-shadow duration-300 cursor-pointer"
    >
      {children}
    </motion.a>
  );
}

// ── Word-split title ──────────────────────────────────────────────────────────
function AnimatedTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      variants={staggerContainer}
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] tracking-tight"
      style={{ perspective: "800px" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordReveal}
          className="inline-block me-[0.22em] gradient-text"
          style={{ transformOrigin: "bottom center" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.35]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const bgYSpring = useSpring(bgY, { stiffness: 60, damping: 20 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Parallax background ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgYSpring, opacity: bgOpacity }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
      >
        <img
          src="/hero.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-[0.42]"
          loading="eager"
        />
      </motion.div>

      {/* ── Overlays: soften background, keep text readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,1,1,0.35) 0%, rgba(3,1,1,0.5) 50%, rgba(3,1,1,0.88) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 42%, rgba(76,2,2,0.45) 0%, rgba(3,1,1,0.2) 50%, transparent 78%)",
        }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 opacity-15">
        <ParticleCanvas />
      </div>

      {/* ── Scan line ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none scan-overlay" />

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(3,1,1,0.5) 55%, var(--bg) 100%)",
        }}
      />

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center [text-shadow:0_2px_24px_rgba(3,1,1,0.85)]"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="flex flex-col items-center gap-7"
        >
          {/* Logo — hidden on small screens to keep headline + CTA above fold */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.4, rotate: -15 },
              visible: {
                opacity: 1, scale: 1, rotate: 0,
                transition: { type: "spring", stiffness: 320, damping: 18 },
              },
            }}
            className="hidden md:block animate-float"
            style={{ filter: "drop-shadow(0 0 48px rgba(198,7,13,0.55))" }}
          >
            <BrandLogo className="h-20 w-20 lg:h-28 lg:w-28 object-contain" />
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <motion.span
              className="section-label"
              whileHover={{ scale: 1.06, borderColor: "rgba(238,34,38,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Gamepad2 size={13} />
              {t("badge")}
            </motion.span>
          </motion.div>

          {/* Title — word-by-word reveal */}
          <AnimatedTitle text={t("title")} />

          {/* Subtitle */}
          <motion.p
            variants={blurReveal}
            className="text-xl sm:text-2xl font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("subtitle")}
          </motion.p>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl leading-relaxed font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full me-2 align-middle animate-glow-green"
              style={{ background: "#10b981" }}
            />
            {t("trustLine")}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-3 mt-2"
          >
            <motion.button
              type="button"
              onClick={() => openContactChat({ prefillMessage: t("whatsappMessage") })}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-white cursor-pointer"
              style={{
                background: "var(--brand-gradient)",
                boxShadow: "0 8px 40px var(--primary-glow)",
              }}
            >
              <MessageCircle size={17} />
              {t("ctaPrimary")}
            </motion.button>
            <MagneticBtn href="#how-it-works">
              <Zap size={16} />
              {t("ctaSecondary")}
            </MagneticBtn>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("scrollHint")}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
        >
          <ArrowDown size={16} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
