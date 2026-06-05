/**
 * Branded HTML email templates for transactional mail.
 *
 * Built as inline-styled HTML tables — required for broad email-client
 * compatibility (Gmail, Outlook, Apple Mail, Yahoo). Brand colours match
 * the marketing site (navy / teal gradient).
 */

import { COMPANY } from "@/constants/company";

/* ─── design tokens (kept in sync with tailwind.config.ts) ─── */
const C = {
  navy900: "#0b1f3a",
  navy700: "#1442a8",
  navy600: "#1a56db",
  navy100: "#dce8ff",
  teal600: "#0891b2",
  teal400: "#22d3ee",
  ink: "#0b1f3a",
  mist: "#eef2ff",
  cloud: "#f5f8ff",
  textMuted: "#5b6b85",
  border: "#e3e9f5",
} as const;

const SITE_URL = "https://www.vaishnaviconsultant.com";

/* ─── shared chrome ─── */

interface CTA {
  label: string;
  href: string;
  /** Visual treatment — "primary" = navy/teal gradient, "approve" = green. */
  tone?: "primary" | "approve";
}

interface ShellOpts {
  preheader: string;
  badge: string;
  title: string;
  /** Body HTML — composed from helpers below. */
  body: string;
  /** Optional primary CTA at the foot of the body. */
  cta?: CTA;
  /** Optional secondary CTA, rendered to the right of the primary. */
  secondaryCta?: CTA;
}

