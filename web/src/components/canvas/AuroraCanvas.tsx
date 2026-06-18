"use client";

import { useEffect, useRef, useCallback } from "react";

interface AuroraConfig {
  /** How many aurora blobs */
  blobs?: number;
  /** opacity 0-1 */
  opacity?: number;
  speed?: number;
}

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const BRAND_HUES = [0, 5, 10, 355, 350]; // deep reds

export default function AuroraCanvas({
  blobs = 5,
  opacity = 0.9,
  speed = 1,
}: AuroraConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const blobsRef = useRef<Blob[]>([]);

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    blobsRef.current = Array.from({ length: blobs }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      radius: Math.min(W, H) * (0.28 + Math.random() * 0.28),
      vx: (Math.random() - 0.5) * 0.35 * speed,
      vy: (Math.random() - 0.5) * 0.25 * speed,
      hue: BRAND_HUES[i % BRAND_HUES.length],
      saturation: 80 + Math.random() * 20,
      lightness: 38 + Math.random() * 18,
      alpha: 0.28 + Math.random() * 0.22,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.006 + Math.random() * 0.006,
    }));
  }, [blobs, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      init(canvas);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      for (const blob of blobsRef.current) {
        blob.pulsePhase += blob.pulseSpeed;
        const pulse = 1 + 0.12 * Math.sin(blob.pulsePhase);
        const r = blob.radius * pulse;

        // Wrap
        if (blob.x < -r) blob.x = W + r;
        if (blob.x > W + r) blob.x = -r;
        if (blob.y < -r) blob.y = H + r;
        if (blob.y > H + r) blob.y = -r;

        if (!reducedMotion) {
          blob.x += blob.vx;
          blob.y += blob.vy;
        }

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
        grad.addColorStop(0, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha * opacity})`);
        grad.addColorStop(0.45, `hsla(${blob.hue + 5}, ${blob.saturation - 10}%, ${blob.lightness - 8}%, ${blob.alpha * 0.5 * opacity})`);
        grad.addColorStop(1, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, 0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [init, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: "screen", pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
