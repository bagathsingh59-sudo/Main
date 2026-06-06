"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Textarea } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { FaqItem, SiteSettings } from "@/services/settings";

const MAX_ITEMS = 100;
const MAX_Q = 280;

function splitQuestions(raw: string): string[] {
  // One question per line. Newlines or `?` followed by newline are
  // both natural separators. Drop empties + trim.
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.length > 0);
}

export function FaqEditor() {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [bulk, setBulk] = useState("");

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const dirty = JSON.stringify(draft.faq) !== JSON.stringify(settings.faq);
  const items = draft.faq.items;

  function setItems(next: FaqItem[]) {
    setDraft((d) => (d ? { ...d, faq: { ...d.faq, items: next } } : d));
    setStatus({ kind: "idle" });
  }

  function updateItem(i: number, patch: Partial<FaqItem>) {
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }
  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }
  function addBlank() {
    if (items.length >= MAX_ITEMS) return;
    setItems([...items, { question: "", answer: "" }]);
  }

  function applyBulk() {
    const questions = splitQuestions(bulk);
    if (questions.length === 0) return;
    const existing = new Set(items.map((i) => i.question.toLowerCase().trim()));
    const fresh = questions
      .filter((q) => !existing.has(q.toLowerCase().trim()) && q.length <= MAX_Q)
      .map((q) => ({ question: q.endsWith("?") ? q : `${q}?`, answer: "" }));
    if (fresh.length === 0) {
      setBulk("");
      return;
    }
    const next = [...items, ...fresh].slice(0, MAX_ITEMS);
    setItems(next);
    setBulk("");
  }

  async function onSave() {
    if (!draft) return;
    // Strip empty items from save (questions without text).
    const cleaned: FaqItem[] = draft.faq.items
      .map((it) => ({ question: it.question.trim(), answer: it.answer.trim() }))
      .filter((it) => it.question.length >= 5);
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ faq: { items: cleaned } });
      setStatus({ kind: "ok", message: `Saved ${cleaned.length} FAQ${cleaned.length === 1 ? "" : "s"}. Live within ~30 seconds.` });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const parsedBulk = splitQuestions(bulk);
  const filledCount = items.filter((it) => it.answer.trim().length > 0).length;

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Powers the FAQ section on /insights and the FAQ JSON-LD schema (Google's 'People Also Ask' eligibility). Only items with answers are published; the rest stay as drafts."
      />

      <div className="mb-6 rounded-xl border border-fuchsia-200 bg-fuchsia-50/60 px-4 py-3 text-[0.85rem] leading-relaxed text-fuchsia-900 dark:border-fuchsia-900/40 dark:bg-fuchsia-900/20 dark:text-fuchsia-200">
        <strong className="font-semibold">SEO tip:</strong> for an FAQ to qualify for Google&apos;s &ldquo;People Also
        Ask&rdquo; rich result, both the question AND a detailed answer (50&ndash;300 words ideal) must exist as
        page content. Bulk-paste your questions first, then fill answers over time.
      </div>

      <Card title="Bulk add questions" description="Paste one question per line. Leading bullets, numbers, or dashes get stripped automatically.">
        <Textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={6}
          placeholder={"What is EPF and how does it work for employees in India?\nWhat is ESIC and who is eligible for it?\nWhat is the EPF contribution rate for employer and employee?\n…"}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[0.8rem] text-slate-600 dark:text-slate-400">
            {parsedBulk.length > 0 ? (
              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                ✓ {parsedBulk.length} question{parsedBulk.length === 1 ? "" : "s"} detected
              </span>
            ) : (
              <span>One question per line. Trailing &ldquo;?&rdquo; added automatically if missing.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBulk("")}
              disabled={!bulk}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={applyBulk}
              disabled={parsedBulk.length === 0}
              className="rounded-md bg-navy-600 px-3 py-1.5 text-[0.82rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-40"
            >
              Add {parsedBulk.length || ""} question{parsedBulk.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      </Card>

      <Card
        title={`FAQs (${items.length} total · ${filledCount} with answers)`}
        description="Click any answer field to edit. Only items with both question and answer text will be published to the public site."
      >
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-[0.85rem] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No FAQs yet. Paste questions above or click &ldquo;Add new&rdquo;.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item, i) => {
              const draftStatus = item.answer.trim().length === 0;
              return (
                <li
                  key={i}
                  className={`rounded-xl border p-4 ${
                    draftStatus
                      ? "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-900/10"
                      : "border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[0.7rem] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Q{i + 1} {draftStatus && <span className="ml-1 text-amber-700 dark:text-amber-300">· draft (no answer)</span>}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(i, -1)}
                        disabled={i === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(i, 1)}
                        disabled={i === items.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-900/30"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <Field label="Question">
                    <Input value={item.question} onChange={(e) => updateItem(i, { question: e.target.value })} maxLength={MAX_Q} />
                  </Field>
                  <div className="mt-3">
                    <Field label="Answer" hint="50-300 words. Plain text. Include keywords naturally.">
                      <Textarea
                        value={item.answer}
                        onChange={(e) => updateItem(i, { answer: e.target.value })}
                        rows={4}
                        maxLength={2000}
                      />
                    </Field>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={addBlank}
          disabled={items.length >= MAX_ITEMS}
          className="mt-4 w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-2.5 text-[0.85rem] font-medium text-slate-600 hover:border-navy-400 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-navy-700 dark:hover:bg-slate-800"
        >
          + Add new FAQ {items.length >= MAX_ITEMS && `(max ${MAX_ITEMS} reached)`}
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
