"use client";

import { motion, type Variants } from "framer-motion";
import { use3D } from "@/hooks/use3D";

type Card3DProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** degrees of max tilt */
  tilt?: number;
  /** accent colour for glow / spotlight */
  accent?: string;
  /** extra translateZ when hovered (px) */
  liftZ?: number;
  variants?: Variants;
};

/**
 * Universal 3D tilt card.
 * Wraps children in a perspective container + moving spotlight.
 */
export default function Card3D({
  children,
  className = "",
  style = {},
  tilt = 10,
  accent = "rgba(198,7,13,0.25)",
  liftZ = 20,
  variants,
}: Card3DProps) {
  const { ref, rotateX, rotateY, spotlightX, spotlightY, onMouseMove, onMouseLeave } = use3D(tilt);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
        ...style,
      }}
      whileHover={{ z: liftZ }}
      className={`relative ${className}`}
    >
      {/* Moving spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
        style={{
          background: `radial-gradient(ellipse 55% 55% at ${spotlightX} ${spotlightY}, ${accent}, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Content layer */}
      <div className="relative z-20" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>

      {/* Bottom edge light */}
      <motion.div
        className="absolute bottom-0 inset-x-6 h-px rounded-full pointer-events-none z-10"
        style={{
          background: `linear-gradient(to right, transparent, ${accent.replace(/[\d.]+\)$/, "0.7)")}, transparent)`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
      />
    </motion.div>
  );
}
