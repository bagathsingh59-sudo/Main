"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Textarea } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { FooterColumn, NavLink, SiteSettings, SocialLink } from "@/services/settings";

const PLATFORMS: SocialLink["platform"][] = ["linkedin", "twitter", "instagram", "youtube", "facebook"];

export function FooterEditor() {
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
  const nav = draft.navigation;

  function patchNav(partial: Partial<SiteSettings["navigation"]>) {
    setDraft((d) => (d ? { ...d, navigation: { ...d.navigation, ...partial } } : d));
    setStatus({ kind: "idle" });
  }
  function patchColumn(idx: number, partial: Partial<FooterColumn>) {
    patchNav({
      footerColumns: nav.footerColumns.map((c, i) => (i === idx ? { ...c, ...partial } : c)),
    });
  }
  function patchColumnLinks(idx: number, links: NavLink[]) {
    patchColumn(idx, { links });
  }
  function patchSocial(idx: number, partial: Partial<SocialLink>) {
    patchNav({
      socialLinks: nav.socialLinks.map((s, i) => (i === idx ? { ...s, ...partial } : s)),
    });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ navigation: draft.navigation });
      setStatus({ kind: "ok", message: "Footer saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Footer"
        description="Footer columns, tagline, copyright, and social links. Columns appear left-to-right on desktop; stack on mobile."
      />

      <Card title="Tagline & copyright">
        <div className="space-y-4">
          <Field label="Footer tagline" hint="Short blurb under the company logo in the footer.">
            <Textarea
              value={nav.footerTagline}
              onChange={(e) => patchNav({ footerTagline: e.target.value })}
              maxLength={160}
              rows={2}
            />
          </Field>
          <Field label="Copyright line">
            <Input value={nav.copyright} onChange={(e) => patchNav({ copyright: e.target.value })} />
          </Field>
        </div>
      </Card>

      {nav.footerColumns.map((col, idx) => (
        <Card
          key={idx}
          title={`Column ${idx + 1}: ${col.title}`}
          description={`${col.links.length} link${col.links.length === 1 ? "" : "s"}`}
        >
          <Field label="Column title">
            <Input value={col.title} onChange={(e) => patchColumn(idx, { title: e.target.value })} />
          </Field>
          <div className="mt-4 space-y-2">
            {col.links.map((link, li) => (
              <div key={li} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto_auto]">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) =>
                    patchColumnLinks(idx, col.links.map((l, i) => (i === li ? { ...l, label: e.target.value } : l)))
                  }
                />
                <Input
                  placeholder="/path"
                  value={link.href}
                  onChange={(e) =>
                    patchColumnLinks(idx, col.links.map((l, i) => (i === li ? { ...l, href: e.target.value } : l)))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    patchColumnLinks(
                      idx,
                      col.links.map((l, i) => (i === li ? { ...l, visible: !l.visible } : l)),
                    )
                  }
                  className={`rounded-lg px-2.5 py-2 text-[0.75rem] font-medium ${
                    link.visible ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {link.visible ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => patchColumnLinks(idx, col.links.filter((_, i) => i !== li))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => patchColumnLinks(idx, [...col.links, { label: "New link", href: "/", visible: true }])}
              disabled={col.links.length >= 10}
              className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-[0.82rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 disabled:opacity-40"
            >
              + Add link
            </button>
          </div>
        </Card>
      ))}

      <Card title="Social links" description="Footer social icons. Empty URLs are hidden.">
        <ul className="space-y-2">
          {nav.socialLinks.map((s, i) => (
            <li key={i} className="grid gap-2 sm:grid-cols-[140px_1fr_auto]">
              <select
                value={s.platform}
                onChange={(e) => patchSocial(i, { platform: e.target.value as SocialLink["platform"] })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.88rem] capitalize text-slate-900"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <Input
                placeholder="https://…"
                value={s.url}
                onChange={(e) => patchSocial(i, { url: e.target.value })}
              />
              <button
                type="button"
                onClick={() => patchNav({ socialLinks: nav.socialLinks.filter((_, idx) => idx !== i) })}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            patchNav({
              socialLinks: [...nav.socialLinks, { platform: "linkedin", url: "" }],
            })
          }
          disabled={nav.socialLinks.length >= 8}
          className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2 text-[0.82rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 disabled:opacity-40"
        >
          + Add social link
        </button>
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
