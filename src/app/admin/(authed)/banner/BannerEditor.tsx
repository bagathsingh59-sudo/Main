"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function BannerEditor() {
  const { settings, loading, error, save } = useSettings();
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
  const b = draft.banner;

  function patch(partial: Partial<SiteSettings["banner"]>) {
    setDraft((d) => (d ? { ...d, banner: { ...d.banner, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await save(draft);
      setStatus({ kind: "ok", message: "Banner saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const previewBg = b.tone === "warning" ? "bg-amber-500" : b.tone === "success" ? "bg-emerald-600" : "bg-navy-600";

  return (
    <div>
      <PageHeader
        title="Site banner"
        description="Sitewide announcement strip at the very top of every page. Use sparingly — for compliance deadlines, office closures, campaign moments."
      />

      <Card>
        <Toggle
          checked={b.enabled}
          onChange={(v) => patch({ enabled: v })}
          label="Show banner on the public site"
          description="When off, no banner renders regardless of the message below."
        />
      </Card>

      <Card title="Content">
        <div className="space-y-4">
          <Field label="Message" hint="Keep it under 100 characters for one-line display on mobile.">
            <Textarea
              value={b.message}
              onChange={(e) => patch({ message: e.target.value })}
              placeholder="GST annual return deadline — book a consultation before 30 Sept."
              maxLength={200}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Link URL (optional)" hint="Where the banner click goes. Leave empty for a non-clickable banner.">
              <Input value={b.linkUrl} onChange={(e) => patch({ linkUrl: e.target.value })} placeholder="/contact" />
            </Field>
            <Field label="Link label" hint="Visible only when Link URL is set.">
              <Input value={b.linkLabel} onChange={(e) => patch({ linkLabel: e.target.value })} placeholder="Book now →" />
            </Field>
          </div>
          <Field label="Tone" hint="Affects banner colour.">
            <Select
              value={b.tone}
              onChange={(e) => patch({ tone: e.target.value as SiteSettings["banner"]["tone"] })}
            >
              <option value="info">Info — navy</option>
              <option value="warning">Warning — amber</option>
              <option value="success">Success — emerald</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card title="Preview">
        <div className={`${previewBg} rounded-lg px-4 py-2.5 text-center text-[0.88rem] text-white`}>
          {b.message || <span className="opacity-60">Your message will appear here…</span>}
          {b.linkUrl && b.linkLabel && (
            <a href={b.linkUrl} className="ml-2 inline-block underline opacity-90">
              {b.linkLabel}
            </a>
          )}
        </div>
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
