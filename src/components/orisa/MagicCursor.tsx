"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Orisa "magic cursor" (template at-cursor.js, without jQuery): a small dot
 * that trails the pointer, blends with what is underneath, shrinks away
 * over links and buttons, and grows into a blurred bubble with a label over
 * anything carrying `data-cursor="View"` (or any other text).
 *
 * Desktop with a fine pointer only — touch devices and screens below 992px
 * never render it. Uses event delegation, so content added later works too.
 */
const SIZE = 14;
const BUBBLE = 110;

export function MagicCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ball = ballRef.current;
    const label = labelRef.current;
    if (!wrap || !ball || !label) return;
    if (!window.matchMedia("(min-width: 992px) and (hover: hover) and (pointer: fine)").matches) return;

    wrap.classList.add("is-active");
    gsap.set(ball, { xPercent: -50, yPercent: -50, width: SIZE, height: SIZE });

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let mode: "dot" | "hidden" | "bubble" = "dot";

    const follow = () => {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
      gsap.set(ball, { x: pos.x, y: pos.y });
    };
    gsap.ticker.add(follow);

    const setMode = (next: typeof mode, text = "") => {
      if (next === mode && next !== "bubble") return;
      mode = next;
      if (next === "bubble") {
        label.textContent = text;
        ball.classList.add("is-bubble");
        gsap.to(ball, { duration: 0.3, width: BUBBLE, height: BUBBLE, scale: 1, opacity: 1, yPercent: -60 });
      } else {
        ball.classList.remove("is-bubble");
        gsap.to(ball, {
          duration: 0.3,
          width: SIZE,
          height: SIZE,
          yPercent: -50,
          scale: next === "hidden" ? 0 : 1,
          opacity: next === "hidden" ? 0 : 1,
        });
      }
    };

    /* Dot colour follows what is under the pointer: navy over light
       backgrounds, white over dark ones (checked at most once a frame). */
    let toneFrame = 0;
    const updateTone = () => {
      toneFrame = 0;
      const el = document.elementFromPoint(mouse.x, mouse.y);
      ball.classList.toggle("is-on-dark", isDarkUnder(el));
    };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      wrap.style.opacity = "1";
      if (!toneFrame) toneFrame = requestAnimationFrame(updateTone);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setMode("bubble", labelled.dataset.cursor ?? "");
      if (target?.closest("a, button, [role='button'], input, textarea, select, label")) return setMode("hidden");
      setMode("dot");
    };
    const onLeave = () => (wrap.style.opacity = "0");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(toneFrame);
      gsap.ticker.remove(follow);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      wrap.classList.remove("is-active");
    };
  }, []);

  return (
    <div ref={wrapRef} className="o-magic-cursor" aria-hidden="true">
      <div ref={ballRef} className="o-magic-cursor__ball">
        <span ref={labelRef} className="o-magic-cursor__label" />
      </div>
    </div>
  );
}

/** True when the first opaque background behind `el` is dark (or a photo). */
function isDarkUnder(el: Element | null): boolean {
  for (let node: Element | null = el; node; node = node.parentElement) {
    if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLCanvasElement) return true;
    const style = getComputedStyle(node);
    if (style.backgroundImage !== "none" && /url\(/.test(style.backgroundImage)) return true;
    const m = style.backgroundColor.match(/rgba?\(([^)]+)\)/);
    if (!m) continue;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (a < 0.5) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
  }
  return false;
}
