"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Galaxy() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const COUNT = 6000;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const color = new THREE.Color();

    const ARMS = 3;
    const SPIN = 1.2;
    const SPREAD = 0.28;

    for (let i = 0; i < COUNT; i++) {
      const r = Math.random() * 5;
      const branchAngle = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spinAngle   = r * SPIN;

      const rx = (Math.random() - 0.5) * SPREAD * r;
      const ry = (Math.random() - 0.5) * SPREAD * r * 0.15;
      const rz = (Math.random() - 0.5) * SPREAD * r;

      positions[i * 3]     = Math.cos(branchAngle + spinAngle) * r + rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

      // Colour: inner red-white → outer dark red
      const mixFactor = r / 5;
      color.setRGB(
        THREE.MathUtils.lerp(1.0, 0.4, mixFactor),
        THREE.MathUtils.lerp(0.5, 0.02, mixFactor),
        THREE.MathUtils.lerp(0.5, 0.02, mixFactor),
      );
      colors[i * 3]     = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
        <bufferAttribute args={[colors, 3]}    attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

type Props = { className?: string; opacity?: number };

export default function GalaxyScene({ className = "", opacity = 1 }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 65 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false }}
      style={{ background: "transparent", opacity }}
      className={className}
    >
      <ambientLight intensity={0.2} />
      <Galaxy />
    </Canvas>
  );
}
