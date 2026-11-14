"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MONTHLY_DEADLINES, OFFICE_HOURS } from "@/constants/deadlines";

/**
 * Optional hero extras — each one is switched on or off by its number
 * in HERO_IDEAS (src/components/orisa/config.ts).
 */

/* ── 4 · live office status ─────────────────────────────────── */

/** Current weekday and minutes-past-midnight in India, whatever the visitor's timezone. */
function nowInIndia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
}

export function LiveStatus({ fallback }: { fallback: string }) {
  // Rendered after mount only — the server cannot know the visitor's "now".
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const { day, minutes } = nowInIndia();
      const isOpenDay = (OFFICE_HOURS.openDays as readonly number[]).includes(day);
      setOpen(isOpenDay && minutes >= OFFICE_HOURS.opensAt && minutes < OFFICE_HOURS.closesAt);
    };
    check();
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="o-status" data-open={open === null ? undefined : open}>
      <span className="o-status__dot" aria-hidden="true" />
      <span>
        {open === null
          ? fallback
          : open
            ? "Office open now · replies within 1 working day"
            : `Closed now · opens ${OFFICE_HOURS.opensLabel} IST`}
      </span>
    </div>
  );
}

/* ── 5 · next statutory deadlines ───────────────────────────── */

interface TickerItem {
  label: string;
  when: string;
}

function upcoming(): TickerItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return MONTHLY_DEADLINES.map((d) => {
    const due = new Date(today.getFullYear(), today.getMonth(), d.day);
    if (due < today) due.setMonth(due.getMonth() + 1);
    const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
    const date = due.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return { due, label: d.label, when: days === 0 ? `${date} · today` : days === 1 ? `${date} · tomorrow` : `${date} · in ${days} days` };
  })
    .sort((a, b) => a.due.getTime() - b.due.getTime())
    .map(({ label, when }) => ({ label, when }));
}

export function DeadlineTicker() {
  // Server render shows the fixed day; the browser upgrades it to real dates.
  const [items, setItems] = useState<TickerItem[]>(() =>
    MONTHLY_DEADLINES.map((d) => ({ label: d.label, when: `due on the ${ordinal(d.day)}` })),
  );
  useEffect(() => setItems(upcoming()), []);

  const group = (hidden: boolean) => (
    <ul className="o-ticker__group" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.label} className="o-ticker__item">
          <span className="o-ticker__label">{it.label}</span>
          <span className="o-ticker__when">{it.when}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="o-ticker" role="region" aria-label="Upcoming statutory deadlines">
      <span className="o-ticker__tag">Next deadlines</span>
      <div className="o-ticker__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ── 10 · "Explore" cursor over the image ───────────────────── */

export function ExploreCursor({ hostSelector, label = "Explore" }: { hostSelector: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>(hostSelector);
    if (!el || !host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    host.classList.add("has-explore-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
      // Shrink out of the way over real links so they stay easy to hit.
      el.classList.toggle("is-small", !!(e.target as HTMLElement).closest("a, button"));
    };
    const enter = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      gsap.set(el, { x: e.clientX - rect.left, y: e.clientY - rect.top });
      el.classList.add("is-on");
    };
    const leave = () => el.classList.remove("is-on");
    // A click on the bare image carries on to the next section.
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) return;
      const next = host.closest("section")?.nextElementSibling;
      next?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("click", click);
    return () => {
      host.classList.remove("has-explore-cursor");
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("click", click);
    };
  }, [hostSelector]);

  return (
    <div ref={ref} className="o-explore" aria-hidden="true">
      <div className="o-explore__disc">
        <span>{label}</span>
      </div>
    </div>
  );
}