function escape(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCta(c: CTA): string {
  const bg =
    c.tone === "approve"
      ? "linear-gradient(135deg,#059669 0%,#10b981 100%)"
      : `linear-gradient(135deg,${C.navy600} 0%,${C.teal600} 100%)`;
  const shadow = c.tone === "approve" ? "0 8px 24px rgba(5,150,105,0.35)" : "0 8px 24px rgba(26,86,219,0.35)";
  return `<a href="${escape(c.href)}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 22px;border-radius:12px;letter-spacing:0.2px;box-shadow:${shadow};margin:0 8px 8px 0;">${escape(c.label)}</a>`;
}

function shell({ preheader, badge, title, body, cta, secondaryCta }: ShellOpts): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escape(title)}</title>
    <style>
      @media (max-width: 600px) {
        .container { width: 100% !important; }
        .px { padding-left: 22px !important; padding-right: 22px !important; }
        .stack { display: block !important; width: 100% !important; }
        .stack + .stack { padding-top: 14px !important; }
        .hero-title { font-size: 24px !important; line-height: 1.25 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${C.cloud};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Helvetica,Arial,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased;">
    <!-- preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${C.cloud};opacity:0;">${escape(preheader)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cloud};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 48px rgba(11,31,58,0.10);">
            <!-- brand header -->
            <tr>
              <td style="background:linear-gradient(135deg,${C.navy600} 0%,${C.teal600} 100%);padding:28px 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.2px;">
                      ${escape(COMPANY.name)}
                    </td>
                    <td align="right" style="color:#cffafe;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">
                      ${escape(COMPANY.tagline)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- hero -->
            <tr>
              <td class="px" style="padding:36px 36px 8px 36px;">
                <div style="display:inline-block;padding:6px 12px;background:${C.mist};color:${C.navy700};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border-radius:999px;">
                  ${escape(badge)}
                </div>
                <h1 class="hero-title" style="margin:14px 0 0 0;font-size:28px;line-height:1.2;font-weight:800;color:${C.navy900};letter-spacing:-0.01em;">
                  ${title}
                </h1>
              </td>
            </tr>

            <!-- body -->
            <tr>
              <td class="px" style="padding:24px 36px 8px 36px;color:${C.ink};font-size:15px;line-height:1.62;">
                ${body}
              </td>
            </tr>

            ${
              cta || secondaryCta
                ? `
            <tr>
              <td class="px" align="left" style="padding:8px 36px 36px 36px;">
                ${cta ? renderCta(cta) : ""}${secondaryCta ? renderCta(secondaryCta) : ""}
              </td>
            </tr>`
                : ""
            }

            <!-- divider -->
            <tr><td class="px" style="padding:0 36px;"><div style="height:1px;background:${C.border};"></div></td></tr>

            <!-- footer -->
            <tr>
              <td class="px" style="padding:24px 36px 28px 36px;color:${C.textMuted};font-size:12px;line-height:1.6;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="stack" style="vertical-align:top;width:60%;">
                      <div style="font-weight:700;color:${C.navy900};font-size:13px;">${escape(COMPANY.legalName)}</div>
                      <div style="margin-top:6px;">
                        ${escape(COMPANY.contact.address.line1)}<br/>
                        ${escape(COMPANY.contact.address.line2)}<br/>
                        ${escape(COMPANY.contact.address.city)}, ${escape(COMPANY.contact.address.state)} ${escape(COMPANY.contact.address.pin)}
                      </div>
                    </td>
                    <td class="stack" align="right" style="vertical-align:top;width:40%;">
                      <div><a href="tel:${escape(COMPANY.contact.phone.replace(/\s/g, ""))}" style="color:${C.navy700};text-decoration:none;font-weight:600;">${escape(COMPANY.contact.phone)}</a></div>
                      <div style="margin-top:4px;"><a href="mailto:${escape(COMPANY.contact.email)}" style="color:${C.navy700};text-decoration:none;">${escape(COMPANY.contact.email)}</a></div>
                      <div style="margin-top:4px;"><a href="${SITE_URL}" style="color:${C.navy700};text-decoration:none;">vaishnaviconsultant.com</a></div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- legal microcopy -->
          <div style="max-width:600px;margin-top:16px;color:${C.textMuted};font-size:11px;line-height:1.5;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Helvetica,Arial,sans-serif;">
            This is an automated notification from the contact form on vaishnaviconsultant.com.<br/>
            ${escape(COMPANY.contact.hours)}
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* ─── reusable body helpers ─── */

function detailRows(rows: Array<[string, string | undefined | null]>): string {
  const visible = rows.filter(([, v]) => v && String(v).trim().length > 0);
  if (!visible.length) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px 0;background:${C.cloud};border-radius:14px;overflow:hidden;border:1px solid ${C.border};">
      ${visible
        .map(
          ([k, v], i) => `
        <tr>
          <td style="padding:14px 18px;width:38%;font-size:12px;font-weight:700;color:${C.textMuted};text-transform:uppercase;letter-spacing:1px;${i === 0 ? "" : `border-top:1px solid ${C.border};`}">
            ${escape(k)}
          </td>
          <td style="padding:14px 18px;font-size:14px;color:${C.navy900};font-weight:600;${i === 0 ? "" : `border-top:1px solid ${C.border};`}">
            ${escape(String(v))}
          </td>
        </tr>`,
        )
        .join("")}
    </table>`;
}

function quoteBlock(text: string): string {
  return `
    <div style="margin:8px 0 20px 0;padding:18px 22px;background:linear-gradient(135deg,${C.mist} 0%,#e0f7fa 100%);border-left:4px solid ${C.teal600};border-radius:12px;color:${C.navy900};font-size:15px;line-height:1.65;white-space:pre-wrap;">
      ${escape(text)}
    </div>`;
}

/* ─── public templates ─── */

export interface ContactLeadEmail {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  companySize: string;
  service: string;
  message: string;
  leadId: string;
}

export function renderContactLeadEmail(d: ContactLeadEmail & { approveUrl?: string }) {
  const fullName = `${d.firstName} ${d.lastName}`.trim();
  return shell({
    preheader: `New enquiry from ${fullName} · ${d.service}`,
    badge: "New website enquiry",
    title: `${escape(fullName)} wants to talk about <span style="color:${C.teal600};">${escape(d.service)}</span>.`,
    body: `
      <p style="margin:0 0 16px 0;">A new enquiry just landed in your inbox. Reply within one working day to honour the site promise.</p>
      ${detailRows([
        ["Name", fullName],
        ["Email", d.email],
        ["Phone", d.phone || "—"],
        ["Company", d.company || "—"],
        ["Company size", `${d.companySize} employees`],
        ["Service interest", d.service],
        ["Lead ID", d.leadId],
      ])}
      <p style="margin:18px 0 6px 0;font-size:12px;font-weight:700;color:${C.textMuted};text-transform:uppercase;letter-spacing:1px;">Message</p>
      ${quoteBlock(d.message)}
      ${
        d.approveUrl
          ? `<p style="margin:18px 0 12px 0;font-size:13px;color:${C.textMuted};line-height:1.55;">
              Looks legitimate? Click the green button to send <strong>${escape(d.firstName)}</strong> a branded "thanks, we'll reply within one working day" auto-reply. Otherwise just reply directly or ignore.
            </p>`
          : ""
      }
    `,
    cta: { label: `Reply to ${d.firstName} →`, href: `mailto:${d.email}?subject=Re:%20Your%20enquiry%20with%20Vaishnavi%20Consultant`, tone: "primary" },
    secondaryCta: d.approveUrl
      ? { label: `✓ Approve & send auto-reply`, href: d.approveUrl, tone: "approve" }
      : undefined,
  });
}

/* ─── auto-reply to the lead (sent after staff approval) ─── */

export interface AutoReplyEmail {
  firstName: string;
}

export function renderAutoReplyEmail(d: AutoReplyEmail): string {
  return shell({
    preheader: `Thanks for reaching out, ${d.firstName} — we'll be in touch within 1 working day.`,
    badge: "We received your message",
    title: `Thanks for reaching out, <span style="color:${C.teal600};">${escape(d.firstName)}</span>.`,
    body: `
      <p style="margin:0 0 14px 0;">Your message landed safely with our team. A senior consultant has read it personally and will reply to you within <strong>one working day</strong> — that's a promise we honour for every enquiry.</p>
      <p style="margin:0 0 14px 0;">In the meantime, here's what happens next:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px 0;background:${C.cloud};border-radius:14px;overflow:hidden;border:1px solid ${C.border};">
        <tr>
          <td style="padding:14px 18px;font-size:14px;color:${C.navy900};">
            <strong style="color:${C.teal600};">Within 24 hours</strong> · A senior consultant studies your context and emails you back with first thoughts.
          </td>
        </tr>
        <tr>
          <td style="padding:14px 18px;font-size:14px;color:${C.navy900};border-top:1px solid ${C.border};">
            <strong style="color:${C.teal600};">Within 3 days</strong> · We schedule a free 45-minute compliance audit if it's a fit.
          </td>
        </tr>
        <tr>
          <td style="padding:14px 18px;font-size:14px;color:${C.navy900};border-top:1px solid ${C.border};">
            <strong style="color:${C.teal600};">No pressure</strong> · No sales follow-up unless you ask for one. We mean it.
          </td>
        </tr>
      </table>
      <p style="margin:18px 0 0 0;color:${C.textMuted};font-size:13px;">
        If you'd rather talk first, our partners are reachable directly on
        <a href="tel:${escape(COMPANY.contact.phone.replace(/\s/g, ""))}" style="color:${C.navy700};text-decoration:none;font-weight:600;">${escape(COMPANY.contact.phone)}</a>,
        Mon–Sat, 9:30 AM – 7:00 PM IST.
      </p>
    `,
  });
}

export function renderAutoReplyText(d: AutoReplyEmail): string {
  return [
    `Hi ${d.firstName},`,
    "",
    `Thanks for reaching out to ${COMPANY.name}. Your message landed safely with our team — a senior consultant has read it personally and will reply within one working day.`,
    "",
    "What happens next:",
    "  • Within 24 hours — a senior consultant emails you back with first thoughts.",
    "  • Within 3 days — we schedule a free 45-minute compliance audit if it's a fit.",
    "  • No pressure — no sales follow-up unless you ask.",
    "",
    `If you'd rather talk first, reach us on ${COMPANY.contact.phone}, Mon-Sat 9:30 AM - 7:00 PM IST.`,
    "",
    "—",
    `${COMPANY.legalName} · ${COMPANY.contact.address.city}`,
    "vaishnaviconsultant.com",
  ].join("\n");
}

/* ─── plain-text fallback (for clients that block HTML) ─── */

export function renderContactLeadText(d: ContactLeadEmail): string {
  return [
    `New website enquiry — ${COMPANY.name}`,
    "",
    `Name:         ${d.firstName} ${d.lastName}`,
    `Email:        ${d.email}`,
    `Phone:        ${d.phone || "—"}`,
    `Company:      ${d.company || "—"}`,
    `Size:         ${d.companySize} employees`,
    `Service:      ${d.service}`,
    `Lead ID:      ${d.leadId}`,
    "",
    "Message:",
    d.message,
    "",
    "—",
    `${COMPANY.legalName} · ${COMPANY.contact.address.city}`,
  ].join("\n");
}

