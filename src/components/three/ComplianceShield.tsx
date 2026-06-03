"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp } from "@/utils/format";
import { COMPLIANCE_CARDS, makeCardTexture, makeShieldTexture } from "./complianceCards";

const PHASES = [
  { label: "Phase 01", title: "Discovery & Compliance Audit", caption: "Health-check of PF, ESI, GST, TDS and statutory hygiene." },
  { label: "Phase 02", title: "EPF & ESI Activation", caption: "Multi-state PF, ESI, PT and LWF — onboarded under one dashboard." },
  { label: "Phase 03", title: "Tax & GST Integration", caption: "GST, TDS, advance tax — synchronised filings and reconciliations." },
  { label: "Phase 04", title: "Zero-Penalty Shield Deployed", caption: "Real-time alerts, four-eye reviews, board-ready MIS." },
  { label: "Phase 05", title: "Business Fully Protected", caption: "Predictable compliance economics. Zero penalties, four years running." },
];

/* ──────────────────────────────────────────────────────────
   Orbiting compliance card
   ────────────────────────────────────────────────────────── */
function ComplianceCard({
  texture,
  angleOffset,
  radius,
  speed,
  yPhase,
}: {
  texture: THREE.Texture;
  angleOffset: number;
  radius: number;
  speed: number;
  yPhase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + angleOffset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius * 0.55;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.6 + yPhase) * 0.35;
    // Face camera (billboard-ish, but with a tilt for depth)
    ref.current.rotation.y = -t + Math.PI / 2;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.4 + yPhase) * 0.06;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[0.85, 1.15, 1, 1]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────
   Inner R3F scene
   ────────────────────────────────────────────────────────── */
function ShieldScene({ progress }: { progress: number }) {
  const shieldRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Lazy-build textures only on the client
  const shieldTexture = useMemo(() => makeShieldTexture(), []);
  const cardTextures = useMemo(() => COMPLIANCE_CARDS.map((c) => makeCardTexture(c)), []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      shieldTexture.dispose();
      cardTextures.forEach((t) => t.dispose());
    };
  }, [shieldTexture, cardTextures]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const p = progress;

    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(t * 0.4) * 0.18 + p * 0.4;
      shieldRef.current.rotation.x = Math.sin(t * 0.3) * 0.06 - p * 0.05;
      const targetScale = 0.85 + p * 0.55;
      shieldRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      shieldRef.current.position.y = Math.sin(t * 0.6) * 0.08;
    }

    if (haloRef.current) {
      const hs = 1.1 + Math.sin(t * 1.4) * 0.04;
      haloRef.current.scale.set(hs, hs, 1);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 1.2) * 0.08 + p * 0.15;
    }

    // Orbiting group rotates slowly + scales with progress for "deployment" effect
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
      const orbitScale = 0.6 + Math.min(1, p * 1.5) * 0.6;
      groupRef.current.scale.lerp(new THREE.Vector3(orbitScale, orbitScale, orbitScale), 0.06);
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 4]} intensity={1.2} color="#7fb1ff" />
      <directionalLight position={[-3, -2, 2]} intensity={0.6} color="#22d3ee" />

      {/* Halo */}
      <mesh ref={haloRef} position={[0, 0, -0.4]}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial color="#3a64f5" transparent opacity={0.22} depthWrite={false} />
      </mesh>

      {/* Central compliance shield card */}
      <mesh ref={shieldRef}>
        <planeGeometry args={[1.9, 1.9, 1, 1]} />
        <meshBasicMaterial map={shieldTexture} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting compliance cards */}
      <group ref={groupRef}>
        {cardTextures.map((tex, i) => (
          <ComplianceCard
            key={i}
            texture={tex}
            angleOffset={(i / cardTextures.length) * Math.PI * 2}
            radius={2.6 + (i % 2 === 0 ? 0.15 : -0.1)}
            speed={0.22 + (i % 3) * 0.04}
            yPhase={i * 0.9}
          />
        ))}
      </group>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Public component — sticky scroll-driven container
   ────────────────────────────────────────────────────────── */
export function ComplianceShield() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const progress = useScrollProgress(sectionRef);
  const phaseIdx = clamp(Math.floor(progress * PHASES.length), 0, PHASES.length - 1);

  // Gate the WebGL frameloop to when the sticky frame is visible — huge perf win.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px 0px 200px 0px",
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="shield-story"
      aria-label="The Vaishnavi Compliance Shield — evolves as you scroll"
      className="relative"
      style={{ height: "420vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-gradient-mist">
        {/* Decorative wash */}
        <div className="absolute inset-0 opacity-[0.18] bg-grid-light [background-size:48px_48px] mask-radial" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-navy-200/40 blur-3xl" aria-hidden="true" />

        {/* R3F scene */}
        <div className="absolute inset-0">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.2, 5.4], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={inView ? "always" : "demand"}
          >
            <AdaptiveDpr pixelated />
            <ShieldScene progress={reduceMotion ? 0.5 : progress} />
          </Canvas>
        </div>

        {/* Phase progress rail */}
        <div className="absolute inset-x-0 top-24 z-10 flex justify-center px-6">
          <div className="flex items-center gap-2.5 rounded-full border border-white/70 bg-white/65 px-4 py-2 shadow-soft backdrop-blur-md">
            {PHASES.map((p, i) => (
              <div key={p.label} className="flex items-center gap-2">
                <span
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === phaseIdx ? 36 : 12,
                    background: i <= phaseIdx ? "linear-gradient(90deg,#1a56db,#0891b2)" : "rgba(11,31,58,0.18)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Phase caption overlay */}
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 w-[min(92%,680px)] -translate-x-1/2 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/70 bg-white/65 px-6 py-5 shadow-soft backdrop-blur-md"
            >
              <div className="text-[0.74rem] font-bold uppercase tracking-[0.28em] text-teal-700 mb-2">
                {PHASES[phaseIdx].label}
              </div>
              <h3 className="font-display text-display-md text-navy-900">{PHASES[phaseIdx].title}</h3>
              <p className="mt-2 text-[0.92rem] text-navy-900/65">{PHASES[phaseIdx].caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-mist to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cloud to-transparent" />
      </div>
    </section>
  );
}
