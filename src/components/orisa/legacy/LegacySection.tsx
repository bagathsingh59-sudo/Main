"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionAllowed } from "../config";
import { useOrisaMotion } from "../useOrisaMotion";
import { startThrowable } from "../throwable";

/**
 * Wrapper for sections ported from the template with port-section.py.
 *
 *  • `.o-legacy` switches on the scoped template CSS (legacy.css);
 *  • the shared motion attributes (data-fade, data-reveal …) are wired;
 *  • the template's jQuery behaviours these sections rely on are
 *    re-implemented here without jQuery:
 *      - Bootstrap accordion      [data-bs-toggle="collapse"]
 *      - pinned stacking panels   .at-panel-pin inside .at-panel-pin-area
 *      - scroll-driven strip      .at-item-anime.marque inside .at-item-anime-area
 *      - image that scales up     .scale-up inside .scale-up-img
 *      - award row hover preview  .card-award[data-img-award]
 *      - service rows swap image  .service-item ↔ .hover-image
 *      - logo / image tickers     .carouselTicker .carouselTicker__list
 *      - stacked cards on scroll  .section-fix (title pinned, .item cards slide up)
 *      - contact form             form.sec-4-about-form → POST /api/contact
 *      - index-8 pieces           [data-parallax-range] / [data-card-parallax] drift,
 *                                 .at-item-anime-2 reverse strip, .scale-img-from-to,
 *                                 .at-scroll-rotate, .scroll-move-up, pinned
 *                                 .sec-8-home-8__stage, .text-scale-anim letters
 *      - throwable tags           [data-t-throwable-scene] (Matter.js, loaded on demand)
 *
 * The wrapped content is static server-rendered markup, so React never
 * re-renders it and the DOM changes made here are safe.
 */
