"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Textarea } from "../../_components/Fields";
import { ImageUpload } from "../../_components/ImageUpload";
import { useSettings } from "../../_components/useSettings";
import { TEAM_ACCENTS } from "@/services/settings";
import type { FounderSettings, SiteSettings } from "@/services/settings";

export function FounderEditor() {
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

  const dirty = JSON.stringify(draft.founder) !== JSON.stringify(settings.founder);
  const f = draft.founder;

  function patch(partial: Partial<FounderSettings>) {
    setDraft((d) => (d ? { ...d, founder: { ...d.founder, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ founder: draft.founder });
      setStatus({ kind: "ok", message: "Founder profile saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Founder"
        description="The 'A note from the founder' card on /about. When fields are empty, the page falls back to the first member of the Team list."
      />

      <Card title="Photo" description="Square portrait recommended (~480×480). Falls back to initials avatar if empty.">
        <ImageUpload
          purpose="founder"
          value={f.image}
          onChange={(url) => patch({ image: url })}
          hint="PNG or JPEG, up to 2 MB. Used at 128px circular crop."
          aspect="square"
        />
      </Card>

      <Card title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input value={f.name} onChange={(e) => patch({ name: e.target.value })} placeholder="CA Lakshmi Narayan" />
          </Field>
          <Field label="Role / title">
            <Input value={f.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Founder & Managing Partner" />
          </Field>
          <Field label="Initials" hint="2–4 letters. Shown only when no photo is uploaded.">
            <Input value={f.initials} onChange={(e) => patch({ initials: e.target.value.slice(0, 4).toUpperCase() })} placeholder="LN" />
          </Field>
          <Field label="Accent gradient" hint="Brand colour used behind the initials avatar.">
            <select
              value={f.accent}
              onChange={(e) => patch({ accent: e.target.value })}
              className="block h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[0.92rem] text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {TEAM_ACCENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Message" description="The pull quote sets the tone; paragraphs are the body of the founder's note.">
        <Field
          label="Pull quote"
          hint="Shown in display font at the top. Wrap an emphasised phrase in *asterisks* — it'll render in brand colour."
        >
          <Textarea
            value={f.quote}
            onChange={(e) => patch({ quote: e.target.value })}
            rows={3}
            maxLength={280}
            placeholder={`"Compliance is not paperwork. *It is the operating system of trust.*"`}
          />
        </Field>
        <div className="mt-4">
          <ParagraphsEditor value={f.paragraphs} onChange={(next) => patch({ paragraphs: next })} />
        </div>
      </Card>

      <Card title="Stats & signature">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Experience chip" hint="Top stat e.g. '24+ yrs'. Empty hides the chip.">
            <Input value={f.experienceStat} onChange={(e) => patch({ experienceStat: e.target.value })} />
          </Field>
          <Field label="Qualification chip" hint="e.g. 'FCA'.">
            <Input value={f.qualificationStat} onChange={(e) => patch({ qualificationStat: e.target.value })} />
          </Field>
          <Field label="Signature line" hint="Appears below the body. Defaults to the name if empty.">
            <Input value={f.signatureLabel} onChange={(e) => patch({ signatureLabel: e.target.value })} placeholder="CA Lakshmi Narayan, Founder" />
          </Field>
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

function ParagraphsEditor({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  function update(i: number, text: string) {
    onChange(value.map((p, idx) => (idx === i ? text : p)));
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    if (value.length >= 8) return;
    onChange([...value, ""]);
  }

  return (
    <Field label="Paragraphs" hint="Each entry renders as its own paragraph. Up to 8.">
      <ul className="space-y-3">
        {value.map((p, i) => (
          <li key={i} className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Textarea
              value={p}
              onChange={(e) => update(i, e.target.value)}
              rows={3}
              maxLength={800}
              placeholder="When we started Vaishnavi in Kalaburagi back in 2018…"
            />
            <div className="flex flex-row gap-1 sm:flex-col">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        disabled={value.length >= 8}
        className="mt-3 w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-2 text-[0.85rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-navy-700 dark:hover:bg-slate-800"
      >
        + Add paragraph {value.length >= 8 && "(max 8 reached)"}
      </button>
    </Field>
  );
}
