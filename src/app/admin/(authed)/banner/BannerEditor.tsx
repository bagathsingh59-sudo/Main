"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

type BannerDraft = SiteSettings["banner"];

export function BannerEditor() {
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
  const b = draft.banner;

  function patch(partial: Partial<BannerDraft>) {
    setDraft((d) => (d ? { ...d, banner: { ...d.banner, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ banner: draft.banner });
      setStatus({ kind: "ok", message: "Banner saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const kind = b.kind ?? "strip";
  const style = b.style ?? "neutral";

  return (
    <div>
      <PageHeader
        title="Site banner & popups"
        description="Sitewide promotion surfaces. Choose a top strip, a centered popup, or a floating corner card — each has style + tone controls."
      />

      <Card>
        <Toggle
          checked={b.enabled}
          onChange={(v) => patch({ enabled: v })}
          label="Enable site banner / popup"
          description="When off, nothing renders regardless of the message below."
        />
      </Card>

      <Card
        title="Surface"
        description="What the user sees and where. Strip is calm and always-on; popup demands attention; floating sits at the corner."
      >
        <div className="space-y-4">
          <Field label="Banner kind" hint="Switch between the three surfaces.">
            <Select
              value={kind}
              onChange={(e) => patch({ kind: e.target.value as BannerDraft["kind"] })}
            >
              <option value="strip">Top strip — slim, full width, always visible</option>
              <option value="popup">Popup — centered modal, opens after a delay</option>
              <option value="floating">Floating card — bottom corner, dismissible</option>
            </Select>
          </Field>
          <Field label="Visual style" hint='"Neutral" preserves the calm legacy look. The other three add brand polish.'>
            <Select
              value={style}
              onChange={(e) => patch({ style: e.target.value as BannerDraft["style"] })}
            >
              <option value="neutral">Neutral — solid tone, classic minimalist (default)</option>
              <option value="gradient">Gradient — navy → teal sweep, high impact</option>
              <option value="glass">Glass — translucent frosted surface (premium)</option>
              <option value="branded">Branded — solid brand colour with subtle ring</option>
            </Select>
          </Field>
          <Field label="Tone" hint="Used by neutral + branded styles to colour-code the message.">
            <Select
              value={b.tone}
              onChange={(e) => patch({ tone: e.target.value as BannerDraft["tone"] })}
            >
              <option value="info">Info — navy (calm, informational)</option>
              <option value="warning">Warning — amber (deadlines, alerts)</option>
              <option value="success">Success — emerald (campaigns, wins)</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card
        title="Content"
        description="The headline + body + primary CTA. Popup/floating also use the headline + eyebrow fields below."
      >
        <div className="space-y-4">
          <Field label="Message / body" hint="Strip = one line. Popup/floating = up to 2-3 lines.">
            <Textarea
              value={b.message}
              onChange={(e) => patch({ message: e.target.value })}
              placeholder={
                kind === "strip"
                  ? "GST annual return deadline — book a consultation before 30 Sept."
                  : "Free 45-minute compliance audit for businesses with 20+ employees. We'll review your last six filings and flag the priority fixes."
              }
              maxLength={400}
              rows={kind === "strip" ? 2 : 3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary CTA URL" hint="Where the button click goes.">
              <Input value={b.linkUrl} onChange={(e) => patch({ linkUrl: e.target.value })} placeholder="/contact" />
            </Field>
            <Field label="Primary CTA label" hint="Button text. Empty = no button.">
              <Input value={b.linkLabel} onChange={(e) => patch({ linkLabel: e.target.value })} placeholder="Book your free audit" />
            </Field>
          </div>
        </div>
      </Card>

      {(kind === "popup" || kind === "floating") && (
        <Card
          title="Popup & floating extras"
          description="Headline + eyebrow + secondary CTA fields specific to popup/floating surfaces. Ignored when kind = Strip."
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" hint="Small uppercase label above the headline.">
                <Input
                  value={b.popupEyebrow}
                  onChange={(e) => patch({ popupEyebrow: e.target.value })}
                  placeholder="Free audit"
                  maxLength={40}
                />
              </Field>
              <Field label="Headline" hint="One short, bold sentence.">
                <Input
                  value={b.popupHeadline}
                  onChange={(e) => patch({ popupHeadline: e.target.value })}
                  placeholder="Save ₹3-4 lakh in EPF penalties this year"
                  maxLength={80}
                />
              </Field>
            </div>
            {kind === "popup" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Secondary CTA URL" hint="Optional second button. Empty = single CTA.">
                  <Input
                    value={b.popupCtaSecondaryUrl}
                    onChange={(e) => patch({ popupCtaSecondaryUrl: e.target.value })}
                    placeholder="/services"
                  />
                </Field>
                <Field label="Secondary CTA label">
                  <Input
                    value={b.popupCtaSecondaryLabel}
                    onChange={(e) => patch({ popupCtaSecondaryLabel: e.target.value })}
                    placeholder="Browse services"
                    maxLength={40}
                  />
                </Field>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {kind === "popup" && (
                <Field label="Show delay (seconds)" hint="How long before the popup opens. 0 = immediately. Recommended: 4-8.">
                  <Input
                    type="number"
                    min={0}
                    max={60}
                    value={String(b.popupShowDelaySec ?? 4)}
                    onChange={(e) => patch({ popupShowDelaySec: Math.max(0, Math.min(60, Number(e.target.value) || 0)) })}
                  />
                </Field>
              )}
              <Field label="Frequency" hint="Once per session = re-shows after browser restart. Once per device = sticky until storage cleared.">
                <Select
                  value={b.popupFrequency ?? "session"}
                  onChange={(e) => patch({ popupFrequency: e.target.value as BannerDraft["popupFrequency"] })}
                >
                  <option value="session">Once per session (recommended)</option>
                  <option value="once">Once per device</option>
                  <option value="always">Every page load (test only)</option>
                </Select>
              </Field>
            </div>
            {kind === "floating" && (
              <Field label="Floating card position">
                <Select
                  value={b.floatingPosition ?? "bottom-right"}
                  onChange={(e) => patch({ floatingPosition: e.target.value as BannerDraft["floatingPosition"] })}
                >
                  <option value="bottom-right">Bottom right (default)</option>
                  <option value="bottom-left">Bottom left</option>
                </Select>
              </Field>
            )}
          </div>
        </Card>
      )}

      <Card title="Preview">
        <BannerPreview banner={b} />
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

/* ──────────────────────── inline preview ──────────────────────── */

function BannerPreview({ banner }: { banner: BannerDraft }) {
  const kind = banner.kind ?? "strip";
  const style = banner.style ?? "neutral";
  const tone = banner.tone;
  const message = banner.message || "Your message will appear here…";
  const headline = banner.popupHeadline || "Your headline here";
  const eyebrow = banner.popupEyebrow;

  const stripBg =
    style === "gradient"
      ? "bg-gradient-to-r from-navy-700 via-navy-600 to-teal-500 text-white"
      : style === "glass"
        ? "bg-white/80 text-navy-900 backdrop-blur-xl border border-slate-200"
        : tone === "warning"
          ? "bg-amber-500 text-white"
          : tone === "success"
            ? "bg-emerald-600 text-white"
            : "bg-navy-600 text-white";

  const cardBg =
    style === "gradient"
      ? "bg-gradient-to-br from-navy-700 via-navy-600 to-teal-500 text-white"
      : style === "glass"
        ? "bg-white/85 text-slate-900 backdrop-blur-xl border border-white/40"
        : style === "branded"
          ? `${tone === "warning" ? "bg-amber-500" : tone === "success" ? "bg-emerald-600" : "bg-navy-700"} text-white`
          : "bg-white text-slate-900 border border-slate-200 shadow";

  if (kind === "strip") {
    return (
      <div className={`${stripBg} rounded-lg px-4 py-2.5 text-center text-[0.88rem]`}>
        {message}
        {banner.linkUrl && banner.linkLabel && (
          <a href={banner.linkUrl} className="ml-2 inline-block underline opacity-90">
            {banner.linkLabel}
          </a>
        )}
      </div>
    );
  }

  if (kind === "popup") {
    return (
      <div className="flex justify-center rounded-xl bg-slate-100 px-4 py-8 dark:bg-slate-900">
        <div className={`w-full max-w-md overflow-hidden rounded-2xl ${cardBg} p-6`}>
          {eyebrow && (
            <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-75">
              {eyebrow}
            </div>
          )}
          <div className="mb-2 text-[1.2rem] font-bold leading-tight">{headline}</div>
          <p className="mb-4 text-[0.88rem] opacity-85">{message}</p>
          <div className="flex flex-wrap gap-2">
            {banner.linkLabel && (
              <span
                className={`inline-flex items-center rounded-lg px-3.5 py-2 text-[0.82rem] font-semibold ${
                  style === "neutral" || style === "glass" ? "bg-navy-600 text-white" : "bg-white text-navy-700"
                }`}
              >
                {banner.linkLabel}
              </span>
            )}
            {banner.popupCtaSecondaryLabel && (
              <span
                className={`inline-flex items-center rounded-lg border px-3.5 py-2 text-[0.82rem] font-semibold ${
                  style === "neutral" || style === "glass" ? "border-slate-200 text-slate-700" : "border-white/30 text-white"
                }`}
              >
                {banner.popupCtaSecondaryLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // floating
  return (
    <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
      <div
        className={`absolute bottom-4 ${
          (banner.floatingPosition ?? "bottom-right") === "bottom-left" ? "left-4" : "right-4"
        } w-72 overflow-hidden rounded-xl p-4 ${cardBg}`}
      >
        {eyebrow && (
          <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] opacity-75">{eyebrow}</div>
        )}
        <div className="mb-1 text-[0.95rem] font-bold leading-snug">{headline}</div>
        <p className="mb-2.5 text-[0.78rem] opacity-85">{message}</p>
        {banner.linkLabel && (
          <span
            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold ${
              style === "neutral" || style === "glass" ? "bg-navy-600 text-white" : "bg-white text-navy-700"
            }`}
          >
            {banner.linkLabel} →
          </span>
        )}
      </div>
    </div>
  );
}
