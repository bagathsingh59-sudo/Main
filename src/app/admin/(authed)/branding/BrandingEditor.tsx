"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, SaveBar } from "../../_components/Fields";
import { ImageUpload } from "../../_components/ImageUpload";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function BrandingEditor() {
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
  const b = draft.branding;

  function patch(partial: Partial<SiteSettings["branding"]>) {
    setDraft((d) => (d ? { ...d, branding: { ...d.branding, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ branding: draft.branding });
      setStatus({ kind: "ok", message: "Branding saved. Public site updates within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Branding"
        description="Upload your logo, favicon, and social-share image. All overrides — leave empty to use the bundled defaults. Uploads go to Vercel Blob storage."
      />

      <Card
        title="Main logo"
        description="Shown in the navbar and footer. SVG or transparent PNG recommended. Max 2 MB."
      >
        <ImageUpload
          purpose="logo"
          value={b.logoUrl}
          onChange={(url) => patch({ logoUrl: url })}
          hint="Recommended: 512×512 SVG or PNG with transparent background. Will be auto-scaled."
          aspect="square"
        />
      </Card>

      <Card
        title="Favicon"
        description="Tab icon shown in browser tabs and bookmarks. Should be a simple, recognisable symbol."
      >
        <ImageUpload
          purpose="favicon"
          value={b.faviconUrl}
          onChange={(url) => patch({ faviconUrl: url })}
          hint="Recommended: 64×64 or 128×128 PNG. Browsers automatically downscale to 16×16 for tabs."
          aspect="square"
        />
      </Card>

      <Card
        title="Open Graph image"
        description="Shown when your site is shared on LinkedIn, WhatsApp, X/Twitter, Slack, etc. Use a 1200×630 image with your logo + tagline visible."
      >
        <ImageUpload
          purpose="og"
          value={b.ogImageUrl}
          onChange={(url) => patch({ ogImageUrl: url })}
          hint="Recommended: exactly 1200×630 px PNG. Keep important content inside the centre 80% — some platforms crop the edges."
          aspect="wide"
        />
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
