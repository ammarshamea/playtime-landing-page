"use client";

import { useMemo } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

async function initSlim(engine: Engine) {
  await loadSlim(engine);
}

function ParticlesInner() {
  const options: ISourceOptions = useMemo(
    () => ({
      detectRetina: true,
      fpsLimit: 60,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 90, duration: 0.5, speed: 0.4 },
        },
      },
      particles: {
        number: {
          value: 50,
          density: { enable: true, width: 1080, height: 720 },
        },
        color: { value: ["#c6070d", "#ee2226", "#ff8780", "#f25a58"] },
        links: {
          enable: true,
          distance: 140,
          color: "#870305",
          opacity: 0.25,
          width: 0.55,
        },
        move: {
          enable: true,
          speed: 0.45,
          direction: "none",
          random: true,
          outModes: { default: "bounce" },
        },
        size: { value: { min: 1, max: 2.2 } },
        opacity: { value: { min: 0.25, max: 0.65 } },
        shape: { type: "circle" },
      },
      background: { color: "transparent" },
    }),
    []
  );

  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0 w-full h-full"
      options={options}
    />
  );
}

export default function HeroParticles() {
  return (
    <ParticlesProvider init={initSlim}>
      <ParticlesInner />
    </ParticlesProvider>
  );
}
