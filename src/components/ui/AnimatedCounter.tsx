"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  infinity?: boolean;
}

export default function AnimatedCounter({
  target,
  duration = 1800,
  prefix = "",
  suffix = "",
  infinity = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current || infinity) return;
    hasRun.current = true;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration, infinity]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {prefix}
      {infinity ? "∞" : String(value)}
      {suffix}
    </span>
  );
}
