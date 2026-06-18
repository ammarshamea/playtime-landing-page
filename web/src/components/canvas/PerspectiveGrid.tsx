"use client";

import { useEffect, useRef } from "react";

type Props = {
  opacity?: number;
  color?: string;
};

export default function PerspectiveGrid({ opacity = 0.18, color = "#c6070d" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Parse hex/rgb colour with opacity
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };
    const rgb = color.startsWith("#") ? hexToRgb(color) : color;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const HORIZON = H * 0.52;
      const VP = { x: W * 0.5, y: HORIZON };
      const COLS = 14;
      const STEP = W / COLS;

      // Animate floor offset
      if (!reduced) offsetRef.current = (offsetRef.current + 0.4) % 80;
      const off = offsetRef.current;

      // Vertical lines (converging to VP)
      for (let i = 0; i <= COLS; i++) {
        const bx = i * STEP;
        const alpha = Math.abs(i - COLS / 2) / (COLS / 2);
        ctx.beginPath();
        ctx.moveTo(VP.x, VP.y);
        ctx.lineTo(bx, H);
        ctx.strokeStyle = `rgba(${rgb}, ${opacity * (1 - alpha * 0.55)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Horizontal lines (floor rows)
      const ROWS = 10;
      for (let j = 0; j <= ROWS; j++) {
        const t = ((j + off / 80) / ROWS);
        const eased = t * t; // quadratic depth
        const y = HORIZON + (H - HORIZON) * eased;
        if (y > H) continue;

        // Clip left/right using perspective
        const progress = (y - HORIZON) / (H - HORIZON);
        const half = W * 0.5 * (0.05 + progress * 0.95);
        const x1 = VP.x - half;
        const x2 = VP.x + half;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(${rgb}, ${opacity * eased * 0.85})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Horizon glow
      const grad = ctx.createLinearGradient(0, HORIZON - 20, 0, HORIZON + 10);
      grad.addColorStop(0, `rgba(${rgb}, 0)`);
      grad.addColorStop(0.5, `rgba(${rgb}, ${opacity * 1.2})`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, HORIZON - 20, W, 30);

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
