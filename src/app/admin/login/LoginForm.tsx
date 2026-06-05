"use client";

import { useState } from "react";

export function LoginForm({ next, reason }: { next: string; reason?: string }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reasonText: Record<string, string> = {
    expired: "Your session expired. Please sign in again.",
    bad_signature: "Your session was invalidated. Please sign in again.",
    missing: "",
    malformed: "Your session was malformed. Please sign in.",
    not_configured: "Admin authentication isn't configured on this deployment.",
  };
  const banner = reason ? reasonText[reason] ?? null : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMsg(json.message ?? "Sign-in failed");
        return;
      }
      window.location.href = next.startsWith("/admin") ? next : "/admin";
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 px-4 py-16">
      <div className="mx-auto max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-teal-600 shadow-xl">
            <span className="text-lg font-bold text-white">V</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">Admin sign-in</h1>
          <p className="mt-1 text-[0.85rem] text-slate-400">Vaishnavi Consultant — internal</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md"
        >
          {banner && (
            <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 px-3 py-2 text-[0.82rem] text-amber-200">
              {banner}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-200">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
              className="block w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-[0.95rem] text-white outline-none placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </label>

          {status === "error" && errorMsg && (
            <div className="rounded-lg border border-rose-700/50 bg-rose-900/20 px-3 py-2 text-[0.82rem] text-rose-200">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-gradient-to-r from-navy-600 to-teal-600 px-4 py-2.5 text-[0.92rem] font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {status === "submitting" ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-[0.75rem] text-slate-500">
            This page is not indexed and not linked from the public site.
          </p>
        </form>
      </div>
    </div>
  );
}
