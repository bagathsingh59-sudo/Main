"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Reusable rich-text-via-markdown editor used by Blog content, FAQ
 * answers, and Team bios. Looks like a normal textarea but adds:
 *   • A toolbar to insert bold / italic / headings / lists / quotes /
 *     links / code / image markdown around the current selection
 *   • An inline image upload that hits /api/admin/upload and inserts
 *     ![alt](url) at the cursor
 *   • A Preview tab that renders the markdown with GFM (tables,
 *     strikethrough, task lists) using the SAME library the public
 *     post page uses — so what you preview is what readers see.
 */

interface MarkdownEditorProps {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  /** Optional. Identifies the upload folder ("blog", "faq", etc.). */
  uploadPurpose?: string;
  placeholder?: string;
  maxLength?: number;
  /** Show small "Markdown" hint chip in the toolbar. */
  showFormatHint?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  rows = 12,
  uploadPurpose = "content",
  placeholder = "Write here. Markdown shortcuts work — try the toolbar.",
  maxLength,
  showFormatHint = true,
}: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function wrapSelection(before: string, after: string = before, placeholder = "") {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    // Restore selection to the wrapped text on the next paint.
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertAtLineStart(prefix: string, placeholder = "") {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const lineStart = before.lastIndexOf("\n") + 1;
    const selected = value.slice(start, end);
    const lines = (selected || placeholder).split("\n");
    const prefixed = lines.map((l) => `${prefix}${l}`).join("\n");
    const next = value.slice(0, lineStart) + prefixed + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(lineStart + prefix.length, lineStart + prefixed.length);
    });
  }

  function insertText(text: string) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const next = value.slice(0, start) + text + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + text.length, start + text.length);
    });
  }

  async function uploadAndInsert(f: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", f);
      form.append("purpose", uploadPurpose);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = (await res.json()) as { ok: boolean; url?: string; message?: string };
      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.message ?? `Upload failed (${res.status})`);
      }
      const alt = f.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
      insertText(`\n\n![${alt}](${json.url})\n\n`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1.5 dark:border-slate-700">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`rounded-md px-2.5 py-1 text-[0.78rem] font-medium ${
              tab === "edit"
                ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-md px-2.5 py-1 text-[0.78rem] font-medium ${
              tab === "preview"
                ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
            }`}
          >
            Preview
          </button>
        </div>
        {showFormatHint && (
          <span className="hidden text-[0.72rem] text-slate-400 sm:inline dark:text-slate-500">
            Markdown · **bold** *italic* # heading · use the toolbar
          </span>
        )}
      </div>

      {/* Toolbar */}
      {tab === "edit" && (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-2 py-1.5 dark:border-slate-700">
          <ToolbarBtn title="Heading 2" onClick={() => insertAtLineStart("## ", "Heading")}>
            H2
          </ToolbarBtn>
          <ToolbarBtn title="Heading 3" onClick={() => insertAtLineStart("### ", "Subheading")}>
            H3
          </ToolbarBtn>
          <ToolbarSep />
          <ToolbarBtn title="Bold" onClick={() => wrapSelection("**", "**", "bold text")}>
            <strong>B</strong>
          </ToolbarBtn>
          <ToolbarBtn title="Italic" onClick={() => wrapSelection("*", "*", "italic text")}>
            <em>I</em>
          </ToolbarBtn>
          <ToolbarBtn title="Strikethrough" onClick={() => wrapSelection("~~", "~~", "strike")}>
            <s>S</s>
          </ToolbarBtn>
          <ToolbarSep />
          <ToolbarBtn title="Bullet list" onClick={() => insertAtLineStart("- ", "item")}>
            • List
          </ToolbarBtn>
          <ToolbarBtn title="Numbered list" onClick={() => insertAtLineStart("1. ", "item")}>
            1. List
          </ToolbarBtn>
          <ToolbarBtn title="Quote" onClick={() => insertAtLineStart("> ", "Quoted text")}>
            ❝
          </ToolbarBtn>
          <ToolbarSep />
          <ToolbarBtn title="Link" onClick={() => wrapSelection("[", "](https://)", "link text")}>
            🔗
          </ToolbarBtn>
          <ToolbarBtn title="Inline code" onClick={() => wrapSelection("`", "`", "code")}>
            {"<>"}
          </ToolbarBtn>
          <ToolbarSep />
          <ToolbarBtn
            title="Upload image"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "🖼 Image"}
          </ToolbarBtn>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadAndInsert(f);
            }}
          />
        </div>
      )}

      {/* Body */}
      {tab === "edit" ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          spellCheck
          className="block w-full resize-y bg-transparent px-3 py-3 font-mono text-[0.88rem] leading-[1.6] text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      ) : (
        <div className="prose prose-slate max-w-none px-4 py-4 text-[0.92rem] dark:prose-invert">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-slate-400 dark:text-slate-500">Nothing to preview yet.</p>
          )}
        </div>
      )}

      {error && (
        <div className="border-t border-slate-100 px-3 py-2 text-[0.78rem] text-rose-600 dark:border-slate-700 dark:text-rose-400">
          {error}
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md px-2 py-1 text-[0.78rem] font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <span className="mx-0.5 h-4 w-px bg-slate-200 dark:bg-slate-700" />;
}
