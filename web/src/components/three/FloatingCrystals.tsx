"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type CrystalProps = {
  position: [number, number, number];
  scale?: number;
  rotSpeed?: number;
  color?: string;
  transmission?: number;
};

function Crystal({ position, scale = 1, rotSpeed = 1, color = "#c6070d", transmission = 0.8 }: CrystalProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * rotSpeed * 0.5;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3 * rotSpeed) * 0.25;
  });

  // Custom gem geometry (double pyramid)
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(scale * 0.4, scale * 1.0, 6);
    return geo;
  }, [scale]);

  return (
    <Float speed={rotSpeed} floatIntensity={0.4} rotationIntensity={0.15}>
      <group position={position}>
        {/* Top cone */}
        <mesh ref={ref} geometry={geometry} castShadow>
          <MeshTransmissionMaterial
            color={color}
            transmission={transmission}
            roughness={0.05}
            metalness={0.1}
            thickness={0.5}
            ior={1.8}
            chromaticAberration={0.04}
            distortionScale={0.15}
            temporalDistortion={0.05}
          />
        </mesh>
        {/* Bottom cone (mirror) */}
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[scale * 0.4, scale * 0.7, 6]} />
          <MeshTransmissionMaterial
            color={color}
            transmission={transmission * 0.9}
            roughness={0.05}
            metalness={0.1}
            thickness={0.4}
            ior={1.8}
            chromaticAberration={0.04}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Animated floating DNA helix strip
function HelixRing() {
  const ref = useRef<THREE.Group>(null);
  const COUNT = 24;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.25;
  });

  const spheres = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2;
    const r = 2.2;
    return { x: Math.cos(angle) * r, z: Math.sin(angle) * r, y: Math.sin(angle * 2) * 0.5 };
  });

  return (
    <group ref={ref}>
      {spheres.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#ee2226"
            emissive="#c6070d"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

type Props = { className?: string };

export default function FloatingCrystals({ className = "" }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
      className={className}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 3]} color="#ee2226" intensity={6} />
      <pointLight position={[-4, -3, 2]} color="#ff8780" intensity={3} />

      <Crystal position={[-2.2, 0.5, 0]}  scale={0.9} rotSpeed={1.1} color="#c6070d" />
      <Crystal position={[2.4, -0.3, 0]}  scale={0.7} rotSpeed={0.8} color="#ee2226" transmission={0.7} />
      <Crystal position={[0, 1.8, -1]}    scale={0.6} rotSpeed={1.4} color="#ff8780" transmission={0.9} />
      <Crystal position={[-1, -1.6, 0.5]} scale={0.55} rotSpeed={1.2} color="#f25a58" />
      <Crystal position={[1.2, 1.0, 0.8]} scale={0.5} rotSpeed={0.9} color="#870305" />

      <HelixRing />
    </Canvas>
  );
}
