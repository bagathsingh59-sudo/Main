"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { SiteSettings } from "@/services/settings";

export function ContactInfoEditor() {
  const { settings, loading, error, savePartial } = useSettings();
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
  const ci = draft.contactInfo;

  function patch(partial: Partial<SiteSettings["contactInfo"]>) {
    setDraft((d) => (d ? { ...d, contactInfo: { ...d.contactInfo, ...partial } } : d));
    setStatus({ kind: "idle" });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ contactInfo: draft.contactInfo });
      setStatus({ kind: "ok", message: "Contact info saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Contact info"
        description="Phone, email, address and hours used in the site footer, contact page, and email templates."
      />

      <Card title="Phone & email">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary phone">
            <Input value={ci.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </Field>
          <Field label="Alternate phone">
            <Input value={ci.altPhone} onChange={(e) => patch({ altPhone: e.target.value })} />
          </Field>
          <Field label="Primary email">
            <Input type="email" value={ci.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
          <Field label="Support email">
            <Input type="email" value={ci.supportEmail} onChange={(e) => patch({ supportEmail: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="Address">
        <div className="grid gap-4">
          <Field label="Address line 1">
            <Input value={ci.addressLine1} onChange={(e) => patch({ addressLine1: e.target.value })} />
          </Field>
          <Field label="Address line 2">
            <Input value={ci.addressLine2} onChange={(e) => patch({ addressLine2: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City">
              <Input value={ci.city} onChange={(e) => patch({ city: e.target.value })} />
            </Field>
            <Field label="State">
              <Input value={ci.state} onChange={(e) => patch({ state: e.target.value })} />
            </Field>
            <Field label="PIN code">
              <Input value={ci.pin} onChange={(e) => patch({ pin: e.target.value })} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Working hours">
        <Field label="Hours" hint="Free-text — e.g. 'Mon – Sat · 9:30 AM – 7:00 PM IST'.">
          <Input value={ci.hours} onChange={(e) => patch({ hours: e.target.value })} />
        </Field>
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
