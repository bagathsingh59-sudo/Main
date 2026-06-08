"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import { UiEffectOverlay, type UiEffectKind } from "@/components/shared/UiEffectOverlay";
import type { BannerKindConfig, SiteSettings } from "@/services/settings";

type BannerDraft = SiteSettings["banner"];
type SurfaceKey = "strip" | "popup" | "floating" | "stickyBar";
type Step = 1 | 2;

/* ──────────────────────── surface catalog ──────────────────────── */

const SURFACES: Array<{
  key: SurfaceKey;
  label: string;
  blurb: string;
  emoji: string;
}> = [
  {
    key: "strip",
    label: "Top strip",
    blurb: "Slim one-line announcement across the top of every page. Best for permanent notices and quick updates.",
    emoji: "📌",
  },
  {
    key: "popup",
    label: "Popup ad",
    blurb: "Centered modal with timer + frequency control. Best for lead capture and time-sensitive offers.",
    emoji: "🎯",
  },
  {
    key: "floating",
    label: "Floating card",
    blurb: "Corner card that sits alongside content. Persistent CTA without blocking the page.",
    emoji: "💬",
  },
  {
    key: "stickyBar",
    label: "Sticky bottom bar",
    blurb: "Full-width bar pinned to the bottom of the viewport. Evergreen lead-capture.",
    emoji: "📣",
  },
];

const UI_EFFECTS: Array<{ value: string; label: string; suggestedFor: string }> = [
  { value: "none", label: "None", suggestedFor: "Quiet, no overlay" },
  { value: "confetti", label: "🎉 Confetti", suggestedFor: "Milestones, launches" },
  { value: "sparkle", label: "✨ Sparkle", suggestedFor: "Premium feel, testimonials" },
  { value: "glitter-anniversary", label: "🥇 Glitter — anniversary", suggestedFor: "Site / brand anniversary" },
  { value: "snow-holiday", label: "❄ Snow — holiday", suggestedFor: "Dec / New Year" },
  { value: "fireworks-launch", label: "🎆 Fireworks", suggestedFor: "Launches, Independence/Republic Day" },
  { value: "shimmer-premium", label: "💎 Shimmer — premium", suggestedFor: "Luxury offers, VIP audit" },
  { value: "floating-icons", label: "🪔 Floating icons", suggestedFor: "Diwali, Eid, festival campaigns" },
  { value: "glow-pulse-urgent", label: "🚨 Glow pulse — urgent", suggestedFor: "Deadline reminders, last-day offers" },
  { value: "coupon-burst-sale", label: "🏷 Coupon burst — sale", suggestedFor: "Discount campaigns, sale events" },
  { value: "ribbons-celebration", label: "🎀 Ribbons — celebration", suggestedFor: "Graduations, year-end wraps" },
];

/* ──────────────────────── editor ──────────────────────── */

