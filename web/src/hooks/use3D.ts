import { useRef, useCallback } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

export interface Use3DReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  spotlightX: MotionValue<string>;
  spotlightY: MotionValue<string>;
  glowX: MotionValue<string>;
  glowY: MotionValue<string>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

/**
 * Reusable 3D mouse-tilt hook.
 * @param maxTilt max degrees to tilt (default 12)
 * @param springConfig framer-motion spring config
 */
export function use3D(
  maxTilt = 12,
  springConfig = { stiffness: 200, damping: 22 }
): Use3DReturn {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  const rotateX = useTransform(springY, [-1, 1], [ maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-1, 1], [-maxTilt,  maxTilt]);

  // spotlight position (% inside the card)
  const spotlightX = useTransform(springX, [-1, 1], ["15%", "85%"]);
  const spotlightY = useTransform(springY, [-1, 1], ["15%", "85%"]);

  // outer glow follows same direction
  const glowX = useTransform(springX, [-1, 1], ["0%", "100%"]);
  const glowY = useTransform(springY, [-1, 1], ["0%", "100%"]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left)  / rect.width  - 0.5) * 2);
    rawY.set(((e.clientY - rect.top)   / rect.height - 0.5) * 2);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, rotateX, rotateY, spotlightX, spotlightY, glowX, glowY, onMouseMove, onMouseLeave };
}
