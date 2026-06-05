"use client";

import { useRef, useState } from "react";

interface Props {
  purpose: string;
  value: string;
  onChange: (url: string) => void;
  /** Visible label e.g. "Logo image (PNG, SVG, WebP)". */
  hint?: string;
  /** Aspect for the preview box. "square" for logo/favicon, "wide" for OG. */
  aspect?: "square" | "wide";
}

export function ImageUpload({ purpose, value, onChange, hint, aspect = "square" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(f: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", f);
      form.append("purpose", purpose);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = (await res.json()) as { ok: boolean; url?: string; message?: string };
      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.message ?? `Upload failed (${res.status})`);
      }
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const previewBox = aspect === "wide" ? "aspect-[1200/630]" : "aspect-square";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`${previewBox} w-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${
            aspect === "wide" ? "w-56" : "w-32"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[0.7rem] uppercase tracking-[0.15em] text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {hint && <p className="mb-2 text-[0.8rem] text-slate-600">{hint}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-navy-600 px-3 py-1.5 text-[0.82rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
          {value && (
            <p className="mt-2 break-all text-[0.72rem] text-slate-500">
              <code>{value}</code>
            </p>
          )}
          {error && <p className="mt-2 text-[0.78rem] text-rose-600">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
        </div>
      </div>
    </div>
  );
}
