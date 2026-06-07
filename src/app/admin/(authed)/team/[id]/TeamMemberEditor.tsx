"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea } from "../../../_components/Fields";
import { ImageUpload } from "../../../_components/ImageUpload";
import { useSettings } from "../../../_components/useSettings";
import { TEAM_ACCENTS } from "@/services/settings";
import type { TeamMember, SiteSettings } from "@/services/settings";

export function TeamMemberEditor({ memberId }: { memberId: string }) {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [deleting, setDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!settings) return;
    const has = settings.team.members.some((m) => m.id === memberId);
    if (has) {
      setDraft(settings);
      return;
    }
    // Fallback: TeamList just created this member and stashed it in
    // sessionStorage. Merge it into the local draft so the editor renders
    // immediately, sidestepping the Blob CDN propagation window.
    try {
      const stashed = sessionStorage.getItem(`vc-fresh-member-${memberId}`);
      if (stashed) {
        const parsed = JSON.parse(stashed) as TeamMember;
        if (parsed && parsed.id === memberId) {
          setDraft({
            ...settings,
            team: { ...settings.team, members: [...settings.team.members, parsed] },
          });
          sessionStorage.removeItem(`vc-fresh-member-${memberId}`);
          return;
        }
      }
    } catch {
      /* swallow */
    }
    setDraft(settings);
  }, [settings, memberId]);

  // Same Vercel Blob propagation safety net as BlogEditor — silently
  // re-fetch up to 3 times if a freshly-created member isn't visible yet.
  useEffect(() => {
    if (!draft || retryCount >= 3) return;
    const exists = draft.team.members.some((m) => m.id === memberId);
    if (exists) return;
    const delay = 600 * (retryCount + 1);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const json = (await res.json()) as { ok: boolean; settings?: SiteSettings };
        if (json.ok && json.settings) {
          const hit = json.settings.team.members.some((m) => m.id === memberId);
          if (hit) {
            setDraft(json.settings);
            return;
          }
        }
      } catch {
        /* swallow */
      }
      setRetryCount((c) => c + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [draft, retryCount, memberId]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const member = draft.team.members.find((m) => m.id === memberId);
  const original = settings.team.members.find((m) => m.id === memberId);

  if (!member) {
    if (retryCount < 3) return <p className="text-slate-500">Loading member…</p>;
    return (
      <div>
        <PageHeader title="Member not found" description="This team member no longer exists." />
        <Link href="/admin/team" className="text-navy-600 hover:underline dark:text-teal-300">
          ← Back to team list
        </Link>
      </div>
    );
  }

  const dirty = JSON.stringify(member) !== JSON.stringify(original);

  function patch(partial: Partial<TeamMember>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            team: {
              ...d.team,
              members: d.team.members.map((m) => (m.id === memberId ? { ...m, ...partial } : m)),
            },
          }
        : d,
    );
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ team: draft.team });
      setStatus({ kind: "ok", message: "Member saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!settings || deleting) return;
    if (!confirm(`Delete "${member?.name || "this member"}" permanently? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await savePartial({
        team: { members: settings.team.members.filter((m) => m.id !== memberId) },
      });
      window.location.href = "/admin/team";
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Delete failed" });
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title={member.name || "(unnamed member)"} description={member.role || "Edit profile, photo, and bio."} />
        <Link
          href="/admin/team"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ← Back to team
        </Link>
      </div>

      <Card title="Photo" description="Square portrait recommended. Falls back to initials avatar if empty.">
        <ImageUpload
          purpose="team"
          value={member.image}
          onChange={(url) => patch({ image: url })}
          hint="PNG or JPEG, up to 2 MB. Rendered as a circular avatar."
          aspect="square"
        />
      </Card>

      <Card title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input value={member.name} onChange={(e) => patch({ name: e.target.value })} placeholder="CA Lakshmi Narayan" />
          </Field>
          <Field label="Role / title">
            <Input value={member.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Founder & Managing Partner" />
          </Field>
          <Field label="Initials" hint="2-4 letters. Used only when no photo is uploaded.">
            <Input
              value={member.initials}
              onChange={(e) => patch({ initials: e.target.value.slice(0, 4).toUpperCase() })}
              placeholder="LN"
            />
          </Field>
          <Field label="Accent gradient" hint="Brand colour for the initials avatar.">
            <Select value={member.accent} onChange={(e) => patch({ accent: e.target.value })}>
              {TEAM_ACCENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="LinkedIn URL" hint="Optional. Used as the team-card click target.">
            <Input
              value={member.linkedinUrl}
              onChange={(e) => patch({ linkedinUrl: e.target.value })}
              placeholder="https://www.linkedin.com/in/…"
            />
          </Field>
        </div>
      </Card>

      <Card title="Bio">
        <Field label="Bio" hint="2-3 sentences. Shown on the team card.">
          <Textarea value={member.bio} onChange={(e) => patch({ bio: e.target.value })} rows={5} maxLength={800} />
        </Field>
      </Card>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-900/20">
        <div>
          <div className="font-semibold text-rose-900 dark:text-rose-200">Danger zone</div>
          <div className="text-[0.82rem] text-rose-700 dark:text-rose-300">Removing a member is permanent.</div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg bg-rose-600 px-3.5 py-2 text-[0.82rem] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete member"}
        </button>
      </div>

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
