"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import { makeId } from "../../_components/blogUtils";
import { TEAM_ACCENTS } from "@/services/settings";
import type { TeamMember } from "@/services/settings";

export function TeamList() {
  const { settings, loading, error, savePartial } = useSettings();
  const [creating, setCreating] = useState(false);
  const [pendingSwap, setPendingSwap] = useState<string | null>(null);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!settings) return null;

  const members = settings.team.members;

  async function newMember() {
    if (!settings || creating) return;
    setCreating(true);
    // Pre-fill schema-required fields so the initial save passes Zod.
    // Admin overwrites everything on the editor screen.
    const member: TeamMember = {
      id: makeId(),
      name: "New team member",
      role: "",
      bio: "",
      initials: "NM",
      accent: TEAM_ACCENTS[members.length % TEAM_ACCENTS.length],
      image: "",
      linkedinUrl: "",
    };
    try {
      await savePartial({ team: { members: [...members, member] } });
      // Hand the editor the freshly-created member so it renders instantly,
      // sidestepping Vercel Blob CDN propagation lag on the next read.
      try {
        sessionStorage.setItem(`vc-fresh-member-${member.id}`, JSON.stringify(member));
      } catch {
        /* sessionStorage unavailable — editor retries via Blob */
      }
      window.location.href = `/admin/team/${member.id}`;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't create member");
      setCreating(false);
    }
  }

  async function move(id: string, dir: -1 | 1) {
    if (pendingSwap || !settings) return;
    setPendingSwap(id);
    try {
      const idx = members.findIndex((m) => m.id === id);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= members.length) return;
      const next = members.slice();
      [next[idx], next[j]] = [next[j], next[idx]];
      await savePartial({ team: { members: next } });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Reorder failed");
    } finally {
      setPendingSwap(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Team"
          description="People shown on /about. The first member is also used as the Founder card fallback. Click any row to edit the profile + photo."
        />
        <button
          type="button"
          onClick={newMember}
          disabled={creating || members.length >= 50}
          className="rounded-lg bg-navy-600 px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
        >
          {creating ? "Creating…" : "+ Add member"}
        </button>
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            👤
          </div>
          <h3 className="text-[1rem] font-semibold text-slate-900 dark:text-slate-100">No members yet</h3>
          <p className="mt-1.5 text-[0.85rem] text-slate-600 dark:text-slate-400">
            The public site is using the bundled team list. Add a member here to start managing it.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {members.map((m, i) => (
            <li
              key={m.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              {m.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.image} alt="" className="h-14 w-14 flex-shrink-0 rounded-full object-cover" />
              ) : (
                <span
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${m.accent} text-[1.1rem] font-bold text-white`}
                >
                  {m.initials || "?"}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/team/${m.id}`}
                  className="block font-semibold text-slate-900 hover:text-navy-600 dark:text-slate-100 dark:hover:text-teal-300"
                >
                  {m.name || "(unnamed)"}
                </Link>
                <div className="text-[0.82rem] text-slate-600 dark:text-slate-400">{m.role || "—"}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(m.id, -1)}
                  disabled={i === 0 || pendingSwap !== null}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(m.id, 1)}
                  disabled={i === members.length - 1 || pendingSwap !== null}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
              <Link
                href={`/admin/team/${m.id}`}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
