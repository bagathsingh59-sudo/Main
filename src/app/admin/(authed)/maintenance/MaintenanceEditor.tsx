"use client";

import { useEffect, useState } from "react";
import { Card, Field, PageHeader, SaveBar, Textarea, Toggle } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function MaintenanceEditor() {
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
  const m = draft.maintenance;

  function patch(partial: Partial<SiteSettings["maintenance"]>) {
    setDraft((d) => (d ? { ...d, maintenance: { ...d.maintenance, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await save(draft);
      setStatus({ kind: "ok", message: "Maintenance settings saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Maintenance mode"
        description="Emergency switch to disable the contact form (e.g., during an SMTP outage or while migrating providers). Booking is unaffected — it lives on Google Calendar."
      />

      <Card>
        <Toggle
          checked={m.formsDisabled}
          onChange={(v) => patch({ formsDisabled: v })}
          label="Disable contact form submissions"
          description="When on, the contact form shows the maintenance message and returns 503. The form fields are still visible but submits are blocked at the API."
        />
      </Card>

      <Card title="Message shown to visitors">
        <Field label="Maintenance message" hint="Plain text. Keep it warm and give an alternative way to contact you.">
          <Textarea
            value={m.message}
            onChange={(e) => patch({ message: e.target.value })}
            maxLength={280}
            rows={4}
          />
        </Field>
      </Card>

      {m.formsDisabled && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-[0.88rem] text-amber-900">
          <strong>⚠ Maintenance mode is ON.</strong> Submissions to /api/contact will be blocked until you turn it off.
        </div>
      )}

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
