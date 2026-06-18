"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PLAYTIME_LOGO_SRC } from "@/lib/brand";

type LogoMini3DProps = {
  size?: number;
  className?: string;
};

export default function LogoMini3D({ size = 40, className = "" }: LogoMini3DProps) {
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-1, 1], [15, -15]), { stiffness: 280, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 280, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    my.set(((e.clientY - rect.top ) / rect.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size, perspective: 400 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(198,7,13,0.5) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.3 : 1 }}
        transition={{ duration: 0.25 }}
      />

      {/* 3D card */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          rotateX: rotX,
          rotateY: rotY,
          background: "radial-gradient(circle at 35% 30%, rgba(40,4,4,0.97), rgba(12,2,2,0.99))",
          border: `1px solid rgba(198,7,13,${hovered ? 0.6 : 0.3})`,
          boxShadow: hovered
            ? "0 0 24px rgba(198,7,13,0.5), inset 0 1px 0 rgba(255,135,128,0.12)"
            : "0 0 10px rgba(198,7,13,0.2), inset 0 1px 0 rgba(255,135,128,0.06)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top highlight streak */}
        <div
          className="absolute top-0 inset-x-2 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,135,128,0.5), transparent)" }}
        />

        <img
          src={PLAYTIME_LOGO_SRC}
          alt="Playtime"
          draggable={false}
          style={{
            width: size * 0.6,
            height: size * 0.6,
            objectFit: "contain",
            filter: `drop-shadow(0 2px ${hovered ? 12 : 6}px rgba(198,7,13,${hovered ? 0.7 : 0.4}))`,
            transition: "filter 0.25s",
          }}
        />
      </motion.div>
    </div>
  );
}
