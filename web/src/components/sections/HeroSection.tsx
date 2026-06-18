"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowDown,
  Gamepad2,
  Zap,
  MessageCircle,
  ShieldCheck,
  Wifi,
  Globe,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  staggerContainer,
  wordReveal,
  fadeUp,
  blurReveal,
  EASE_OUT_EXPO,
} from "@/lib/animations";
import Logo3D from "@/components/ui/Logo3D";
import CSSOrb from "@/components/ui/CSSOrb";
import { openContactChat } from "@/lib/open-contact-chat";

// Lazy-loaded — never blocks first paint
const HeroParticles = dynamic(
  () => import("@/components/canvas/HeroParticles"),
  { ssr: false }
);

// ── Magnetic CTA ─────────────────────────────────────────────────────────────
function MagneticBtn({
  href,
  onClick,
  children,
  primary,
  ghost,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  primary?: boolean;
  ghost?: boolean;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 20 });
  const sy = useSpring(my, { stiffness: 220, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.2);
    my.set((e.clientY - r.top  - r.height / 2) * 0.2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const base = {
    x: sx, y: sy,
    background: primary ? "var(--brand-gradient)" : ghost ? "rgba(255,255,255,0.04)" : undefined,
    border: ghost ? "1px solid rgba(255,255,255,0.12)" : undefined,
    color: "#fff",
    boxShadow: primary ? "0 8px 40px var(--primary-glow), 0 2px 0 rgba(255,135,128,0.15) inset" : undefined,
  };
  const cls = "inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm cursor-pointer";

  if (href) {
    return (
      <motion.a href={href} style={base} onMouseMove={onMove} onMouseLeave={onLeave}
        whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.04 }} className={cls}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" onClick={onClick} style={base} onMouseMove={onMove} onMouseLeave={onLeave}
      whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.04 }} className={cls}>
      {children}
    </motion.button>
  );
}

// ── Word-split headline ───────────────────────────────────────────────────────
function AnimatedTitle({ text }: { text: string }) {
  return (
    <motion.h1
      variants={staggerContainer}
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight"
      style={{ perspective: "1000px" }}
    >
      {text.split(" ").map((word, i) => (
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

// ── Trust badge ───────────────────────────────────────────────────────────────
function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  label: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.04 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-light text-xs font-medium"
      style={{ color: "var(--text-secondary)" }}
    >
      <Icon size={12} style={{ color: "var(--primary-light)" }} />
      {label}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgOpac   = useTransform(scrollYProgress, [0, 0.7], [0.42, 0.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const orbY     = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const orbYSpr  = useSpring(orbY, { stiffness: 50, damping: 20 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Hero background image (parallax) ── */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: bgOpac }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.42, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
      >
        <img
          src="/hero.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      {/* ── CSS 3D Orb — zero JS overhead ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: orbYSpr, opacity: 0.55 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE_OUT_EXPO }}
      >
        <CSSOrb size={520} />
      </motion.div>

      {/* ── Depth overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,1,1,0.3) 0%, rgba(3,1,1,0.5) 55%, rgba(3,1,1,0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(76,2,2,0.32) 0%, transparent 72%)",
        }}
      />

      {/* ── tsparticles (lazy, pauseOnBlur) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroParticles />
      </div>

      {/* ── Scan line ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none scan-overlay opacity-50" />

      {/* ── Bottom vignette ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-52 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(3,1,1,0.65) 55%, var(--bg) 100%)",
        }}
      />

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo 3D */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.3, y: 30 },
              visible: {
                opacity: 1, scale: 1, y: 0,
                transition: { type: "spring", stiffness: 200, damping: 18 },
              },
            }}
            className="hidden md:block"
          >
            <Logo3D size={170} />
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <motion.span
              className="badge-premium"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Gamepad2 size={12} />
              {t("badge")}
            </motion.span>
          </motion.div>

          {/* Headline */}
          <AnimatedTitle text={t("title")} />

          {/* Subtitle */}
          <motion.p
            variants={blurReveal}
            className="text-lg sm:text-2xl font-medium max-w-2xl leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("subtitle")}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("trustLine")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mt-1">
            <MagneticBtn primary onClick={() => openContactChat({ prefillMessage: t("whatsappMessage") })}>
              <MessageCircle size={17} />
              {t("ctaPrimary")}
            </MagneticBtn>
            <MagneticBtn ghost href="#how-it-works">
              <Zap size={16} />
              {t("ctaSecondary")}
            </MagneticBtn>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={staggerContainer} className="flex flex-wrap justify-center gap-2 pt-1">
            <TrustBadge icon={Wifi}        label="Offline 100%" />
            <TrustBadge icon={ShieldCheck} label="بياناتك على جهازك" />
            <TrustBadge icon={Globe}       label="عربي + إنجليزي" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.8 }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t("scrollHint")}</span>
        <motion.div
          animate={{ y: [0, 8] }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown size={15} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
