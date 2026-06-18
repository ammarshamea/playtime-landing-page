"use client";

import { useEffect, useRef } from "react";

interface GlowPoint {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef  = useRef<GlowPoint[]>([]);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only on pointer devices
    if (!window.matchMedia("(pointer:fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const TRAIL_LENGTH = 28;
    const GLOW_RADIUS  = 120;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseRef.current) {
        const { x, y } = mouseRef.current;

        // Add current point to trail
        trailRef.current.unshift({ x, y, alpha: 1, radius: GLOW_RADIUS });
        if (trailRef.current.length > TRAIL_LENGTH) {
          trailRef.current.length = TRAIL_LENGTH;
        }
      }

      // Draw trail points
      trailRef.current.forEach((pt, i) => {
        const t = 1 - i / TRAIL_LENGTH;
        const r = pt.radius * t * 0.6;
        const a = t * 0.18;

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
        grad.addColorStop(0,   `rgba(238, 34, 38, ${a})`);
        grad.addColorStop(0.5, `rgba(198,  7, 13, ${a * 0.5})`);
        grad.addColorStop(1,   `rgba(198,  7, 13, 0)`);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Core bright dot
      if (mouseRef.current && trailRef.current.length > 0) {
        const { x, y } = mouseRef.current;
        const core = ctx.createRadialGradient(x, y, 0, x, y, 14);
        core.addColorStop(0,   "rgba(255, 135, 128, 0.55)");
        core.addColorStop(0.4, "rgba(238,  34,  38, 0.3)");
        core.addColorStop(1,   "rgba(198,   7,  13, 0)");
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize",      resize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      aria-hidden="true"
    />
  );
}
