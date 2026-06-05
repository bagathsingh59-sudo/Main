"use client";

import { useEffect, useState } from "react";
import { Card, Input, PageHeader, SaveBar } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { NavLink, SiteSettings } from "@/services/settings";

export function NavbarEditor() {
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
  const links = draft.navigation.navbarLinks;

  function setLinks(next: NavLink[]) {
    setDraft((d) => (d ? { ...d, navigation: { ...d.navigation, navbarLinks: next } } : d));
    setStatus({ kind: "idle" });
  }

  function update(i: number, partial: Partial<NavLink>) {
    setLinks(links.map((l, idx) => (idx === i ? { ...l, ...partial } : l)));
  }
  function remove(i: number) {
    setLinks(links.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const next = links.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setLinks(next);
  }
  function add() {
    setLinks([...links, { label: "New Link", href: "/", visible: true }]);
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await save(draft);
      setStatus({ kind: "ok", message: "Navbar saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Navbar"
        description="Primary navigation across the top of every page. Order here = order on screen. Toggle visibility to hide without deleting."
      />

      <Card>
        <ul className="space-y-3">
          {links.map((link, i) => (
            <li key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto_auto]">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => update(i, { label: e.target.value })}
                />
                <Input
                  placeholder="/services"
                  value={link.href}
                  onChange={(e) => update(i, { href: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => update(i, { visible: !link.visible })}
                  className={`rounded-lg px-3 py-2 text-[0.8rem] font-medium ${
                    link.visible ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                  title={link.visible ? "Click to hide" : "Click to show"}
                >
                  {link.visible ? "Visible" : "Hidden"}
                </button>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === links.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={add}
          disabled={links.length >= 8}
          className="mt-4 w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-2.5 text-[0.85rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 disabled:opacity-40"
        >
          + Add nav link {links.length >= 8 && "(max 8 reached)"}
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
