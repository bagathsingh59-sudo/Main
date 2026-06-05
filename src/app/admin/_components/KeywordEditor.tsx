"use client";

import { useState } from "react";

const MAX_KEYWORDS = 100; // sanity cap; schema enforces per-field caps too
const MAX_KW_LENGTH = 60;

interface ParseResult {
  candidates: string[];
  duplicates: string[];
  invalid: { value: string; reason: string }[];
}

/** Split on newlines, commas, semicolons, tabs, or pipes. Drop empties. */
function splitBulk(raw: string): string[] {
  return raw
    .split(/[\n,;|\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function analyse(raw: string, existing: string[]): ParseResult {
  const seen = new Set(existing.map((s) => s.toLowerCase()));
  const seenInBatch = new Set<string>();
  const candidates: string[] = [];
  const duplicates: string[] = [];
  const invalid: { value: string; reason: string }[] = [];

  for (const item of splitBulk(raw)) {
    const lower = item.toLowerCase();
    if (item.length > MAX_KW_LENGTH) {
      invalid.push({ value: item, reason: `>${MAX_KW_LENGTH} chars` });
      continue;
    }
    if (seen.has(lower) || seenInBatch.has(lower)) {
      duplicates.push(item);
      continue;
    }
    seenInBatch.add(lower);
    candidates.push(item);
  }
  return { candidates, duplicates, invalid };
}

export function KeywordEditor({
  value,
  onChange,
  placeholder = "Add a keyword and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [bulk, setBulk] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    if (v.length > MAX_KW_LENGTH) {
      setDraft("");
      return;
    }
    if (value.some((k) => k.toLowerCase() === v.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function applyBulk() {
    const { candidates } = analyse(bulk, value);
    if (candidates.length === 0) return;
    const next = [...value, ...candidates].slice(0, MAX_KEYWORDS);
    onChange(next);
    setBulk("");
    setMode("single");
  }

  function clearAll() {
    onChange([]);
  }

  const parsed = mode === "bulk" ? analyse(bulk, value) : null;

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap gap-1.5">
          {value.map((kw, i) => (
            <span
              key={`${kw}-${i}`}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.78rem] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            >
              {kw}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${kw}`}
                className="text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
              >
                ×
              </button>
            </span>
          ))}
          {mode === "single" && (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  add();
                } else if (e.key === "Backspace" && !draft && value.length > 0) {
                  remove(value.length - 1);
                }
              }}
              onBlur={add}
              placeholder={value.length === 0 ? placeholder : "Add another…"}
              className="min-w-[140px] flex-1 bg-transparent px-1 py-0.5 text-[0.85rem] text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.78rem] text-slate-500 dark:text-slate-400">
          {value.length} keyword{value.length === 1 ? "" : "s"}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === "bulk" ? "single" : "bulk")}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[0.78rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {mode === "bulk" ? "← Single add" : "+ Bulk add"}
          </button>
          {value.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-rose-200 bg-white px-2.5 py-1 text-[0.78rem] font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/30"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {mode === "bulk" && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mb-2 text-[0.78rem] text-slate-600 dark:text-slate-400">
            Paste your keyword list — one per line, or separated by commas / semicolons.
          </div>
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={6}
            placeholder={`EPF consultant\nESIC compliance\npayroll outsourcing\nlabour law compliance Kalaburagi\n…`}
            className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-[0.82rem] text-slate-900 outline-none placeholder:text-slate-400 focus:border-navy-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500"
          />
          {parsed && (
            <div className="mt-2 flex flex-wrap gap-3 text-[0.78rem]">
              <span className="text-emerald-700 dark:text-emerald-400">
                ✓ {parsed.candidates.length} new
              </span>
              {parsed.duplicates.length > 0 && (
                <span className="text-amber-700 dark:text-amber-400">
                  ⚠ {parsed.duplicates.length} duplicate
                </span>
              )}
              {parsed.invalid.length > 0 && (
                <span className="text-rose-700 dark:text-rose-400">
                  ✕ {parsed.invalid.length} invalid
                </span>
              )}
              {value.length + (parsed?.candidates.length ?? 0) > MAX_KEYWORDS && (
                <span className="text-rose-700 dark:text-rose-400">
                  ⚠ Will exceed {MAX_KEYWORDS} cap — extras dropped
                </span>
              )}
            </div>
          )}
          {parsed && parsed.invalid.length > 0 && (
            <details className="mt-2 text-[0.75rem] text-slate-600 dark:text-slate-400">
              <summary className="cursor-pointer">Show invalid items</summary>
              <ul className="mt-1 list-inside list-disc">
                {parsed.invalid.slice(0, 10).map((it, i) => (
                  <li key={i}>
                    &ldquo;{it.value.slice(0, 40)}{it.value.length > 40 ? "…" : ""}&rdquo; — {it.reason}
                  </li>
                ))}
                {parsed.invalid.length > 10 && <li>…and {parsed.invalid.length - 10} more</li>}
              </ul>
            </details>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyBulk}
              disabled={!parsed || parsed.candidates.length === 0}
              className="rounded-md bg-navy-600 px-3 py-1.5 text-[0.82rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-40"
            >
              Add {parsed?.candidates.length ?? 0} keyword{parsed?.candidates.length === 1 ? "" : "s"}
            </button>
            <button
              type="button"
              onClick={() => {
                setBulk("");
                setMode("single");
              }}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
