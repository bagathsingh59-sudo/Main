"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight 2D particle network — uses a spatial grid so connection-finding
 * is O(N) per particle instead of O(N²). Pauses when the canvas is offscreen.
 */
export function HeroParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const LINK_DIST = 110;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    let W = 0;
    let H = 0;
    let running = true;
    const CELL = LINK_DIST;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      // Cap density — was up to ~110, now hard-capped at 55.
      const count = Math.round(Math.max(35, Math.min(55, (W * H) / 28000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.7,
        a: Math.random() * 0.45 + 0.18,
      }));
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // Bucket into a spatial grid
      const cols = Math.max(1, Math.ceil(W / CELL));
      const rows = Math.max(1, Math.ceil(H / CELL));
      const grid: number[][] = Array.from({ length: cols * rows }, () => []);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / CELL)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / CELL)));
        grid[cy * cols + cx].push(i);
      }

      // Lines — only check own + neighbour cells
      ctx.lineWidth = 0.8;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cell = grid[cy * cols + cx];
          for (let ny = cy; ny <= Math.min(rows - 1, cy + 1); ny++) {
            for (let nx = Math.max(0, cx - 1); nx <= Math.min(cols - 1, cx + 1); nx++) {
              if (ny === cy && nx < cx) continue;
              const other = grid[ny * cols + nx];
              for (const i of cell) {
                for (const j of other) {
                  if (i >= j) continue;
                  const a = particles[i];
                  const b = particles[j];
                  const dx = a.x - b.x;
                  const dy = a.y - b.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 < LINK_DIST_SQ) {
                    const alpha = 0.18 * (1 - Math.sqrt(d2) / LINK_DIST);
                    ctx.strokeStyle = `rgba(26,86,219,${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
      }

      // Particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,100,245,${p.a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    init();
    tick();

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    // Pause when offscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && rafRef.current === null) tick();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
