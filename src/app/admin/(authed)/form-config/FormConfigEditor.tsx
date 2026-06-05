"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function FormConfigEditor() {
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
  const fc = draft.formConfig;

  function setList(field: "services" | "sizes", next: string[]) {
    setDraft((d) => (d ? { ...d, formConfig: { ...d.formConfig, [field]: next } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await save(draft);
      setStatus({ kind: "ok", message: "Form options saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Form options"
        description="The dropdown choices visible in the contact form on /contact."
      />

      <ListEditor
        title="Services"
        description="Shown in the 'Service needed' dropdown. Order matters — first item is the default."
        items={fc.services}
        onChange={(next) => setList("services", next)}
        addPlaceholder="e.g. ROC compliance"
      />

      <ListEditor
        title="Company size brackets"
        description="Shown in the 'Company size' dropdown."
        items={fc.sizes}
        onChange={(next) => setList("sizes", next)}
        addPlaceholder="e.g. 500+"
      />

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

function ListEditor({
  title,
  description,
  items,
  onChange,
  addPlaceholder,
}: {
  title: string;
  description: string;
  items: string[];
  onChange: (next: string[]) => void;
  addPlaceholder: string;
}) {
  const [draft, setDraft] = useState("");

  function update(i: number, value: string) {
    onChange(items.map((it, idx) => (idx === i ? value : it)));
  }
  function remove(i: number) {
    if (items.length <= 1) return; // schema requires min 1
    onChange(items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    if (!draft.trim()) return;
    onChange([...items, draft.trim()]);
    setDraft("");
  }

  return (
    <Card title={title} description={description}>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-6 text-right text-[0.78rem] font-semibold text-slate-400">{i + 1}.</span>
            <Input value={item} onChange={(e) => update(i, e.target.value)} />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30"
              title="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30"
              title="Move down"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={items.length <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-30"
              title="Remove"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <Input
          placeholder={addPlaceholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="rounded-lg bg-navy-600 px-4 text-[0.85rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </Card>
  );
}
