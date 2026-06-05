"use client";

import { type ReactNode } from "react";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-600">{description}</p>}
    </div>
  );
}

export function Card({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {(title || description) && (
        <header className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          {title && <h2 className="text-[1rem] font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-1 text-[0.85rem] leading-relaxed text-slate-600">{description}</p>}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.82rem] font-semibold text-slate-800">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.78rem] text-slate-500">{hint}</span>}
    </label>
  );
}

const baseInput =
  "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.92rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-100";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {}
export function Input(props: InputProps) {
  return <input {...props} className={baseInput} />;
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {}
export function Textarea(props: TextareaProps) {
  return <textarea {...props} className={`${baseInput} min-h-[96px] resize-y`} />;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {}
export function Select(props: SelectProps) {
  return <select {...props} className={baseInput} />;
}

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type" | "onChange" | "value"> {
  value: number;
  onChange: (n: number) => void;
}
export function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  return (
    <input
      {...rest}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={baseInput}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-navy-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <div>
        <span className="block text-[0.92rem] font-semibold text-slate-900">{label}</span>
        {description && <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-slate-600">{description}</span>}
      </div>
    </label>
  );
}

export function SaveBar({
  dirty,
  saving,
  status,
  onSave,
  onReset,
}: {
  dirty: boolean;
  saving: boolean;
  status: { kind: "idle" | "ok" | "error"; message?: string };
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-lg shadow-slate-200/50">
      <div className="text-[0.85rem]">
        {status.kind === "ok" && <span className="font-semibold text-emerald-600">✓ {status.message ?? "Saved"}</span>}
        {status.kind === "error" && <span className="font-semibold text-rose-600">✕ {status.message ?? "Save failed"}</span>}
        {status.kind === "idle" && (
          <span className="text-slate-500">{dirty ? "You have unsaved changes" : "No changes"}</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          disabled={!dirty || saving}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="rounded-lg bg-navy-600 px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
