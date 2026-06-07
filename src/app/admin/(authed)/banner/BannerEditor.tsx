"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

type BannerDraft = SiteSettings["banner"];
type Preset = "classic" | "modern" | "popup" | "floating" | "sticky";

const UI_EFFECTS: Array<{ value: string; label: string; suggestedFor: string }> = [
  { value: "default", label: "Use global setting", suggestedFor: "Inherit the site-wide effect set below" },
  { value: "none", label: "None", suggestedFor: "Quiet, no overlay" },
  { value: "confetti", label: "🎉 Confetti", suggestedFor: "Milestones, launches" },
  { value: "sparkle", label: "✨ Sparkle", suggestedFor: "Premium feel, testimonials" },
  { value: "glitter-anniversary", label: "🥇 Glitter — anniversary", suggestedFor: "Site / brand anniversary" },
  { value: "snow-holiday", label: "❄ Snow — holiday", suggestedFor: "Dec / New Year" },
  { value: "fireworks-launch", label: "🎆 Fireworks", suggestedFor: "Product launches, Independence/Republic Day" },
  { value: "shimmer-premium", label: "💎 Shimmer — premium", suggestedFor: "Luxury offers, VIP audit" },
  { value: "floating-icons", label: "🪔 Floating icons", suggestedFor: "Diwali, Eid, festival campaigns" },
  { value: "glow-pulse-urgent", label: "🚨 Glow pulse — urgent", suggestedFor: "Deadline reminders, last-day offers" },
  { value: "coupon-burst-sale", label: "🏷 Coupon burst — sale", suggestedFor: "Discount campaigns, sale events" },
  { value: "ribbons-celebration", label: "🎀 Ribbons — celebration", suggestedFor: "Graduations, year-end wraps" },
];

/**
 * Preset library — each preset is a starting point with pre-tuned
 * defaults that suit a particular use case. Operators pick one, then
 * tweak. Underneath they all write to the same banner schema.
 */
const PRESETS: Array<{
  id: Preset;
  label: string;
  blurb: string;
  emoji: string;
  defaults: Partial<BannerDraft>;
}> = [
  {
    id: "classic",
    label: "Classic strip",
    blurb: "Calm, single-line top strip in your existing minimalist style. Best for permanent notices.",
    emoji: "📌",
    defaults: { kind: "strip", style: "neutral", tone: "info", dismissible: false },
  },
  {
    id: "modern",
    label: "Modern strip",
    blurb: "Branded gradient or glass-frosted top strip. High polish, attention-grabbing.",
    emoji: "✨",
    defaults: { kind: "strip", style: "gradient", tone: "success", dismissible: true },
  },
  {
    id: "popup",
    label: "Popup ad",
    blurb: "Centered modal with timer + frequency control. Best for lead capture and sales.",
    emoji: "🎯",
    defaults: {
      kind: "popup",
      style: "gradient",
      tone: "success",
      dismissible: true,
      popupShowDelaySec: 6,
      popupFrequency: "session",
    },
  },
  {
    id: "floating",
    label: "Floating card",
    blurb: "Corner card that sits alongside content. Persistent CTA without blocking the page.",
    emoji: "💬",
    defaults: {
      kind: "floating",
      style: "branded",
      tone: "info",
      dismissible: true,
      floatingPosition: "bottom-right",
    },
  },
  {
    id: "sticky",
    label: "Sticky bottom bar",
    blurb: "Full-width bar pinned to the bottom. Evergreen lead-capture without interruption.",
    emoji: "📣",
    defaults: { kind: "sticky-bar", style: "gradient", tone: "info", dismissible: true },
  },
];

function detectPreset(b: BannerDraft): Preset {
  const k = b.kind ?? "strip";
  if (k === "popup") return "popup";
  if (k === "floating") return "floating";
  if (k === "sticky-bar") return "sticky";
  return (b.style ?? "neutral") === "neutral" ? "classic" : "modern";
}

