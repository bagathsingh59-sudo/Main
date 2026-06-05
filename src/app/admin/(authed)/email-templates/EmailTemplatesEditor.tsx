"use client";

import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Textarea } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import type { AutoReplyTemplate, LeadNotificationTemplate, SiteSettings } from "@/services/settings";

const TABS: Array<{ key: "leadNotification" | "autoReply"; label: string; description: string }> = [
  {
    key: "leadNotification",
    label: "Lead notification",
    description: "Branded email sent to your inbox when a visitor submits the contact form.",
  },
  {
    key: "autoReply",
    label: "Auto-reply to lead",
    description: "Branded acknowledgement sent to the visitor (immediately or after staff approval).",
  },
];

export function EmailTemplatesEditor() {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [tab, setTab] = useState<"leadNotification" | "autoReply">("leadNotification");

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  function patchLead(partial: Partial<LeadNotificationTemplate>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            emailTemplates: {
              ...d.emailTemplates,
              leadNotification: { ...d.emailTemplates.leadNotification, ...partial },
            },
          }
        : d,
    );
    setStatus({ kind: "idle" });
  }
  function patchAuto(partial: Partial<AutoReplyTemplate>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            emailTemplates: {
              ...d.emailTemplates,
              autoReply: { ...d.emailTemplates.autoReply, ...partial },
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
      await savePartial({ emailTemplates: draft.emailTemplates });
      setStatus({ kind: "ok", message: "Email templates saved. Used on the next form submission." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const lead = draft.emailTemplates.leadNotification;
  const auto = draft.emailTemplates.autoReply;

  return (
    <div>
      <PageHeader
        title="Email templates"
        description="Edit subject lines, badge text, and copy for the lead notification and auto-reply emails. The branded shell (header, footer, colors) is fixed — only text content is editable."
      />

      <div className="-mx-2 mb-5 overflow-x-auto px-2">
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-[0.82rem] font-medium ${
                tab === t.key ? "bg-navy-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "leadNotification" && (
        <Card title="Lead notification" description={TABS[0].description}>
          <div className="space-y-4">
            <Field
              label="Subject pattern"
              hint="Tokens you can use: {firstName}, {lastName}, {service}"
            >
              <Input value={lead.subjectPattern} onChange={(e) => patchLead({ subjectPattern: e.target.value })} />
            </Field>
            <Field label="Badge text" hint="The pill shown above the title (e.g. 'New website enquiry').">
              <Input value={lead.badge} onChange={(e) => patchLead({ badge: e.target.value })} />
            </Field>
            <Field
              label="Title pattern"
              hint="Tokens: {name}, {service}. {service} renders in teal automatically."
            >
              <Input value={lead.titlePattern} onChange={(e) => patchLead({ titlePattern: e.target.value })} />
            </Field>
            <Field
              label="Intro paragraph"
              hint="First paragraph below the title — your internal reminder/instruction."
            >
              <Textarea value={lead.intro} onChange={(e) => patchLead({ intro: e.target.value })} rows={3} maxLength={400} />
            </Field>
            <Field label="Footer microcopy" hint="Tiny text below the email card.">
              <Textarea
                value={lead.footerNote}
                onChange={(e) => patchLead({ footerNote: e.target.value })}
                rows={2}
                maxLength={280}
              />
            </Field>
          </div>
        </Card>
      )}

      {tab === "autoReply" && (
        <Card title="Auto-reply to lead" description={TABS[1].description}>
          <div className="space-y-4">
            <Field label="Subject pattern" hint="Token: {firstName}">
              <Input value={auto.subjectPattern} onChange={(e) => patchAuto({ subjectPattern: e.target.value })} />
            </Field>
            <Field label="Badge text">
              <Input value={auto.badge} onChange={(e) => patchAuto({ badge: e.target.value })} />
            </Field>
            <Field label="Title pattern" hint="Token: {firstName}. Name renders in teal automatically.">
              <Input value={auto.titlePattern} onChange={(e) => patchAuto({ titlePattern: e.target.value })} />
            </Field>
            <Field label="Intro paragraph" hint="The main thanks message.">
              <Textarea value={auto.intro} onChange={(e) => patchAuto({ intro: e.target.value })} rows={4} maxLength={400} />
            </Field>
            <Field label="Secondary paragraph" hint="Lead-in to the 3-step expectations card. Optional.">
              <Textarea
                value={auto.introSecondary}
                onChange={(e) => patchAuto({ introSecondary: e.target.value })}
                rows={2}
                maxLength={400}
              />
            </Field>

            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="mb-3 text-[0.78rem] uppercase tracking-[0.12em] text-slate-500">
                3-step "what happens next" card
              </div>
              {auto.steps.map((step, i) => (
                <div key={i} className="mb-3 grid gap-2 sm:grid-cols-[180px_1fr]">
                  <Input
                    placeholder="Within 24 hours"
                    value={step.when}
                    onChange={(e) =>
                      patchAuto({
                        steps: auto.steps.map((s, idx) => (idx === i ? { ...s, when: e.target.value } : s)) as AutoReplyTemplate["steps"],
                      })
                    }
                  />
                  <Input
                    placeholder="Description shown alongside…"
                    value={step.description}
                    onChange={(e) =>
                      patchAuto({
                        steps: auto.steps.map((s, idx) => (idx === i ? { ...s, description: e.target.value } : s)) as AutoReplyTemplate["steps"],
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <Field label="Phone fallback line" hint="Tokens: {phone}, {hours}. Both pulled from Contact info.">
              <Textarea
                value={auto.phoneFallback}
                onChange={(e) => patchAuto({ phoneFallback: e.target.value })}
                rows={2}
                maxLength={280}
              />
            </Field>
            <Field label="Footer microcopy">
              <Textarea
                value={auto.footerNote}
                onChange={(e) => patchAuto({ footerNote: e.target.value })}
                rows={2}
                maxLength={280}
              />
            </Field>
          </div>
        </Card>
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
