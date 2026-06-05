"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteSettings } from "@/services/settings";

interface State {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

export function useSettings() {
  const [state, setState] = useState<State>({ settings: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const json = (await res.json()) as { ok: boolean; settings?: SiteSettings; message?: string };
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.settings) {
          setState({ settings: null, loading: false, error: json.message ?? `HTTP ${res.status}` });
          return;
        }
        setState({ settings: json.settings, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({
          settings: null,
          loading: false,
          error: err instanceof Error ? err.message : "Network error",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Full-settings save — kept for backward compatibility. */
  const save = useCallback(async (next: SiteSettings) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const json = (await res.json()) as { ok: boolean; message?: string; settings?: SiteSettings };
    if (!res.ok || !json.ok) {
      throw new Error(json.message ?? `HTTP ${res.status}`);
    }
    setState({ settings: json.settings ?? next, loading: false, error: null });
  }, []);

  /**
   * Section-scoped save. Each editor passes only the sections it owns
   * (e.g. AutomationEditor sends both `automation` and `rateLimit`).
   * Validation runs only on those sections; other sections are read
   * from current storage and left untouched. This is the recommended
   * path — a bad SEO field can't block a banner save anymore.
   */
  const savePartial = useCallback(async (partial: Partial<SiteSettings>) => {
    // Strip any accidental `version` field so the API takes the partial path.
    const { version: _ignore, ...rest } = partial as Partial<SiteSettings> & { version?: unknown };
    void _ignore;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    });
    const json = (await res.json()) as { ok: boolean; message?: string; settings?: SiteSettings };
    if (!res.ok || !json.ok) {
      throw new Error(json.message ?? `HTTP ${res.status}`);
    }
    if (json.settings) {
      setState({ settings: json.settings, loading: false, error: null });
    }
  }, []);

  return { ...state, save, savePartial };
}
