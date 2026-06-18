"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Torus, Icosahedron, Float, MeshDistortMaterial, Stars, Trail, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Floating crystal shape ──────────────────────────────────────────────────
function Crystal({ position, scale = 1, speed = 1, color }: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.4) * 0.3;
    ref.current.rotation.y += 0.006 * speed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
  });
  return (
    <Icosahedron ref={ref} args={[scale * 0.5, 0]} position={position} castShadow>
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.15}
        emissive={color}
        emissiveIntensity={0.3}
        wireframe={false}
      />
    </Icosahedron>
  );
}

// ── Distorted sphere (main orb) ─────────────────────────────────────────────
function MainOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.18;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.15) * 0.1;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={ref} args={[1.6, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#c6070d"
          emissive="#870305"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.25}
          distort={0.45}
          speed={2}
          transparent
          opacity={0.82}
        />
      </Sphere>
    </Float>
  );
}

// ── Orbiting torus rings ────────────────────────────────────────────────────
function OrbRing({ radius, speed, tilt, color }: {
  radius: number; speed: number; tilt: number; color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.elapsedTime * speed;
  });
  return (
    <Torus
      ref={ref}
      args={[radius, 0.018, 6, 64]}
      rotation={[tilt, 0, 0]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.9}
        metalness={1}
        roughness={0}
        transparent
        opacity={0.75}
      />
    </Torus>
  );
}

// ── Particle field ──────────────────────────────────────────────────────────
function ParticleField() {
  const COUNT = 1800;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 3.5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.04;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#ff8780" transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

// ── Mouse-following camera ──────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useFrame(({ mouse }) => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Glowing connecting lines ────────────────────────────────────────────────
function GlowLine({ from, to, color }: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const lineObj = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
    return new THREE.Line(geom, mat);
  }, [from, to, color]);

  return <primitive object={lineObj} />;
}

// ── Main exported scene ─────────────────────────────────────────────────────
export default function HeroScene() {
  const crystals: { p: [number, number, number]; s: number; sp: number; c: string }[] = [
    { p: [-4.5,  1.5, -2], s: 0.65, sp: 1.2, c: "#ee2226" },
    { p: [ 4.2,  2.0, -3], s: 0.5,  sp: 0.9, c: "#ff8780" },
    { p: [-3.5, -1.8, -1], s: 0.45, sp: 1.4, c: "#f25a58" },
    { p: [ 3.8, -1.5, -2], s: 0.6,  sp: 1.1, c: "#c6070d" },
    { p: [ 0.5,  3.2, -2], s: 0.4,  sp: 1.6, c: "#ff8780" },
    { p: [-1.2, -3.0, -1], s: 0.38, sp: 1.3, c: "#ee2226" },
  ];

  const lines: { from: [number,number,number]; to: [number,number,number]; c: string }[] = [
    { from: [-4.5, 1.5, -2], to: [0, 0, 0], c: "#c6070d" },
    { from: [ 4.2, 2.0, -3], to: [0, 0, 0], c: "#ee2226" },
    { from: [-3.5,-1.8, -1], to: [0, 0, 0], c: "#f25a58" },
    { from: [ 3.8,-1.5, -2], to: [0, 0, 0], c: "#ff8780" },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 4]}  color="#ee2226" intensity={4} />
      <pointLight position={[-6, -4, 2]} color="#ff8780" intensity={2.5} />
      <pointLight position={[0, 8, -2]}  color="#ffffff" intensity={1} />

      {/* Main orb */}
      <MainOrb />

      {/* Orbit rings */}
      <OrbRing radius={2.4} speed={0.4}  tilt={Math.PI / 2.5} color="#ee2226" />
      <OrbRing radius={2.9} speed={-0.3} tilt={Math.PI / 4}   color="#f25a58" />
      <OrbRing radius={3.4} speed={0.22} tilt={Math.PI / 6}   color="#ff8780" />

      {/* Crystals */}
      {crystals.map((c, i) => (
        <Crystal key={i} position={c.p} scale={c.s} speed={c.sp} color={c.c} />
      ))}

      {/* Connecting lines */}
      {lines.map((l, i) => (
        <GlowLine key={i} from={l.from} to={l.to} color={l.c} />
      ))}

      {/* Particle sphere */}
      <ParticleField />

      {/* Stars background */}
      <Stars radius={30} depth={50} count={3000} factor={2.5} saturation={0.5} fade speed={0.4} />

      {/* Sparkle emitters near the orb */}
      <Sparkles count={80} scale={6} size={1.5} speed={0.3} color="#ff8780" />

      {/* Mouse-driven camera */}
      <CameraRig />
    </Canvas>
  );
}
