"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Textarea } from "../../_components/Fields";
import { KeywordEditor } from "../../_components/KeywordEditor";
import { useSettings } from "../../_components/useSettings";
import type { PageSeo, SeoPageKey, SiteSettings } from "@/services/settings";

const PAGE_TABS: Array<{ key: SeoPageKey; label: string; path: string }> = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "services", label: "Services", path: "/services" },
  { key: "industries", label: "Industries", path: "/industries" },
  { key: "insights", label: "Insights", path: "/insights" },
  { key: "contact", label: "Contact", path: "/contact" },
];

export function SeoEditor() {
  const { settings, loading, error, save } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [activeTab, setActiveTab] = useState<SeoPageKey>("home");

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const seo = draft.seo;

  function patchSeo(partial: Partial<SiteSettings["seo"]>) {
    setDraft((d) => (d ? { ...d, seo: { ...d.seo, ...partial } } : d));
    setStatus({ kind: "idle" });
  }
  function patchPage(key: SeoPageKey, partial: Partial<PageSeo>) {
    setDraft((d) => {
      if (!d) return d;
      return {
        ...d,
        seo: {
          ...d.seo,
          pages: { ...d.seo.pages, [key]: { ...d.seo.pages[key], ...partial } },
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
      await save(draft);
      setStatus({ kind: "ok", message: "SEO saved. Search engines pick up changes on next crawl." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const currentPage = seo.pages[activeTab];
  const currentTab = PAGE_TABS.find((t) => t.key === activeTab)!;

  return (
    <div>
      <PageHeader
        title="SEO"
        description="Meta titles, descriptions, keywords and OG images. Used by Google, social previews, and Search Console. Changes deploy in ~30 seconds; search engines re-index over hours to days."
      />

      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[0.85rem] leading-relaxed text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
        <strong className="font-semibold">Tip · Bulk keyword import:</strong> click the{" "}
        <code className="rounded bg-emerald-200/60 px-1 dark:bg-emerald-900/50">+ Bulk add</code> button on any keyword
        field. Paste your list (newlines, commas, or semicolons all work) and apply in one click. Caps: 100 site-wide
        defaults, 50 per page.
      </div>

      <Card
        title="Site-wide defaults"
        description="Used as fallbacks when a page doesn't have its own values."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name" hint="Shown in Open Graph and as a suffix on page titles.">
              <Input value={seo.siteName} onChange={(e) => patchSeo({ siteName: e.target.value })} />
            </Field>
            <Field label="Title template" hint="Use %s as the placeholder for the page-specific title.">
              <Input value={seo.titleTemplate} onChange={(e) => patchSeo({ titleTemplate: e.target.value })} />
            </Field>
          </div>
          <Field
            label="Default description"
            hint="160 chars sweet-spot. Used when a page has no description."
          >
            <Textarea
              value={seo.defaultDescription}
              onChange={(e) => patchSeo({ defaultDescription: e.target.value })}
              maxLength={320}
              rows={2}
            />
          </Field>
          <Field label="Default keywords" hint="Comma-separated or press Enter to add.">
            <KeywordEditor value={seo.defaultKeywords} onChange={(next) => patchSeo({ defaultKeywords: next })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Default OG image URL" hint="1200×630 recommended. Empty = use bundled brand image.">
              <Input
                placeholder="https://…/og.png"
                value={seo.defaultOgImage}
                onChange={(e) => patchSeo({ defaultOgImage: e.target.value })}
              />
            </Field>
            <Field label="Twitter handle" hint="Includes the @ sign.">
              <Input value={seo.twitterHandle} onChange={(e) => patchSeo({ twitterHandle: e.target.value })} />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Per-page SEO"
        description="Override the defaults for specific pages. Pick a page below."
      >
        <div className="-mx-2 mb-5 overflow-x-auto px-2">
          <div className="flex gap-1.5">
            {PAGE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium ${
                  activeTab === t.key ? "bg-navy-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="mb-3 text-[0.78rem] uppercase tracking-[0.12em] text-slate-500">
            Editing · {currentTab.label} ({currentTab.path})
          </div>
          <div className="space-y-4">
            <Field
              label="Page title"
              hint="50-60 chars ideal for Google snippet. Up to 80 saved for OG/social previews."
            >
              <Input
                value={currentPage.title}
                onChange={(e) => patchPage(activeTab, { title: e.target.value })}
                maxLength={80}
              />
            </Field>
            <Field
              label="Meta description"
              hint="120-160 chars ideal for Google snippet. Up to 320 saved (extra used by social cards & rich results)."
            >
              <Textarea
                value={currentPage.description}
                onChange={(e) => patchPage(activeTab, { description: e.target.value })}
                maxLength={320}
                rows={3}
              />
            </Field>
            <Field label="Page-specific keywords" hint="Added to site-wide defaults — page-specific terms only.">
              <KeywordEditor
                value={currentPage.keywords}
                onChange={(next) => patchPage(activeTab, { keywords: next })}
              />
            </Field>
            <Field label="OG image override" hint="Leave empty to use the site default.">
              <Input
                placeholder="https://…/og-services.png"
                value={currentPage.ogImage}
                onChange={(e) => patchPage(activeTab, { ogImage: e.target.value })}
              />
            </Field>
          </div>

          {/* Live preview */}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="text-[0.7rem] uppercase tracking-[0.12em] text-slate-500">Google search preview</div>
            <div className="mt-2 rounded-lg bg-white p-4 shadow-sm">
              <div className="text-[0.75rem] text-emerald-700">
                vaishnaviconsultant.com{currentTab.path}
              </div>
              <div className="mt-0.5 truncate text-[1.05rem] font-medium text-[#1a0dab]">
                {currentPage.title || seo.titleTemplate.replace("%s", "")}
              </div>
              <div className="mt-1 line-clamp-2 text-[0.85rem] text-slate-600">
                {currentPage.description || seo.defaultDescription}
              </div>
            </div>
          </div>
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