export function BannerEditor() {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [preset, setPreset] = useState<Preset>("classic");

  useEffect(() => {
    if (settings) {
      setDraft(settings);
      setPreset(detectPreset(settings.banner));
    }
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

  function applyPreset(id: Preset) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPreset(id);
    patch(p.defaults);
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      // Editorial rule: info-toned banners are always permanent.
      const safeDraft: BannerDraft =
        draft.banner.tone === "info" ? { ...draft.banner, dismissible: false } : draft.banner;
      await savePartial({ banner: safeDraft });
      setStatus({ kind: "ok", message: "Banner saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const infoLockedPermanent = b.tone === "info";

  return (
    <div>
      <PageHeader
        title="Site banner & promotions"
        description="Five preset surfaces — pick one, tune it, save. Info-toned banners are kept permanent; warning and success tones can be set dismissible."
      />

      <Card>
        <Toggle
          checked={b.enabled}
          onChange={(v) => patch({ enabled: v })}
          label="Enable site banner / popup"
          description="Master switch. When off, nothing renders regardless of the preset below."
        />
      </Card>

      <Card title="Preset" description="Click a card to load its tuned defaults. You can fine-tune everything afterwards.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((p) => {
            const active = preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-navy-500 bg-navy-50/60 ring-2 ring-navy-500/20 dark:border-navy-400 dark:bg-navy-950/40"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[1.3rem]" aria-hidden="true">
                    {p.emoji}
                  </span>
                  <span
                    className={`text-[0.92rem] font-semibold ${active ? "text-navy-700 dark:text-navy-200" : "text-slate-900 dark:text-slate-100"}`}
                  >
                    {p.label}
                  </span>
                  {active && (
                    <span className="ml-auto rounded-full bg-navy-600 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[0.78rem] leading-[1.5] text-slate-600 dark:text-slate-400">{p.blurb}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Style & tone" description="Visual variant and editorial colour. Tone also drives the permanence rule below.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Visual style">
            <Select value={b.style ?? "neutral"} onChange={(e) => patch({ style: e.target.value as BannerDraft["style"] })}>
              <option value="neutral">Neutral — solid tone, classic minimalist</option>
              <option value="gradient">Gradient — navy → teal sweep</option>
              <option value="apple-glass">Apple glass — frosted blue (premium)</option>
              <option value="glass">Glass (legacy)</option>
              <option value="branded">Branded — solid brand colour</option>
            </Select>
          </Field>
          <Field
            label="Tone"
            hint="Info banners are always permanent (no × button). Warning and success can be dismissible."
          >
            <Select value={b.tone} onChange={(e) => patch({ tone: e.target.value as BannerDraft["tone"] })}>
              <option value="info">Info — navy (informational, permanent)</option>
              <option value="warning">Warning — amber (deadline, alert)</option>
              <option value="success">Success — emerald (campaign, offer)</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card title="Content" description="The headline, body, and primary call-to-action.">
        <div className="space-y-4">
          {(preset === "popup" || preset === "floating" || preset === "sticky") && (
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
          )}
          <Field label="Message / body" hint="Strip = one line. Popup/floating/sticky = up to 2–3 lines.">
            <Textarea
              value={b.message}
              onChange={(e) => patch({ message: e.target.value })}
              placeholder={
                preset === "classic" || preset === "modern"
                  ? "GST annual return deadline — book a consultation before 30 Sept."
                  : "Free 45-minute compliance audit for businesses with 20+ employees."
              }
              maxLength={400}
              rows={preset === "classic" || preset === "modern" ? 2 : 3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary CTA URL">
              <Input value={b.linkUrl} onChange={(e) => patch({ linkUrl: e.target.value })} placeholder="/contact" />
            </Field>
            <Field label="Primary CTA label">
              <Input value={b.linkLabel} onChange={(e) => patch({ linkLabel: e.target.value })} placeholder="Book your free audit" />
            </Field>
          </div>
          {preset === "popup" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Secondary CTA URL" hint="Optional. Empty = single CTA.">
                <Input value={b.popupCtaSecondaryUrl} onChange={(e) => patch({ popupCtaSecondaryUrl: e.target.value })} placeholder="/services" />
              </Field>
              <Field label="Secondary CTA label">
                <Input value={b.popupCtaSecondaryLabel} onChange={(e) => patch({ popupCtaSecondaryLabel: e.target.value })} placeholder="Browse services" maxLength={40} />
              </Field>
            </div>
          )}
        </div>
      </Card>

      {(preset === "popup" || preset === "floating" || preset === "sticky") && (
        <Card title="Timer & frequency" description="Control when and how often the surface appears.">
          <div className="grid gap-4 sm:grid-cols-2">
            {preset === "popup" && (
              <Field label="Show delay (seconds)" hint="How long after page load before the popup opens. Recommended: 4–8.">
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={String(b.popupShowDelaySec ?? 4)}
                  onChange={(e) => patch({ popupShowDelaySec: Math.max(0, Math.min(60, Number(e.target.value) || 0)) })}
                />
              </Field>
            )}
            <Field
              label="Frequency"
              hint="Session = re-shows after browser restart. Once = sticky until storage is cleared. Always = test only."
            >
              <Select
                value={b.popupFrequency ?? "session"}
                onChange={(e) => patch({ popupFrequency: e.target.value as BannerDraft["popupFrequency"] })}
              >
                <option value="session">Once per session (recommended)</option>
                <option value="once">Once per device</option>
                <option value="always">Every page load (test only)</option>
              </Select>
            </Field>
            {preset === "floating" && (
              <Field label="Card position">
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

      <Card title="Dismiss behaviour" description="Whether the visitor can close the banner.">
        <Toggle
          checked={infoLockedPermanent ? false : b.dismissible ?? true}
          onChange={(v) => patch({ dismissible: v })}
          label={infoLockedPermanent ? "Permanent (locked because tone is Info)" : "Allow visitor to dismiss with × button"}
          description={
            infoLockedPermanent
              ? "Info-toned banners stay visible — they carry information visitors should not be able to hide. Switch tone to Warning or Success to enable dismissal."
              : "When on, the banner shows a × close button. Dismissal is remembered per browser session (or device, if Frequency is set to 'Once per device')."
          }
          disabled={infoLockedPermanent}
        />
      </Card>

      <Card
        title="Run multiple banners at once"
        description="Toggle each surface independently. When ANY of these is on, the preset above only edits the currently-selected one — but multiple can run on the public site simultaneously. When all are off, the editor falls back to single-banner mode using the preset above."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            checked={b.enableStrip ?? false}
            onChange={(v) => patch({ enableStrip: v })}
            label="📌 Top strip"
            description="The slim full-width announcement strip."
          />
          <Toggle
            checked={b.enablePopup ?? false}
            onChange={(v) => patch({ enablePopup: v })}
            label="🎯 Popup ad"
            description="Centered modal with timer + frequency."
          />
          <Toggle
            checked={b.enableFloating ?? false}
            onChange={(v) => patch({ enableFloating: v })}
            label="💬 Floating corner card"
            description="Persistent CTA card at the bottom corner."
          />
          <Toggle
            checked={b.enableStickyBar ?? false}
            onChange={(v) => patch({ enableStickyBar: v })}
            label="📣 Sticky bottom bar"
            description="Full-width bar pinned to viewport bottom."
          />
        </div>
      </Card>

      <Card
        title="UI effect for this banner"
        description="Decorative animated overlay. Set to 'Use global setting' to inherit the site-wide effect below — works like inline CSS overriding a stylesheet."
      >
        <Field label="Effect" hint="Each effect maps to a specific marketing moment.">
          <Select value={b.uiEffect ?? "default"} onChange={(e) => patch({ uiEffect: e.target.value as BannerDraft["uiEffect"] })}>
            {UI_EFFECTS.map((eff) => (
              <option key={eff.value} value={eff.value}>
                {eff.label} — {eff.suggestedFor}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card
        title="Global UI effect (site-wide)"
        description="Default for all banners that have effect set to 'Use global setting'. Acts like a stylesheet rule that a per-banner inline override always wins against."
      >
        <Field label="Global effect">
          <Select value={b.globalUiEffect ?? "none"} onChange={(e) => patch({ globalUiEffect: e.target.value as BannerDraft["globalUiEffect"] })}>
            {UI_EFFECTS.filter((eff) => eff.value !== "default").map((eff) => (
              <option key={eff.value} value={eff.value}>
                {eff.label} — {eff.suggestedFor}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card title="Logo & CTA style" description="Brand polish for popup / floating / sticky surfaces.">
        <div className="space-y-4">
          <Toggle
            checked={b.showLogo ?? false}
            onChange={(v) => patch({ showLogo: v })}
            label="Show brand logo inside banner"
            description="Renders the logo you uploaded at /admin/branding in the popup, floating card and sticky bar."
          />
          <Field label="CTA button style" hint="Affects all surfaces. Adapts colours to the chosen visual style. Inspired by hover.dev — hover on each preview to see the animation.">
            <Select value={b.ctaStyle ?? "solid"} onChange={(e) => patch({ ctaStyle: e.target.value as BannerDraft["ctaStyle"] })}>
              <optgroup label="Classic">
                <option value="solid">Solid — classic filled button (default)</option>
                <option value="outline">Outline — border only, fills on hover</option>
                <option value="glow">Glow — solid with brand glow halo</option>
                <option value="pill">Pill — fully rounded, larger touch target</option>
              </optgroup>
              <optgroup label="Animated (hover.dev-inspired)">
                <option value="shimmer">Shimmer — diagonal shine sweep on hover</option>
                <option value="slide">Slide — content + arrow slide right on hover</option>
                <option value="draw-outline">Draw outline — border traces around on hover</option>
                <option value="gradient-shadow">Gradient shadow — brand-colored halo blooms on hover</option>
                <option value="neubrutalism">Neubrutalism — bold offset shadow snaps in</option>
              </optgroup>
            </Select>
          </Field>
          <CtaPreviewRow current={b.ctaStyle ?? "solid"} onPick={(v) => patch({ ctaStyle: v })} />
        </div>
      </Card>

      <Card title="Live preview">
        <BannerPreview banner={b} preset={preset} />
      </Card>

      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={onSave}
        onReset={() => {
          setDraft(settings);
          setPreset(detectPreset(settings.banner));
          setStatus({ kind: "idle" });
        }}
      />
    </div>
  );
}

/* ──────────────────────── live preview ──────────────────────── */

function BannerPreview({ banner, preset }: { banner: BannerDraft; preset: Preset }) {
  const style = banner.style ?? "neutral";
  const tone = banner.tone;
  const message = banner.message || "Your message will appear here…";
  const headline = banner.popupHeadline || "Your headline here";
  const eyebrow = banner.popupEyebrow;
  const showDismiss = (banner.dismissible ?? true) && tone !== "info";

  const stripBg =
    style === "gradient"
      ? "bg-gradient-to-r from-navy-700 via-navy-600 to-teal-500 text-white"
      : style === "glass"
        ? "bg-white/85 text-navy-900 backdrop-blur-xl border border-slate-200"
        : tone === "warning"
          ? "bg-amber-500 text-white"
          : tone === "success"
            ? "bg-emerald-600 text-white"
            : "bg-navy-600 text-white";

  const cardBg =
    style === "gradient"
      ? "bg-gradient-to-br from-navy-700 via-navy-600 to-teal-500 text-white"
      : style === "glass"
        ? "bg-white/90 text-slate-900 backdrop-blur-xl border border-white/40 shadow-xl"
        : style === "branded"
          ? `${tone === "warning" ? "bg-amber-500" : tone === "success" ? "bg-emerald-600" : "bg-navy-700"} text-white`
          : "bg-white text-slate-900 border border-slate-200 shadow";

  if (preset === "classic" || preset === "modern") {
    return (
      <div className={`${stripBg} relative rounded-lg px-4 py-2 text-center text-[0.78rem] sm:text-[0.86rem]`}>
        {message}
        {banner.linkUrl && banner.linkLabel && (
          <a href={banner.linkUrl} className="ml-2 inline-block font-semibold underline opacity-95">
            {banner.linkLabel} →
          </a>
        )}
        {showDismiss && (
          <span className="ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[0.8rem] leading-none opacity-80">
            ×
          </span>
        )}
      </div>
    );
  }

  if (preset === "popup") {
    return (
      <div className="flex justify-center rounded-xl bg-slate-100 px-4 py-8 dark:bg-slate-900">
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl ${cardBg} p-6`}>
          {showDismiss && (
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[0.95rem] leading-none opacity-90">
              ×
            </span>
          )}
          {eyebrow && (
            <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-75">{eyebrow}</div>
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

  if (preset === "floating") {
    return (
      <div className="relative h-52 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
        <div
          className={`absolute bottom-4 ${
            (banner.floatingPosition ?? "bottom-right") === "bottom-left" ? "left-4" : "right-4"
          } w-72 overflow-hidden rounded-xl p-4 ${cardBg}`}
        >
          {showDismiss && (
            <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[0.75rem] leading-none opacity-90">
              ×
            </span>
          )}
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

  // sticky bottom bar
  return (
    <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
      <div className={`absolute inset-x-3 bottom-3 overflow-hidden rounded-xl px-5 py-3 ${cardBg}`}>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] opacity-75">{eyebrow}</div>
            )}
            {headline && <div className="text-[0.95rem] font-bold leading-snug">{headline}</div>}
            {message && <p className="mt-0.5 line-clamp-1 text-[0.78rem] opacity-85">{message}</p>}
          </div>
          {banner.linkLabel && (
            <span
              className={`inline-flex flex-shrink-0 items-center rounded-lg px-3.5 py-1.5 text-[0.78rem] font-semibold ${
                style === "neutral" || style === "glass" ? "bg-navy-600 text-white" : "bg-white text-navy-700"
              }`}
            >
              {banner.linkLabel}
            </span>
          )}
          {showDismiss && (
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[0.9rem] leading-none opacity-90">
              ×
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── CTA preview row ────────────────────────
 * Lets the admin hover-test each animated variant before committing.
 * Click any chip to select it — keeps the dropdown in sync.
 * Uses the same .cta-* classes from globals.css so the previews
 * match the production render exactly.
 */

const CTA_OPTIONS: Array<{ value: BannerDraft["ctaStyle"]; label: string }> = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "glow", label: "Glow" },
  { value: "pill", label: "Pill" },
  { value: "shimmer", label: "Shimmer" },
  { value: "slide", label: "Slide" },
  { value: "draw-outline", label: "Draw outline" },
  { value: "gradient-shadow", label: "Gradient shadow" },
  { value: "neubrutalism", label: "Neubrutalism" },
];

function CtaPreviewRow({
  current,
  onPick,
}: {
  current: BannerDraft["ctaStyle"];
  onPick: (v: BannerDraft["ctaStyle"]) => void;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-[0.78rem] font-medium text-slate-600 dark:text-slate-400">
        Hover any chip to preview the animation — click to select.
      </div>
      <div className="flex flex-wrap gap-2.5">
        {CTA_OPTIONS.map((opt) => {
          const active = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPick(opt.value)}
              className={ctaPreviewClass(opt.value) + (active ? " ring-2 ring-navy-500 ring-offset-2" : "")}
            >
              <CtaPreviewLabel ctaStyle={opt.value} label={opt.label} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ctaPreviewClass(ctaStyle: BannerDraft["ctaStyle"]): string {
  const base =
    "relative inline-flex items-center justify-center font-semibold text-[0.82rem] " +
    "transition-all overflow-hidden " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const radius = ctaStyle === "pill" ? "rounded-full px-5 py-2.5" : "rounded-xl px-4 py-2";
  switch (ctaStyle) {
    case "outline":
      return `${base} ${radius} border-2 border-navy-600 text-navy-700 hover:bg-navy-600 hover:text-white`;
    case "glow":
      return `${base} ${radius} bg-gradient-to-r from-navy-700 to-teal-500 text-white shadow-[0_8px_30px_-5px_rgba(20,184,166,0.55)] hover:shadow-[0_12px_40px_-5px_rgba(20,184,166,0.7)]`;
    case "shimmer":
      return `${base} ${radius} cta-shimmer bg-navy-600 text-white hover:bg-navy-700 shadow-md`;
    case "slide":
      return `${base} ${radius} cta-slide bg-navy-600 text-white hover:bg-navy-700 shadow-md`;
    case "draw-outline":
      return `${base} ${radius} cta-draw-outline text-navy-700 border border-transparent bg-transparent`;
    case "gradient-shadow":
      return `${base} ${radius} cta-gradient-shadow bg-navy-700 text-white z-[1]`;
    case "neubrutalism":
      return `${base} ${radius} cta-neubrutalism bg-white text-navy-700`;
    default:
      return `${base} ${radius} bg-navy-600 text-white hover:bg-navy-700 shadow-md`;
  }
}

function CtaPreviewLabel({
  ctaStyle,
  label,
}: {
  ctaStyle: BannerDraft["ctaStyle"];
  label: string;
}) {
  if (ctaStyle === "shimmer") {
    return (
      <>
        <span className="relative z-[1]">{label}</span>
        <span className="cta-shimmer-overlay" aria-hidden="true" />
      </>
    );
  }
  if (ctaStyle === "slide") {
    return (
      <span className="cta-slide-inner">
        <span>{label}</span>
        <span className="cta-slide-arrow" aria-hidden="true">→</span>
      </span>
    );
  }
  return <>{label}</>;
}
