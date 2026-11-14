"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motionAllowed } from "./config";

/**
 * One hook that wires every Orisa scroll effect found inside `scope`.
 * Sections stay declarative — they only add attributes:
 *
 *   data-fade="bottom|top|left|right"  fade + 20px slide when scrolled into view
 *        data-delay=".2"               (seconds, default .15)
 *   data-reveal                        per-character opacity sweep, scrubbed
 *   data-scramble                      text scramble on enter + on hover
 *   data-swap="A|B|C"                  cycles through the words with a scramble
 *   data-drift=".8"                    moves slower than the page (1 = no drift)
 *   data-expand                        grows from an inset card to full width on scroll
 *   data-shift=".12"                  slides against the scroll (gallery columns)
 *   data-zoomin                        scale 1.2 → 1 with a fade when scrolled into view
 *   data-chars                         characters slide in from the right
 *   data-rise                          characters rise from below their line
 *   data-count="250"                   counts up from 0 when scrolled into view
 *
 * Ports of the template's `.at_fade_anim`, `.reveal-text`, `.text-scramble`
 * and ScrollSmoother `data-speed`, without jQuery or ScrollSmoother.
 *
 * Elements whose text this hook rewrites (reveal, scramble, swap) must be
 * rendered through `staticText()` so React never diffs their children.
 */
