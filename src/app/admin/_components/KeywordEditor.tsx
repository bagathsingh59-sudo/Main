"use client";

import { useState } from "react";

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

  function add() {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((kw, i) => (
          <span
            key={`${kw}-${i}`}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.78rem] font-medium text-slate-700"
          >
            {kw}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${kw}`}
              className="text-slate-400 hover:text-rose-600"
            >
              ×
            </button>
          </span>
        ))}
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
          className="min-w-[140px] flex-1 bg-transparent px-1 py-0.5 text-[0.85rem] text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