export function LegacySection({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useOrisaMotion(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const off: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn);
      off.push(() => el.removeEventListener(type, fn));
    };

    /* ── accordion ─────────────────────────────────── */
    root.querySelectorAll<HTMLElement>('[data-bs-toggle="collapse"]').forEach((btn) => {
      const target = root.querySelector<HTMLElement>(btn.dataset.bsTarget ?? "");
      if (!target) return;
      on(btn, "click", (e) => {
        e.preventDefault();
        const open = !target.classList.contains("show");
        const group = target.dataset.bsParent ? root.querySelector(target.dataset.bsParent) : null;
        group?.querySelectorAll<HTMLElement>(".collapse.show").forEach((other) => {
          if (other === target) return;
          other.classList.remove("show");
          root.querySelectorAll<HTMLElement>(`[data-bs-target="#${other.id}"]`).forEach((b) => {
            b.classList.add("collapsed");
            b.setAttribute("aria-expanded", "false");
          });
        });
        target.classList.toggle("show", open);
        btn.classList.toggle("collapsed", !open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });

    /* ── logo / image tickers (jQuery carouselTicker) ── */
    root.querySelectorAll<HTMLElement>(".carouselTicker").forEach((ticker) => {
      const list = ticker.querySelector<HTMLElement>(".carouselTicker__list");
      if (!list || list.dataset.ticking) return;
      // Two copies side by side; the CSS animation slides by exactly one copy.
      Array.from(list.children).forEach((child) => {
        const copy = child.cloneNode(true) as HTMLElement;
        copy.setAttribute("aria-hidden", "true");
        list.appendChild(copy);
      });
      list.dataset.ticking = "1";
      list.classList.add("o-ticking");
    });

    /* ── service rows swap the picture on the left ──── */
    const items = root.querySelectorAll<HTMLElement>(".service-item");
    const pics = root.querySelectorAll<HTMLElement>(".hover-image");
    if (items.length && pics.length) {
      gsap.set(pics, { opacity: 0, y: 50, zIndex: 1 });
      gsap.set(pics[0], { opacity: 1, y: 0, zIndex: 2 });
      items.forEach((item, index) => {
        on(item, "mouseenter", () => {
          items.forEach((el) => el.classList.toggle("active", el === item));
          pics.forEach((pic, i) =>
            gsap.to(pic, i === index ? { opacity: 1, y: 0, scale: 1, zIndex: 2, duration: 0.8 } : { opacity: 0, y: 200, scale: 0.8, zIndex: 1, duration: 0.8 }),
          );
        });
      });
    }

    /* ── award rows: image follows the cursor ──────── */
    const rows = root.querySelectorAll<HTMLElement>("[data-img-award]");
    if (rows.length && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const preview = document.createElement("div");
      preview.className = "o-award-preview";
      const img = document.createElement("img");
      img.alt = "";
      preview.appendChild(img);
      document.body.appendChild(preview);
      const xTo = gsap.quickTo(preview, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.4, ease: "power3" });
      rows.forEach((row) => {
        const raw = row.dataset.imgAward ?? "";
        const src = raw.startsWith("assets/imgs/") ? "/orisa/tpl/" + raw.slice("assets/imgs/".length) : raw;
        on(row, "pointerenter", () => {
          img.src = src;
          preview.classList.add("is-on");
        });
        on(row, "pointermove", (e) => {
          xTo(e.clientX + 24);
          yTo(e.clientY - 80);
        });
        on(row, "pointerleave", () => preview.classList.remove("is-on"));
      });
      off.push(() => preview.remove());
    }

    /* ── site search form (404 page): jump to the best match ── */
    root.querySelectorAll<HTMLFormElement>("form[data-site-search]").forEach((form) => {
      let targets: { label: string; href: string; keywords?: string }[] = [];
      try {
        targets = JSON.parse(form.dataset.siteSearch ?? "[]");
      } catch {
        /* malformed list — search stays inert */
      }
      const note = document.createElement("p");
      note.className = "o-form-note";
      note.setAttribute("role", "status");
      form.appendChild(note);
      on(form, "submit", (e) => {
        e.preventDefault();
        const words = String(new FormData(form).get("q") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
        // A word in the page's name counts three times a word in its description.
        const score = (t: (typeof targets)[number]) => {
          const label = t.label.toLowerCase();
          const rest = (t.keywords ?? "").toLowerCase();
          return words.reduce((n, w) => n + (label.includes(w) ? 3 : 0) + (rest.includes(w) ? 1 : 0), 0);
        };
        const best = targets.map((t) => ({ t, s: score(t) })).sort((a, b) => b.s - a.s)[0];
        if (best && best.s > 0) window.location.assign(best.t.href);
        else note.textContent = "Nothing matched — try “payroll”, “GST” or “contact”.";
      });
    });

    /* ── contact form → existing lead API ──────────── */
    root.querySelectorAll<HTMLFormElement>("form.sec-4-about-form").forEach((form) => {
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const label = button?.querySelector<HTMLElement>(".text-1") ?? button;
      const original = label?.textContent ?? "";
      const note = document.createElement("p");
      note.className = "o-form-note";
      note.setAttribute("role", "status");
      form.appendChild(note);
      on(form, "submit", async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const [first, ...rest] = String(data.get("name") ?? "").trim().split(/\s+/);
        if (label) label.textContent = "Sending…";
        if (button) button.disabled = true;
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: first || "",
              lastName: rest.join(" ") || "-",
              email: String(data.get("email") ?? ""),
              phone: String(data.get("phone") ?? ""),
              company: "",
              companySize: String(data.get("companySize") || "11-50"),
              service: String(data.get("service") || form.dataset.service || "General enquiry"),
              message: String(data.get("message") ?? ""),
            }),
          });
          const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
          if (res.ok && json.ok) {
            note.textContent = "Thank you — a consultant will reply within one working day.";
            note.dataset.state = "ok";
            form.reset();
          } else {
            note.textContent = json.message || "Please check the details and try again.";
            note.dataset.state = "error";
          }
        } catch {
          note.textContent = "Couldn't send — please email or call us instead.";
          note.dataset.state = "error";
        } finally {
          if (label) label.textContent = original;
          if (button) button.disabled = false;
        }
      });
    });

    /* ── scroll-driven pieces ──────────────────────── */
    let ctx: gsap.Context | undefined;
    if (motionAllowed()) {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1199px)", () => {
          const area = root.querySelector(".at-panel-pin-area");
          root.querySelectorAll<HTMLElement>(".at-panel-pin").forEach((panel) => {
            ScrollTrigger.create({ trigger: panel, pin: panel, start: "top 5%", end: "bottom 90%", endTrigger: area ?? panel, pinSpacing: false });
          });
        });

        const area = root.querySelector(".at-item-anime-area");
        const strips = root.querySelectorAll(".at-item-anime.marque");
        if (area && strips.length) {
          gsap.fromTo(strips, { x: "35%" }, { x: "-200%", ease: "none", scrollTrigger: { trigger: area, start: "-1000 0%", end: "bottom 0%", scrub: true, invalidateOnRefresh: true } });
        }

        /* pinned title + cards stacking on scroll (.section-fix) */
        root.querySelectorAll<HTMLElement>(".section-fix").forEach((fix) => {
          const items = fix.querySelectorAll<HTMLElement>(".scroll-section.vertical-section .wrapper .item");
          if (!fix.querySelector(".section-title-pin") || !items.length) return;
          items.forEach((item, i) => i && gsap.set(item, { yPercent: 100 }));
          const setActive = (p: number) => {
            const index = Math.min(Math.floor(Math.min(Math.max(p, 0), 0.9999) * items.length), items.length - 1);
            items.forEach((el, i) => el.classList.toggle("active", i === index));
          };
          const tl = gsap.timeline({
            scrollTrigger: { trigger: fix, pin: true, start: "top top", end: () => `+=${items.length * 50}%`, scrub: 1, invalidateOnRefresh: true, onUpdate: (st) => setActive(st.progress) },
            defaults: { ease: "none", duration: 1 },
          });
          items.forEach((item, i) => {
            tl.to(item, { scale: 0.9 });
            if (items[i + 1]) tl.to(items[i + 1], { yPercent: 0 }, "<");
          });
        });

        root.querySelectorAll<HTMLElement>(".scale-up-img").forEach((section) => {
          const target = section.querySelector(".scale-up");
          if (target) gsap.to(target, { scale: 1.15, scrollTrigger: { trigger: section, start: "top bottom", end: "bottom center", scrub: 1 } });
        });

        /* second scroll-driven strip, moving the other way (index-8 rails) */
        const area2 = root.querySelector(".at-item-anime-area-2");
        const strips2 = root.querySelectorAll(".at-item-anime-2.marque");
        if (area2 && strips2.length) {
          gsap.fromTo(strips2, { x: "-35%" }, { x: "200%", ease: "none", scrollTrigger: { trigger: area2, start: "-1000 0%", end: "bottom 0%", scrub: true, invalidateOnRefresh: true } });
        }

        /* photos / cards drifting at their own speed, alternating direction
           [data-parallax-range] travels ±range/2, [data-card-parallax] ±range */
        const narrow = window.innerWidth < 768;
        const drift = (selector: string, attr: string, half: boolean, mobile: number, scrub: number) => {
          root.querySelectorAll<HTMLElement>(selector).forEach((box, i) => {
            const range = (parseFloat(box.getAttribute(attr) ?? "") || 60) * (narrow ? mobile : 1) * (half ? 0.5 : 1);
            const dir = i % 2 === 0 ? 1 : -1;
            gsap.fromTo(
              box,
              { y: range * dir },
              {
                y: -range * dir,
                ease: box.dataset.parallaxEase || "none",
                scrollTrigger: { trigger: box.closest("section") ?? box, start: "top bottom", end: "bottom top", scrub, invalidateOnRefresh: true },
              },
            );
          });
        };
        drift("[data-parallax-range]", "data-parallax-range", true, 0.55, 0.85);
        drift("[data-card-parallax]", "data-card-parallax", false, 0.5, 0.75);

        /* picture that settles from a zoom as it scrolls in */
        root.querySelectorAll<HTMLElement>(".scale-img-from-to").forEach((img) => {
          const from = parseFloat(img.dataset.value1 ?? "") || 1.5;
          const to = parseFloat(img.dataset.value2 ?? "") || 1;
          gsap.fromTo(img, { scale: from }, { scale: to, ease: "none", scrollTrigger: { trigger: img.parentElement ?? img, start: "top bottom", end: "bottom center", scrub: 1 } });
        });

        /* asterisk that turns with the scroll */
        root.querySelectorAll<HTMLElement>(".at-scroll-rotate").forEach((el) => {
          gsap.to(el, { rotation: 360, ease: "none", scrollTrigger: { trigger: el.closest("section") ?? el, start: "top bottom", end: "bottom top", scrub: 1 } });
        });

        mm.add("(min-width: 992px)", () => {
          /* gentle lift on scroll */
          root.querySelectorAll<HTMLElement>(".scroll-move-up").forEach((el) => {
            gsap.to(el, { y: -100, scrollTrigger: { trigger: el, start: "top 70%", scrub: 1 } });
          });

          /* index-12 projects: pin the stack, each card slides up over the last */
          const stack = root.querySelector<HTMLElement>(".sec-2-home-12__cards");
          const stackCards = stack ? Array.from(stack.querySelectorAll<HTMLElement>(".card-home-12-project")) : [];
          if (stack && stackCards.length > 1) {
            const tallest = Math.max(...stackCards.map((c) => c.offsetHeight));
            stackCards.forEach((card, i) => gsap.set(card, { position: "absolute", left: 0, right: 0, top: 0, margin: 0, zIndex: i + 1 }));
            gsap.set(stack, { position: "relative", height: tallest + 50 * (stackCards.length - 1) });
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stack,
                start: "top 96px",
                end: () => `+=${window.innerHeight * 0.7 * (stackCards.length - 1)}`,
                pin: true,
                pinSpacing: true,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            for (let i = 1; i < stackCards.length; i++) {
              gsap.set(stackCards[i], { yPercent: 100 });
              tl.to(stackCards[i], { yPercent: 0, duration: 1 }, i - 1);
              for (let j = 0; j < i; j++) tl.to(stackCards[j], { y: (i - j) * 14, scale: 1 - (i - j) * 0.025, duration: 1 }, i - 1);
            }
          }

          /* index-8 testimonials: pin the stage, cards rise past the title */
          const stage = root.querySelector<HTMLElement>(".sec-8-home-8__stage");
          const center = stage?.querySelector<HTMLElement>(".sec-8-home-8__center");
          const groups = stage ? Array.from(stage.querySelectorAll<HTMLElement>(".sec-8-home-8__group")) : [];
          if (stage && center && groups.length) {
            const distance = () => Math.max(0, Math.max(...groups.map((g) => g.offsetTop + g.offsetHeight)) - center.offsetTop);
            gsap
              .timeline({ scrollTrigger: { trigger: center, start: "top 10%", end: () => `+=${distance()}`, pin: stage, pinSpacing: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } })
              .to(groups, { y: () => -distance(), ease: "none" }, 0);
          }
        });
      }, root);
    }

    /* ── draggable tags that drop in (template throwable.js) ── */
    root.querySelectorAll<HTMLElement>("[data-t-throwable-scene]").forEach((scene) => {
      let stop: (() => void) | undefined;
      let cancelled = false;
      startThrowable(scene).then((fn) => (cancelled ? fn() : (stop = fn)));
      off.push(() => {
        cancelled = true;
        stop?.();
      });
    });

    /* ── letters that stretch under the pointer (.text-scale-anim) ── */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      root.querySelectorAll<HTMLElement>(".text-scale-anim").forEach((heading) => {
        const original = heading.innerHTML;
        const parts: Node[] = [];
        heading.childNodes.forEach((node) => {
          if (node.nodeType !== Node.TEXT_NODE) return void parts.push(node.cloneNode(true));
          const words = (node.textContent ?? "").split(" ");
          words.forEach((word, w) => {
            if (word) {
              const wordSpan = document.createElement("span");
              wordSpan.className = "at-word-span";
              Array.from(word).forEach((ch) => {
                const letter = document.createElement("span");
                letter.className = "at-letter-span";
                letter.textContent = ch;
                wordSpan.appendChild(letter);
              });
              parts.push(wordSpan);
            }
            if (w < words.length - 1) parts.push(document.createTextNode(" "));
          });
        });
        heading.replaceChildren(...parts);
        const letters = Array.from(heading.querySelectorAll<HTMLElement>(".at-letter-span"));
        const stretch = (el: HTMLElement | undefined, scaleY: number, y: string) => el && gsap.to(el, { scaleY, y, duration: 0.4, ease: "sine" });
        letters.forEach((letter, i) => {
          on(letter, "mouseenter", () => {
            stretch(letter, 1.6, "-24%");
            stretch(letters[i - 1], 1.3, "-12%");
            stretch(letters[i + 1], 1.3, "-12%");
          });
          on(letter, "mouseleave", () => [letter, letters[i - 1], letters[i + 1]].forEach((el) => stretch(el, 1, "0%")));
        });
        off.push(() => {
          gsap.killTweensOf(letters);
          heading.innerHTML = original;
        });
      });
    }

    return () => {
      off.forEach((f) => f());
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} id={id} className={`o-legacy${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
