import type { Variants } from "framer-motion";

// ─── Easing curves ───────────────────────────────────────────────────────────
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;
export const EASE_SPRING_SNAPPY = { type: "spring", stiffness: 320, damping: 26 } as const;
export const EASE_SPRING_BOUNCY = { type: "spring", stiffness: 420, damping: 17 } as const;
export const EASE_SPRING_GENTLE = { type: "spring", stiffness: 90, damping: 18 } as const;
export const EASE_SPRING_SLOW = { type: "spring", stiffness: 55, damping: 20 } as const;

// ─── Basic reveal variants ────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.86, filter: "blur(8px)" },
  visible: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.55 },
  visible: {
    opacity: 1, scale: 1,
    transition: EASE_SPRING_BOUNCY,
  },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(24px)", scale: 1.06 },
  visible: {
    opacity: 1, filter: "blur(0px)", scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

// ─── Directional slides ───────────────────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -70, filter: "blur(8px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 70, filter: "blur(8px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

// ─── Word / character reveal ──────────────────────────────────────────────────
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 70, rotateX: 35, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

export const charReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

// ─── List item variants ───────────────────────────────────────────────────────
export const listItemLeft: Variants = {
  hidden: { opacity: 0, x: -24, filter: "blur(4px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const listItemRight: Variants = {
  hidden: { opacity: 0, x: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

// ─── Stagger containers ───────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewportConfig = { once: true, margin: "-80px" } as const;
export const viewportEager = { once: true, margin: "-40px" } as const;
