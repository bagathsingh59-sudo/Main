"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import { SERVICE_ICONS, TEAM_ACCENTS } from "@/services/settings";
import type { ServiceItem, SiteSettings } from "@/services/settings";
import { makeId } from "../../_components/blogUtils";

const MAX_ITEMS = 20;
const MAX_POINTS = 8;

export function ServicesEditor() {
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

  const dirty = JSON.stringify(draft.services) !== JSON.stringify(settings.services);
  const items = draft.services.items;

  function setItems(next: ServiceItem[]) {
    setDraft((d) => (d ? { ...d, services: { ...d.services, items: next } } : d));
    setStatus({ kind: "idle" });
  }
  function update(i: number, patch: Partial<ServiceItem>) {
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }
  function add() {
    if (items.length >= MAX_ITEMS) return;
    setItems([
      ...items,
      {
        id: makeId(),
        icon: "Sparkles",
        title: "New service",
        summary: "",
        points: [],
        accent: TEAM_ACCENTS[0],
      },
    ]);
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ services: draft.services });
      setStatus({ kind: "ok", message: `Saved ${items.length} service${items.length === 1 ? "" : "s"}. Live within ~30 seconds.` });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="The 8-service grid shown on /services and on the homepage preview. Reorder freely — first item is featured first. Empty list = bundled defaults."
      />

      {items.length === 0 ? (
        <Card>
          <p className="mb-4 text-[0.92rem] text-slate-600 dark:text-slate-400">
            No services configured. The public site is using the bundled defaults. Click below to add your first
            editable service.
          </p>
          <button
            type="button"
            onClick={add}
            className="rounded-lg bg-navy-600 px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-navy-700"
          >
            + Start adding services
          </button>
        </Card>
      ) : (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={item.id}>
              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[0.75rem] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Service {i + 1} / {items.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                  <Field label="Title">
                    <Input value={item.title} onChange={(e) => update(i, { title: e.target.value })} />
                  </Field>
                  <Field label="Icon">
                    <Select value={item.icon} onChange={(e) => update(i, { icon: e.target.value as ServiceItem["icon"] })}>
                      {SERVICE_ICONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Summary" hint="1-2 sentences shown on the service card.">
                    <Textarea value={item.summary} onChange={(e) => update(i, { summary: e.target.value })} rows={2} maxLength={400} />
                  </Field>
                </div>
                <div className="mt-4">
                  <PointsEditor value={item.points} onChange={(next) => update(i, { points: next })} />
                </div>
                <div className="mt-4">
                  <Field label="Accent gradient" hint="Brand colour used on the card.">
                    <Select value={item.accent} onChange={(e) => update(i, { accent: e.target.value })}>
                      {TEAM_ACCENTS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && items.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={add}
          className="mt-4 w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-[0.88rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-navy-700 dark:hover:bg-slate-800"
        >
          + Add service ({items.length}/{MAX_ITEMS})
        </button>
      )}

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

function PointsEditor({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  return (
    <Field label="Bullet points" hint={`Up to ${MAX_POINTS}. One-line each.`}>
      <ul className="space-y-2">
        {value.map((p, i) => (
          <li key={i} className="flex gap-2">
            <Input value={p} onChange={(e) => onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))} />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => value.length < MAX_POINTS && onChange([...value, ""])}
        disabled={value.length >= MAX_POINTS}
        className="mt-2 w-full rounded-md border border-dashed border-slate-300 py-1.5 text-[0.78rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-navy-700 dark:hover:bg-slate-800"
      >
        + Add point
      </button>
    </Field>
  );
}
