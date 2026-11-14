"use client";

import { useEffect, useState } from "react";

/** Current time in India, ticking once a minute. Empty until mounted. */
export function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()) + " IST");
    tick();
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, []);
  return <span suppressHydrationWarning>{time || "— IST"}</span>;
}

/**
 * Footer sign-up row. There is no newsletter backend yet, so submitting
 * opens the visitor's mail app with a ready-made request to `to`.
 */
export function FooterSignup({ label, to }: { label: string; to: string }) {
  const [email, setEmail] = useState("");
  return (
    <form
      className="footer-13__form"
      onSubmit={(e) => {
        e.preventDefault();
        const body = encodeURIComponent(`Please add ${email} to your compliance updates.`);
        window.location.href = `mailto:${to}?subject=${encodeURIComponent("Subscribe to compliance updates")}&body=${body}`;
      }}
    >
      <p className="footer-13__form-label">{label}</p>
      <div className="footer-13__form-row">
        <label className="sr-only" htmlFor="footer-13-email">
          Email address
        </label>
        <input
          className="footer-13__form-input"
          id="footer-13-email"
          type="email"
          placeholder="your.email@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="footer-13__form-btn" type="submit">
          <span>SUBSCRIBE</span>
          <span className="footer-13__form-arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>
      </div>
    </form>
  );
}