export function BannerEditor() {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [step, setStep] = useState<Step>(1);
  const [selectedSurface, setSelectedSurface] = useState<SurfaceKey>("strip");

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const dirty = JSON.stringify(draft.banner) !== JSON.stringify(settings.banner);
  const cfg = draft.banner[selectedSurface];

  function patch(partial: Partial<BannerKindConfig>) {
    setDraft((d) => {
      if (!d) return d;
      return {
        ...d,
        banner: {
          ...d.banner,
          [selectedSurface]: { ...d.banner[selectedSurface], ...partial },
        },
      };
    });
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      // Editorial rule: info-toned configs are always permanent.
      const safe: BannerDraft = (Object.keys(draft.banner) as Array<keyof BannerDraft>).reduce(
        (acc, key) => {
          const v = draft.banner[key] as unknown;
          if (v && typeof v === "object" && "tone" in v && "dismissible" in v) {
            const c = v as BannerKindConfig;
            // @ts-expect-error — narrow at runtime
            acc[key] = c.tone === "info" ? { ...c, dismissible: false } : c;
          } else {
            // @ts-expect-error — leave legacy flat fields alone
            acc[key] = v;
          }
          return acc;
        },
        { ...draft.banner } as BannerDraft,
      );
      await savePartial({ banner: safe });
      setStatus({ kind: "ok", message: "Banner saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const activeSurface = SURFACES.find((s) => s.key === selectedSurface);

  return (
    <div>
      <PageHeader
        title="Site banners"
        description="Four independent banner surfaces. Edit each one separately — they don't share any settings."
      />

      <StepIndicator step={step} />

      {step === 1 ? (
        <StepOnePickSurface
          surfaces={SURFACES}
          configs={draft.banner}
          selected={selectedSurface}
          onSelect={setSelectedSurface}
          onNext={() => setStep(2)}
        />
      ) : (
        <StepTwoConfigure
          surface={activeSurface!}
          config={cfg}
          brandingLogoUrl={draft.branding.logoUrl}
          patch={patch}
          onBack={() => setStep(1)}
        />
      )}

      {step === 2 && (
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
      )}
    </div>
  );
}

/* ──────────────────────── step indicator ──────────────────────── */

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <StepDot n={1} label="Pick a banner" active={step === 1} done={step > 1} />
      <div className={`h-px flex-1 ${step > 1 ? "bg-navy-500" : "bg-slate-200 dark:bg-slate-700"}`} />
      <StepDot n={2} label="Configure" active={step === 2} done={false} />
    </div>
  );
}

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.78rem] font-bold transition ${
          done
            ? "bg-navy-600 text-white"
            : active
              ? "bg-navy-600 text-white ring-4 ring-navy-500/20"
              : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span
        className={`text-[0.85rem] font-medium ${
          active || done ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ──────────────────────── step 1 — pick surface ──────────────────────── */

function StepOnePickSurface({
  surfaces,
  configs,
  selected,
  onSelect,
  onNext,
}: {
  surfaces: typeof SURFACES;
  configs: BannerDraft;
  selected: SurfaceKey;
  onSelect: (key: SurfaceKey) => void;
  onNext: () => void;
}) {
  return (
    <Card
      title="Step 1 · Pick a banner to edit"
      description="Each banner has its own settings. Toggle individual ones on or off when you edit them — they never share state."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {surfaces.map((s) => {
          const cfg = configs[s.key];
          const isOn = cfg.enabled && cfg.message.trim().length > 0;
          const active = selected === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.key)}
              className={`group flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition ${
                active
                  ? "border-navy-500 bg-navy-50/60 ring-4 ring-navy-500/15 dark:border-navy-400 dark:bg-navy-950/40"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              }`}
            >
              <div className="flex w-full items-center gap-2">
                <span className="text-[1.4rem]" aria-hidden="true">
                  {s.emoji}
                </span>
                <span
                  className={`text-[0.95rem] font-semibold ${
                    active ? "text-navy-700 dark:text-navy-200" : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${
                    isOn
                      ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-200"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isOn ? "Live" : "Off"}
                </span>
              </div>
              <p className="text-[0.8rem] leading-[1.55] text-slate-600 dark:text-slate-400">{s.blurb}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-navy-600 px-5 py-2.5 text-[0.88rem] font-semibold text-white hover:bg-navy-700"
        >
          Next: configure →
        </button>
      </div>
    </Card>
  );
}

/* ──────────────────────── step 2 — configure surface ──────────────────────── */

function StepTwoConfigure({
  surface,
  config,
  brandingLogoUrl,
  patch,
  onBack,
}: {
  surface: (typeof SURFACES)[number];
  config: BannerKindConfig;
  brandingLogoUrl: string;
  patch: (p: Partial<BannerKindConfig>) => void;
  onBack: () => void;
}) {
  const isStrip = surface.key === "strip";
  const isPopup = surface.key === "popup";
  const isFloating = surface.key === "floating";
  const isSticky = surface.key === "stickyBar";
  const isCardSurface = isPopup || isFloating || isSticky;
  const infoLocked = config.tone === "info";

  return (
    <>
      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-[0.88rem]">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[0.78rem] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            ← Pick a different banner
          </button>
          <span className="text-slate-500 dark:text-slate-400">Editing:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {surface.emoji} {surface.label}
          </span>
        </div>
      </div>

      <Card>
        <Toggle
          checked={config.enabled}
          onChange={(v) => patch({ enabled: v })}
          label={`Turn ${surface.label.toLowerCase()} on`}
          description="Independent of the other three banners. Turn off any time to hide this surface without losing its content."
        />
      </Card>

      <Card title="Look & tone" description="Visual style and editorial colour for this banner only.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Visual style">
            <Select value={config.style} onChange={(e) => patch({ style: e.target.value as BannerKindConfig["style"] })}>
              <option value="neutral">Neutral — classic minimalist</option>
              <option value="gradient">Gradient — navy → teal sweep</option>
              <option value="apple-glass">Apple glass — true frosted glass</option>
              <option value="branded">Branded — solid brand colour</option>
            </Select>
          </Field>
          <Field label="Tone" hint="Info banners stay permanent (no × button). Warning and success can be dismissible.">
            <Select value={config.tone} onChange={(e) => patch({ tone: e.target.value as BannerKindConfig["tone"] })}>
              <option value="info">Info — navy (permanent)</option>
              <option value="warning">Warning — amber (deadline, alert)</option>
              <option value="success">Success — emerald (campaign, offer)</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card title="Content" description="What visitors actually see.">
        <div className="space-y-4">
          {isCardSurface && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" hint="Small uppercase label above the headline.">
                <Input
                  value={config.eyebrow}
                  onChange={(e) => patch({ eyebrow: e.target.value })}
                  placeholder="Free audit"
                  maxLength={40}
                />
              </Field>
              <Field label="Headline" hint="One short, bold sentence.">
                <Input
                  value={config.headline}
                  onChange={(e) => patch({ headline: e.target.value })}
                  placeholder="Save ₹3-4 lakh in EPF penalties this year"
                  maxLength={80}
                />
              </Field>
            </div>
          )}
          <Field label={isStrip ? "Message" : "Body"} hint={isStrip ? "Keep it under one line on mobile." : "Up to 2-3 lines."}>
            <Textarea
              value={config.message}
              onChange={(e) => patch({ message: e.target.value })}
              placeholder={
                isStrip
                  ? "GST annual return deadline — book a consultation before 30 Sept."
                  : "Free 45-minute compliance audit for businesses with 20+ employees."
              }
              maxLength={400}
              rows={isStrip ? 2 : 3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button URL">
              <Input value={config.linkUrl} onChange={(e) => patch({ linkUrl: e.target.value })} placeholder="/contact" />
            </Field>
            <Field label="Button label">
              <Input value={config.linkLabel} onChange={(e) => patch({ linkLabel: e.target.value })} placeholder="Book your free audit" />
            </Field>
          </div>
          {isPopup && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Second button URL (optional)">
                <Input
                  value={config.secondaryUrl}
                  onChange={(e) => patch({ secondaryUrl: e.target.value })}
                  placeholder="/services"
                />
              </Field>
              <Field label="Second button label">
                <Input
                  value={config.secondaryLabel}
                  onChange={(e) => patch({ secondaryLabel: e.target.value })}
                  placeholder="Browse services"
                  maxLength={40}
                />
              </Field>
            </div>
          )}
        </div>
      </Card>

      {isCardSurface && (
        <Card title="Timing" description="When and how often this surface appears.">
          <div className="grid gap-4 sm:grid-cols-2">
            {isPopup && (
              <Field label="Show after (seconds)" hint="0 = immediately. Recommended: 4-8 seconds.">
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={String(config.showDelaySec)}
                  onChange={(e) => patch({ showDelaySec: Math.max(0, Math.min(60, Number(e.target.value) || 0)) })}
                />
              </Field>
            )}
            <Field label="How often it appears">
              <Select
                value={config.frequency}
                onChange={(e) => patch({ frequency: e.target.value as BannerKindConfig["frequency"] })}
              >
                <option value="session">Once per session (recommended)</option>
                <option value="once">Once per device</option>
                <option value="always">Every page load (test only)</option>
              </Select>
            </Field>
            {isFloating && (
              <Field label="Card position">
                <Select
                  value={config.floatingPosition}
                  onChange={(e) => patch({ floatingPosition: e.target.value as BannerKindConfig["floatingPosition"] })}
                >
                  <option value="bottom-right">Bottom right (default)</option>
                  <option value="bottom-left">Bottom left</option>
                </Select>
              </Field>
            )}
          </div>
        </Card>
      )}

      <Card title="Dismiss" description="Whether visitors can close this banner.">
        <Toggle
          checked={infoLocked ? false : config.dismissible}
          onChange={(v) => patch({ dismissible: v })}
          label={infoLocked ? "Permanent (locked because tone is Info)" : "Show × close button"}
          description={
            infoLocked
              ? "Info banners stay visible. Switch tone to Warning or Success to enable dismissal."
              : "Dismissal is remembered per browser session (or per device, depending on Frequency)."
          }
          disabled={infoLocked}
        />
      </Card>

      <Card title="Visual effect (optional)" description="Decorative animated overlay matched to a marketing moment.">
        <Field label="Effect">
          <Select value={config.uiEffect} onChange={(e) => patch({ uiEffect: e.target.value as BannerKindConfig["uiEffect"] })}>
            {UI_EFFECTS.map((eff) => (
              <option key={eff.value} value={eff.value}>
                {eff.label} — {eff.suggestedFor}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card title="Polish" description="Brand logo inside the banner and the button style — set independently for each banner.">
        <div className="space-y-4">
          <Toggle
            checked={config.showLogo}
            onChange={(v) => patch({ showLogo: v })}
            label="Show brand logo inside this banner"
            description={isStrip ? "Not rendered on the strip — only popup, floating and sticky surfaces show the logo." : "Pulls the logo from /admin/branding."}
          />
          <Field label="Button style" hint="Hover any chip below to preview the animation. Click to select.">
            <Select value={config.ctaStyle} onChange={(e) => patch({ ctaStyle: e.target.value as BannerKindConfig["ctaStyle"] })}>
              <optgroup label="Classic">
                <option value="solid">Solid — classic filled button</option>
                <option value="outline">Outline — border only, fills on hover</option>
                <option value="glow">Glow — solid with brand glow halo</option>
                <option value="pill">Pill — fully rounded, larger touch target</option>
              </optgroup>
              <optgroup label="Animated">
                <option value="shimmer">Shimmer — diagonal shine sweep</option>
                <option value="slide">Slide — content + arrow drift right</option>
                <option value="draw-outline">Draw outline — border traces around</option>
                <option value="gradient-shadow">Gradient shadow — brand halo blooms</option>
                <option value="neubrutalism">Neubrutalism — bold offset shadow</option>
              </optgroup>
            </Select>
          </Field>
          <CtaPreviewRow current={config.ctaStyle} onPick={(v) => patch({ ctaStyle: v })} />
        </div>
      </Card>

      <Card title="Live preview" description="Reflects every change immediately — including button style, UI effect, logo and dismiss button.">
        <BannerPreview surface={surface.key} config={config} brandingLogoUrl={brandingLogoUrl} />
      </Card>
    </>
  );
}

/* ──────────────────────── live preview ──────────────────────── */

/**
 * Mirrors the production banner render — every prop visible in the
 * editor is reflected here in real time: visual style, tone, dismiss
 * button, UI effect overlay, logo, and the chosen CTA button variant
 * (including its hover animation).
 *
 * The backdrop behind the preview is a busy gradient + mock-text mosaic
 * so the apple-glass surface actually frosts something visible —
 * otherwise glassmorphism looks flat with nothing behind it.
 */
function BannerPreview({
  surface,
  config,
  brandingLogoUrl,
}: {
  surface: SurfaceKey;
  config: BannerKindConfig;
  brandingLogoUrl: string;
}) {
  const style = config.style;
  const tone = config.tone;
  const message = config.message || "Your message will appear here…";
  const headline = config.headline || "Your headline here";
  const eyebrow = config.eyebrow;
  const showDismiss = config.dismissible && tone !== "info";
  const logoUrl = config.showLogo && brandingLogoUrl ? brandingLogoUrl : "";
  const light = style === "neutral" || style === "apple-glass";
  const uiEffect = (config.uiEffect ?? "none") as UiEffectKind;
  const ctaCls = previewCtaClass(style, config.ctaStyle, true);
  const ctaCls2 = previewCtaClass(style, config.ctaStyle, false);

  const stripBg =
    style === "gradient"
      ? "bg-gradient-to-r from-navy-700 via-navy-600 to-teal-500 text-white"
      : style === "apple-glass"
        ? "bg-[rgba(219,234,254,0.35)] text-navy-900 backdrop-blur-3xl backdrop-saturate-200 border border-white/40 ring-1 ring-inset ring-white/40"
        : tone === "warning"
          ? "bg-amber-500 text-white"
          : tone === "success"
            ? "bg-emerald-600 text-white"
            : "bg-navy-600 text-white";

  const cardBg =
    style === "gradient"
      ? "bg-gradient-to-br from-navy-700 via-navy-600 to-teal-500 text-white"
      : style === "apple-glass"
        ? "bg-[rgba(219,234,254,0.35)] text-slate-900 backdrop-blur-3xl backdrop-saturate-200 ring-1 ring-inset ring-white/40 shadow-2xl"
        : style === "branded"
          ? `${tone === "warning" ? "bg-amber-500" : tone === "success" ? "bg-emerald-600" : "bg-navy-700"} text-white`
          : "bg-white text-slate-900 border border-slate-200 shadow";

  /* ───── strip ───── */
  if (surface === "strip") {
    return (
      <div className="relative overflow-hidden rounded-xl">
        <PreviewBackdrop />
        <div className={`${stripBg} relative z-[1] flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-[0.78rem] sm:text-[0.86rem]`}>
          <span className="font-medium">{message}</span>
          {config.linkUrl && config.linkLabel && (
            <a href={config.linkUrl} className="font-semibold underline whitespace-nowrap opacity-95">
              {config.linkLabel} →
            </a>
          )}
          {showDismiss && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[0.8rem] leading-none opacity-80">
              ×
            </span>
          )}
        </div>
      </div>
    );
  }

  /* ───── popup ───── */
  if (surface === "popup") {
    return (
      <div className="relative flex justify-center overflow-hidden rounded-xl px-4 py-8 min-h-[320px]">
        <PreviewBackdrop />
        <div className={`relative z-[1] w-full max-w-md overflow-hidden rounded-2xl ${cardBg} p-6`}>
          <UiEffectOverlay effect={uiEffect} surface={light ? "light" : "dark"} />
          {showDismiss && (
            <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-[0.95rem] leading-none opacity-90">
              ×
            </span>
          )}
          <div className="relative z-[1]">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="mb-3 h-8 w-auto" />
            )}
            {eyebrow && (
              <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-75">{eyebrow}</div>
            )}
            <div className="mb-2 text-[1.2rem] font-bold leading-tight">{headline}</div>
            <p className="mb-4 text-[0.88rem] opacity-85">{message}</p>
            <div className="flex flex-wrap gap-2">
              {config.linkLabel && (
                <span className={ctaCls}>
                  <CtaPreviewLabel ctaStyle={config.ctaStyle} label={config.linkLabel} />
                </span>
              )}
              {config.secondaryLabel && <span className={ctaCls2}>{config.secondaryLabel}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───── floating ───── */
  if (surface === "floating") {
    return (
      <div className="relative h-56 overflow-hidden rounded-xl">
        <PreviewBackdrop />
        <div
          className={`absolute bottom-4 z-[1] ${
            config.floatingPosition === "bottom-left" ? "left-4" : "right-4"
          } w-72 overflow-hidden rounded-xl ${cardBg}`}
        >
          <UiEffectOverlay effect={uiEffect} surface={light ? "light" : "dark"} />
          {showDismiss && (
            <span className="absolute right-2.5 top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[0.75rem] leading-none opacity-90">
              ×
            </span>
          )}
          <div className="relative z-[1] p-4">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="mb-2 h-6 w-auto" />
            )}
            {eyebrow && <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] opacity-75">{eyebrow}</div>}
            <div className="mb-1 text-[0.95rem] font-bold leading-snug">{headline}</div>
            <p className="mb-3 text-[0.78rem] opacity-85">{message}</p>
            {config.linkLabel && (
              <span className={ctaCls}>
                <CtaPreviewLabel ctaStyle={config.ctaStyle} label={config.linkLabel} />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ───── sticky bar ───── */
  return (
    <div className="relative h-48 overflow-hidden rounded-xl">
      <PreviewBackdrop />
      <div className={`absolute inset-x-3 bottom-3 z-[1] overflow-hidden rounded-xl ${cardBg}`}>
        <UiEffectOverlay effect={uiEffect} surface={light ? "light" : "dark"} />
        <div className="relative z-[1] flex items-center gap-3 px-5 py-3 sm:gap-5">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-7 w-auto flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            {eyebrow && <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] opacity-75">{eyebrow}</div>}
            {headline && <div className="text-[0.95rem] font-bold leading-snug">{headline}</div>}
            {message && <p className="mt-0.5 line-clamp-1 text-[0.78rem] opacity-85">{message}</p>}
          </div>
          {config.linkLabel && (
            <span className={ctaCls}>
              <CtaPreviewLabel ctaStyle={config.ctaStyle} label={config.linkLabel} />
            </span>
          )}
          {showDismiss && (
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/25 text-[0.9rem] leading-none opacity-90">
              ×
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Visual backdrop behind every preview — required so apple-glass
 * actually has something to frost. Imitates the homepage hero with
 * navy gradient + soft brand orbs + mock body text.
 */
function PreviewBackdrop() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-100 via-white to-teal-100/70 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute -top-20 -left-10 h-56 w-56 rounded-full bg-navy-300/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-teal-300/40 blur-3xl" />
      <div className="absolute inset-0 grid grid-rows-6 gap-2 p-4 text-navy-900/40 dark:text-slate-200/30">
        <div className="h-2 w-3/4 rounded bg-current" />
        <div className="h-2 w-2/3 rounded bg-current" />
        <div className="h-2 w-1/2 rounded bg-current" />
        <div className="h-2 w-3/4 rounded bg-current" />
        <div className="h-2 w-2/3 rounded bg-current" />
        <div className="h-2 w-1/3 rounded bg-current" />
      </div>
    </div>
  );
}

/**
 * Preview-only version of the production ctaClass — kept inline so the
 * preview doesn't import client-only SitePromo internals. Matches the
 * production output for every variant.
 */
function previewCtaClass(style: BannerKindConfig["style"], ctaStyle: BannerKindConfig["ctaStyle"], primary: boolean): string {
  const light = style === "neutral" || style === "apple-glass";
  const base =
    "relative inline-flex items-center justify-center font-semibold transition-all overflow-hidden text-[0.82rem] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const radius = ctaStyle === "pill" ? "rounded-full px-5 py-2.5" : "rounded-xl px-4 py-2";
  if (!primary) {
    return `${base} ${radius} ${light ? "border border-slate-300 text-slate-700" : "border border-white/40 text-white"}`;
  }
  switch (ctaStyle) {
    case "outline":
      return `${base} ${radius} ${
        light
          ? "border-2 border-navy-600 text-navy-700 hover:bg-navy-600 hover:text-white"
          : "border-2 border-white text-white hover:bg-white hover:text-navy-700"
      }`;
    case "glow":
      return `${base} ${radius} ${
        light
          ? "bg-gradient-to-r from-navy-700 to-teal-500 text-white shadow-[0_8px_30px_-5px_rgba(20,184,166,0.55)] hover:shadow-[0_12px_40px_-5px_rgba(20,184,166,0.7)]"
          : "bg-white text-navy-700 shadow-[0_8px_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_40px_-5px_rgba(255,255,255,0.55)]"
      }`;
    case "shimmer":
      return `${base} ${radius} cta-shimmer ${light ? "bg-navy-600 text-white" : "bg-white text-navy-700"} shadow-md`;
    case "slide":
      return `${base} ${radius} cta-slide ${light ? "bg-navy-600 text-white" : "bg-white text-navy-700"} shadow-md`;
    case "draw-outline":
      return `${base} ${radius} cta-draw-outline ${light ? "text-navy-700" : "text-white"} border border-transparent bg-transparent`;
    case "gradient-shadow":
      return `${base} ${radius} cta-gradient-shadow ${light ? "bg-navy-700 text-white" : "bg-white text-navy-700"} z-[1]`;
    case "neubrutalism":
      return `${base} ${radius} cta-neubrutalism ${light ? "bg-white text-navy-700" : "bg-navy-700 text-white"}`;
    default:
      return `${base} ${radius} ${light ? "bg-navy-600 text-white" : "bg-white text-navy-700"} shadow-md`;
  }
}

/* ──────────────────────── CTA preview row ──────────────────────── */

const CTA_OPTIONS: Array<{ value: BannerKindConfig["ctaStyle"]; label: string }> = [
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
  current: BannerKindConfig["ctaStyle"];
  onPick: (v: BannerKindConfig["ctaStyle"]) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 text-[0.76rem] font-medium text-slate-600 dark:text-slate-400">
        Hover any chip to preview. Click to select.
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

function ctaPreviewClass(ctaStyle: BannerKindConfig["ctaStyle"]): string {
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
  ctaStyle: BannerKindConfig["ctaStyle"];
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
