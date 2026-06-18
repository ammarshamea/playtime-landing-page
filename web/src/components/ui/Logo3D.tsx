"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { PLAYTIME_LOGO_SRC } from "@/lib/brand";

type Logo3DProps = {
  size?: number;
  /** true = continuous slow auto-spin, false = mouse-only tilt */
  autoSpin?: boolean;
  className?: string;
};

export default function Logo3D({
  size = 140,
  autoSpin = false,
  className = "",
}: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  /* ── Mouse tilt ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-1, 1], [18, -18]), { stiffness: 200, damping: 22 });
  const rotY = useSpring(useTransform(mx, [-1, 1], [-22, 22]), { stiffness: 200, damping: 22 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    my.set(((e.clientY - rect.top ) / rect.height - 0.5) * 2);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); };

  /* ── Auto-spin Y ── */
  const spinY = useMotionValue(0);
  useEffect(() => {
    if (!autoSpin) return;
    const ctrl = animate(spinY, 360, {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    });
    return () => ctrl.stop();
  }, [autoSpin, spinY]);

  /* ── Floating Y offset ── */
  const floatY = useMotionValue(0);
  useEffect(() => {
    const ctrl = animate(floatY, [-10, 10], {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    return () => ctrl.stop();
  }, [floatY]);

  /* ── Glow ring size ── */
  const glowScale = useSpring(hovered ? 1.25 : 1, { stiffness: 180, damping: 18 });

  const combinedRotY = autoSpin ? spinY : rotY;

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ width: size, height: size, perspective: 800 }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mx.set(0); my.set(0); }}
    >
      {/* ── Outer glow ring ── */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          scale: glowScale,
          background:
            "radial-gradient(circle, rgba(198,7,13,0.35) 0%, rgba(198,7,13,0.12) 50%, transparent 75%)",
          filter: "blur(20px)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />

      {/* ── Orbit ring 1 ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ rotateX: 70 }}
        animate={{ rotateZ: [0, 360] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(198,7,13,0.35)",
            boxShadow: "0 0 10px rgba(198,7,13,0.2)",
          }}
        />
        {/* Dot on ring */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: "#ee2226", boxShadow: "0 0 10px rgba(238,34,38,0.9)" }}
        />
      </motion.div>

      {/* ── Orbit ring 2 (opposite tilt) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ rotateX: -55, rotateZ: 45 }}
        animate={{ rotateY: [0, 360] }}
        transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px dashed rgba(242,90,88,0.25)",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: "#ff8780", boxShadow: "0 0 8px rgba(255,135,128,0.8)" }}
        />
      </motion.div>

      {/* ── 3D Logo card ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotateX: rotX,
          rotateY: combinedRotY,
          y: floatY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Logo face */}
        <motion.div
          className="relative flex items-center justify-center rounded-[28%] overflow-hidden"
          style={{
            width:  size * 0.72,
            height: size * 0.72,
            background:
              "radial-gradient(circle at 35% 30%, rgba(50,5,5,0.95) 0%, rgba(15,2,2,0.98) 100%)",
            border: "1px solid rgba(198,7,13,0.45)",
            boxShadow: hovered
              ? "0 0 60px rgba(198,7,13,0.6), 0 0 120px rgba(198,7,13,0.25), inset 0 1px 0 rgba(255,135,128,0.15)"
              : "0 0 30px rgba(198,7,13,0.3), 0 0 60px rgba(198,7,13,0.12), inset 0 1px 0 rgba(255,135,128,0.08)",
            transformStyle: "preserve-3d",
            transition: "box-shadow 0.3s ease",
          }}
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Highlight streak */}
          <div
            className="absolute top-0 inset-x-4 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,135,128,0.6), transparent)",
            }}
          />

          {/* Logo image */}
          <motion.img
            src={PLAYTIME_LOGO_SRC}
            alt="Playtime"
            draggable={false}
            className="object-contain"
            style={{ width: size * 0.52, height: size * 0.52, filter: "drop-shadow(0 4px 18px rgba(198,7,13,0.55))" }}
            animate={{
              filter: hovered
                ? [
                    "drop-shadow(0 4px 18px rgba(198,7,13,0.55))",
                    "drop-shadow(0 4px 28px rgba(238,34,38,0.8))",
                    "drop-shadow(0 4px 18px rgba(198,7,13,0.55))",
                  ]
                : "drop-shadow(0 4px 18px rgba(198,7,13,0.55))",
            }}
            transition={{ repeat: hovered ? Infinity : 0, duration: 1.2 }}
          />

          {/* Back face (translateZ negative) */}
          <div
            className="absolute inset-0 rounded-[28%] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(198,7,13,0.06) 0%, transparent 60%)",
              transform: "translateZ(-1px)",
            }}
          />
        </motion.div>

        {/* Shadow under card */}
        <motion.div
          className="absolute bottom-0 left-1/2 pointer-events-none"
          style={{
            translateX: "-50%",
            translateY: "50%",
            width:  size * 0.55,
            height: size * 0.1,
            background: "rgba(198,7,13,0.4)",
            borderRadius: "50%",
            filter: "blur(16px)",
          }}
          animate={{ scaleX: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
