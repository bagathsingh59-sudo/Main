"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, NumberInput, PageHeader, SaveBar, Select } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function AutomationEditor() {
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

  type Section = Exclude<keyof SiteSettings, "version">;
  function patch<K extends Section>(section: K, partial: Partial<SiteSettings[K]>) {
    setDraft((d) => {
      if (!d) return d;
      const current = d[section] as object;
      return { ...d, [section]: { ...current, ...partial } } as SiteSettings;
    });
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await save(draft);
      setStatus({ kind: "ok", message: "Settings saved. Propagating globally — may take ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Automation"
        description="Control how leads are handled the moment they hit the contact form. Defaults to immediate auto-reply with a personal follow-up always one click away."
      />

      <Card
        title="Auto-reply behaviour"
        description="How quickly the lead receives our branded acknowledgement after they submit the form."
      >
        <div className="space-y-4">
          <Field
            label="Mode"
            hint={
              draft.automation.autoReplyMode === "immediate"
                ? "The lead receives the branded thank-you the moment they submit. You can still send a personal follow-up by clicking Reply in the notification email."
                : "No automatic reply. Staff must click the green Approve button in the notification email for the lead to receive anything."
            }
          >
            <Select
              value={draft.automation.autoReplyMode}
              onChange={(e) =>
                patch("automation", { autoReplyMode: e.target.value as "manual" | "immediate" })
              }
            >
              <option value="immediate">Immediate — send auto-reply right away</option>
              <option value="manual">Manual — staff approves each reply</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card
        title="Notification routing"
        description="Where lead notifications land. Leave blank to use the values in your Vercel env vars."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Notification recipient" hint="Override of LEAD_TO env var. Empty = env default.">
            <Input
              type="email"
              placeholder="connect@vaishnaviconsultant.com"
              value={draft.automation.notificationTo}
              onChange={(e) => patch("automation", { notificationTo: e.target.value })}
            />
          </Field>
          <Field label="From name" hint="Display name in the lead's inbox.">
            <Input
              placeholder="Vaishnavi Consultant"
              value={draft.automation.fromName}
              onChange={(e) => patch("automation", { fromName: e.target.value })}
            />
          </Field>
          <Field label="From address" hint="Must be an alias on your Workspace account.">
            <Input
              type="email"
              placeholder="connect@vaishnaviconsultant.com"
              value={draft.automation.fromAddress}
              onChange={(e) => patch("automation", { fromAddress: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Rate limiting"
        description="Prevents form-spam bots from exhausting your Gmail SMTP quota."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Per-IP submissions" hint="Max submissions from one IP address.">
            <NumberInput
              min={1}
              max={100}
              value={draft.rateLimit.perIpMax}
              onChange={(n) => patch("rateLimit", { perIpMax: n })}
            />
          </Field>
          <Field label="Per-IP window (minutes)" hint="The time window for the per-IP cap.">
            <NumberInput
              min={1}
              max={120}
              value={draft.rateLimit.perIpWindowMinutes}
              onChange={(n) => patch("rateLimit", { perIpWindowMinutes: n })}
            />
          </Field>
          <Field label="Global submissions" hint="Site-wide max across all IPs.">
            <NumberInput
              min={1}
              max={500}
              value={draft.rateLimit.globalMax}
              onChange={(n) => patch("rateLimit", { globalMax: n })}
            />
          </Field>
          <Field label="Global window (seconds)">
            <NumberInput
              min={10}
              max={600}
              value={draft.rateLimit.globalWindowSeconds}
              onChange={(n) => patch("rateLimit", { globalWindowSeconds: n })}
            />
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