export function useOrisaMotion(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (!motionAllowed()) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    root.classList.add("orisa-js");
    const disposers: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* ── fade in on scroll ─────────────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-fade]", root).forEach((el) => {
        const from = el.dataset.fade || "bottom";
        const offset = 20;
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: from === "left" ? -offset : from === "right" ? offset : 0,
            y: from === "top" ? -offset : from === "bottom" ? offset : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            delay: parseFloat(el.dataset.delay ?? "") || 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          },
        );
      });

      /* ── per-character reveal, scrubbed ────────────── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        const split = new SplitText(el, { type: "lines,words,chars", linesClass: "split-line" });
        if (!split.chars.length) return;
        gsap.set(split.chars, { opacity: 0.4, x: -7 });
        gsap.to(split.chars, {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 20%", scrub: 1 },
        });
        disposers.push(() => split.revert());
      });

      /* ── slower-than-scroll drift ──────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-drift]", root).forEach((el) => {
        const frame = el.parentElement;
        if (!frame) return;
        const lag = 1 - (parseFloat(el.dataset.drift ?? "") || 0.8);
        // Same maths as ScrollSmoother's data-speed: the layer sits at its
        // natural position when the frame is centred in the viewport, runs
        // ahead before that and lags after it.
        const metrics = () => {
          const top = frame.getBoundingClientRect().top + window.scrollY;
          const end = top + frame.offsetHeight; // scroll position where the frame has left
          const centre = Math.max(0, top + frame.offsetHeight / 2 - window.innerHeight / 2);
          return { end, from: -lag * centre, to: lag * (end - centre) };
        };
        // The layer overhangs the frame by exactly the distance it travels.
        const size = () => {
          const m = metrics();
          el.style.setProperty("--drift-top", `${Math.ceil(m.to)}px`);
          el.style.setProperty("--drift-bottom", `${Math.ceil(-m.from)}px`);
        };
        size();
        gsap.fromTo(
          el,
          { y: () => metrics().from },
          {
            y: () => metrics().to,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: 0,
              end: () => metrics().end,
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: size,
            },
          },
        );
      });

      /* ── zoom-in when scrolled into view ───────────── */
      gsap.utils.toArray<HTMLElement>("[data-zoomin]", root).forEach((el) => {
        gsap.from(el, {
          duration: 2,
          autoAlpha: 0,
          scale: 1.2,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top 100%" },
        });
      });

      /* ── characters slide in from the right ────────── */
      gsap.utils.toArray<HTMLElement>("[data-chars]", root).forEach((el) => {
        const split = new SplitText(el, { type: "chars,words" });
        if (!split.chars.length) return;
        gsap.set(el, { perspective: 300 });
        gsap.from(split.chars, {
          duration: 1,
          delay: 0.5,
          x: 100,
          autoAlpha: 0,
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        });
        disposers.push(() => split.revert());
      });

      /* ── characters rise from below the line ───────── */
      gsap.utils.toArray<HTMLElement>("[data-rise]", root).forEach((el) => {
        const split = new SplitText(el, { type: "lines,words,chars", linesClass: "split-line" });
        if (!split.chars.length) return;
        gsap.set(split.chars, { yPercent: 110 });
        gsap.to(split.chars, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        disposers.push(() => split.revert());
      });

      /* ── count up (odometer replacement) ───────────── */
      gsap.utils.toArray<HTMLElement>("[data-count]", root).forEach((el) => {
        const target = parseFloat(el.dataset.count ?? "0");
        const state = { value: 0 };
        el.textContent = "0";
        gsap.to(state, {
          value: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(state.value).toLocaleString("en-IN")),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        disposers.push(() => (el.textContent = target.toLocaleString("en-IN")));
      });

      /* ── columns that slide past each other ────────── */
      gsap.utils.toArray<HTMLElement>("[data-shift]", root).forEach((el) => {
        const k = parseFloat(el.dataset.shift ?? "") || 0;
        const span = () => window.innerHeight + el.offsetHeight;
        gsap.fromTo(
          el,
          { y: () => (-k * span()) / 2 },
          {
            y: () => (k * span()) / 2,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });

      /* ── inset card → full width ───────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-expand]", root).forEach((el) => {
        gsap.fromTo(
          el,
          { "--expand": 0 },
          {
            "--expand": 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: 0,
              // Fully open a little before the card reaches the top of the screen.
              end: () => Math.max(1, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.08),
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, root);

    /* ── text scramble (shared by data-scramble and data-swap) ─ */
    const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];
    const busy = new WeakSet<HTMLElement>();

    const scrambleTo = (el: HTMLElement, text: string, duration: number) => {
      if (busy.has(el)) return;
      busy.add(el);
      const queue = Array.from(text, (to) => {
        const start = Math.floor(Math.random() * duration * 0.4 * 60);
        return { to, start, end: start + Math.floor(Math.random() * duration * 0.6 * 60) + 6, char: "" };
      });
      let frame = 0;
      const update = () => {
        let out = "";
        let done = 0;
        for (const q of queue) {
          if (frame >= q.end) {
            done++;
            out += q.to;
          } else if (frame >= q.start) {
            if (/\s/.test(q.to) || q.to === "," || q.to === ".") out += q.to;
            else {
              if (!q.char || Math.random() < 0.28) q.char = pick();
              out += q.char;
            }
          } else out += q.to;
        }
        el.textContent = out;
        if (done === queue.length) {
          gsap.ticker.remove(update);
          busy.delete(el);
        } else frame++;
      };
      gsap.ticker.add(update);
      disposers.push(() => gsap.ticker.remove(update));
    };

    root.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      const finalText = el.textContent ?? "";
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => scrambleTo(el, finalText, 1.2),
      });
      const onEnter = () => scrambleTo(el, finalText, 0.9);
      el.addEventListener("mouseenter", onEnter);
      disposers.push(() => {
        trigger.kill();
        el.removeEventListener("mouseenter", onEnter);
        el.textContent = finalText;
      });
    });

    root.querySelectorAll<HTMLElement>("[data-swap]").forEach((el) => {
      const words = (el.dataset.swap ?? "").split("|").filter(Boolean);
      if (words.length < 2) return;
      const first = el.textContent ?? words[0];
      let i = Math.max(0, words.indexOf(first));
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);
      const timer = window.setInterval(() => {
        if (!visible || document.hidden) return;
        i = (i + 1) % words.length;
        scrambleTo(el, words[i], 0.7);
      }, 2600);
      disposers.push(() => {
        window.clearInterval(timer);
        io.disconnect();
        el.textContent = first;
      });
    });

    return () => {
      disposers.forEach((d) => d());
      ctx.revert();
      root.classList.remove("orisa-js");
    };
  }, [scope]);
}
