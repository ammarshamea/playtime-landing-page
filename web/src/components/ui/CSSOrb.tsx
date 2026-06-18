"use client";

/**
 * Pure-CSS 3D energy orb — zero JS runtime cost, GPU composited only.
 * Used in Hero as a lightweight replacement for Three.js HeroScene.
 */
export default function CSSOrb({ size = 420 }: { size?: number }) {
  return (
    <div
      className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* ── Core glow orb ── */}
      <div
        style={{
          width:  size,
          height: size,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 35%, rgba(238,34,38,0.55) 0%, rgba(198,7,13,0.38) 40%, rgba(135,3,5,0.15) 70%, transparent 100%)",
          filter: "blur(2px)",
          animation: "orbPulse 4s ease-in-out infinite",
        }}
      />

      {/* ── Outer diffuse glow ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 1.35,
          height: size * 1.35,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(198,7,13,0.14) 0%, rgba(135,3,5,0.06) 50%, transparent 75%)",
          filter: "blur(30px)",
          animation: "orbPulse 4s ease-in-out infinite 0.8s",
        }}
      />

      {/* ── Ring 1 ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 0.95,
          height: size * 0.95,
          borderRadius: "50%",
          border: "1px solid rgba(238,34,38,0.4)",
          boxShadow: "0 0 18px rgba(238,34,38,0.2), inset 0 0 18px rgba(238,34,38,0.06)",
          transform: "rotateX(72deg)",
          animation: "ringRotate1 6s linear infinite",
        }}
      />

      {/* ── Ring 2 ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 0.82,
          height: size * 0.82,
          borderRadius: "50%",
          border: "1px dashed rgba(255,135,128,0.3)",
          transform: "rotateX(58deg) rotateY(30deg)",
          animation: "ringRotate2 9s linear infinite reverse",
        }}
      />

      {/* ── Ring 3 ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 1.1,
          height: size * 1.1,
          borderRadius: "50%",
          border: "1px solid rgba(198,7,13,0.22)",
          transform: "rotateX(80deg) rotateZ(22deg)",
          animation: "ringRotate1 14s linear infinite",
        }}
      />

      {/* ── Orbiting dot 1 ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 0.95,
          height: size * 0.95,
          borderRadius: "50%",
          transform: "rotateX(72deg)",
          animation: "ringRotate1 6s linear infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-5px",
            marginTop: "-5px",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ee2226",
            boxShadow: "0 0 16px rgba(238,34,38,0.9), 0 0 32px rgba(238,34,38,0.5)",
          }}
        />
      </div>

      {/* ── Orbiting dot 2 ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 0.82,
          height: size * 0.82,
          borderRadius: "50%",
          transform: "rotateX(58deg) rotateY(30deg)",
          animation: "ringRotate2 9s linear infinite reverse",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "50%",
            marginLeft: "-4px",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#ff8780",
            boxShadow: "0 0 12px rgba(255,135,128,0.9), 0 0 24px rgba(255,135,128,0.5)",
          }}
        />
      </div>

      {/* ── Highlight streak ── */}
      <div
        style={{
          position: "absolute",
          width:  size * 0.45,
          height: size * 0.12,
          background:
            "radial-gradient(ellipse, rgba(255,135,128,0.55) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "28%",
          left: "28%",
          filter: "blur(8px)",
          transform: "rotate(-30deg)",
        }}
      />
    </div>
  );
}
