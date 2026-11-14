"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionAllowed } from "../config";
import { useOrisaMotion } from "../useOrisaMotion";

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
              companySize: "11-50",
              service: form.dataset.service || "General enquiry",
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
      }, root);
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
