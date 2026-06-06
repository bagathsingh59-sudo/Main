"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar } from "../../_components/Fields";

/**
 * Accepts either a raw embed URL or a full <iframe…> snippet pasted from
 * Google's "Share or embed map" dialog. Pulls the `src` URL out, and
 * silently rejects anything that isn't a google.com/maps/embed URL so
 * an admin can't accidentally drop a third-party iframe into the page.
 */
function MapEmbedInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  // Keep local draft in sync when settings refresh externally.
  useEffect(() => {
    setDraft(value);
  }, [value]);

  function normalise(input: string): { ok: true; url: string } | { ok: false; reason: string } {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, url: "" };
    // If it looks like an iframe snippet, extract src first.
    let candidate = trimmed;
    const m = trimmed.match(/src=["']([^"']+)["']/i);
    if (m) candidate = m[1];
    try {
      const u = new URL(candidate);
      if (u.hostname !== "www.google.com" && u.hostname !== "google.com") {
        return { ok: false, reason: "Must be a google.com URL." };
      }
      if (!u.pathname.startsWith("/maps/embed")) {
        return {
          ok: false,
          reason: "Must be a google.com/maps/embed URL. Use the 'Embed a map' option in Google's share dialog.",
        };
      }
      return { ok: true, url: candidate };
    } catch {
      return { ok: false, reason: "Couldn't parse a URL out of that input." };
    }
  }

  function commit() {
    const result = normalise(draft);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setError(null);
    if (result.url !== value) onChange(result.url);
  }

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (error) setError(null);
        }}
        onBlur={commit}
        rows={3}
        placeholder={"<iframe src=\"https://www.google.com/maps/embed?pb=…\" width=\"600\" height=\"450\" …></iframe>"}
        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-[0.78rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-navy-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500"
      />
      {error && <p className="mt-1.5 text-[0.78rem] text-rose-600 dark:text-rose-400">{error}</p>}
      <p className="mt-1.5 text-[0.78rem] text-slate-500 dark:text-slate-400">
        In Google Maps → Search your business → Share → <strong>Embed a map</strong> → Copy HTML → paste here.
      </p>
    </div>
  );
}
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function ContactInfoEditor() {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const ci = draft.contactInfo;

  function patch(partial: Partial<SiteSettings["contactInfo"]>) {
    setDraft((d) => (d ? { ...d, contactInfo: { ...d.contactInfo, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ contactInfo: draft.contactInfo });
      setStatus({ kind: "ok", message: "Contact info saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Contact info"
        description="Phone, email, address and hours used in the site footer, contact page, and email templates."
      />

      <Card title="Phone & email">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary phone">
            <Input value={ci.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </Field>
          <Field label="Alternate phone">
            <Input value={ci.altPhone} onChange={(e) => patch({ altPhone: e.target.value })} />
          </Field>
          <Field label="Primary email">
            <Input type="email" value={ci.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
          <Field label="Support email">
            <Input type="email" value={ci.supportEmail} onChange={(e) => patch({ supportEmail: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="Address">
        <div className="grid gap-4">
          <Field label="Address line 1">
            <Input value={ci.addressLine1} onChange={(e) => patch({ addressLine1: e.target.value })} />
          </Field>
          <Field label="Address line 2">
            <Input value={ci.addressLine2} onChange={(e) => patch({ addressLine2: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City">
              <Input value={ci.city} onChange={(e) => patch({ city: e.target.value })} />
            </Field>
            <Field label="State">
              <Input value={ci.state} onChange={(e) => patch({ state: e.target.value })} />
            </Field>
            <Field label="PIN code">
              <Input value={ci.pin} onChange={(e) => patch({ pin: e.target.value })} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Working hours">
        <Field label="Hours" hint="Free-text — e.g. 'Mon – Sat · 9:30 AM – 7:00 PM IST'.">
          <Input value={ci.hours} onChange={(e) => patch({ hours: e.target.value })} />
        </Field>
      </Card>

      <Card
        title="Google Maps embed"
        description="Shows an interactive map on /contact. Improves local-SEO consistency with your Google Business Profile."
      >
        <Field
          label="Embed URL or iframe code"
          hint="Paste either the full <iframe …> from Google's 'Embed a map' button OR just the src URL. We auto-extract it and only accept google.com/maps/embed URLs."
        >
          <MapEmbedInput value={ci.mapEmbedUrl} onChange={(v) => patch({ mapEmbedUrl: v })} />
        </Field>
        {ci.mapEmbedUrl && (
          <div className="mt-4">
            <div className="mb-1.5 text-[0.75rem] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Preview
            </div>
            <div className="aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              {/* eslint-disable-next-line react/iframe-missing-sandbox */}
              <iframe
                src={ci.mapEmbedUrl}
                className="h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Map preview"
              />
            </div>
          </div>
        )}
      </Card>

      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={onSave}
        onReset={() => {
          setDraft(settings);
          setStatus({ kind: "idle" });
        }}
      />
    </div>
  );
}
