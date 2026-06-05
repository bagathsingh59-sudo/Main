import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/services/mailer";
import { getSiteSettings } from "@/services/settings";
import { verifyApproval } from "@/utils/approvalToken";
import { renderAutoReplyEmail, renderAutoReplyText } from "@/utils/emailTemplates";

export const runtime = "nodejs";

/**
 * One-click auto-reply approval endpoint.
 *
 * Flow:
 *   1. Staff opens lead notification email in harihar@'s inbox.
 *   2. Clicks the green "Approve & send auto-reply" button.
 *   3. Lands here with a signed token in the query string.
 *   4. We verify the HMAC, send the branded auto-reply to the lead,
 *      and return a small confirmation HTML page.
 *
 * No DB — the token IS the state. Same token sent twice will send two
 * auto-replies; that's an acceptable trade-off for a single-staff
 * workflow (no concurrent approvals, no risk of accidental re-clicks
 * destroying anything).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return htmlResponse({
      kind: "error",
      title: "Missing approval token",
      message: "This approval link is incomplete. Re-open the latest enquiry email and try the button again.",
    });
  }

  const result = verifyApproval(token);
  if (!result.ok) {
    const reasons: Record<typeof result.reason, { title: string; body: string }> = {
      malformed: {
        title: "Invalid approval link",
        body: "This link doesn't look right. Open the latest enquiry email and click the green button there.",
      },
      bad_signature: {
        title: "Invalid approval link",
        body: "This link's signature didn't verify — it may have been tampered with. Open the original email and try again.",
      },
      expired: {
        title: "Approval link expired",
        body: "Approval links are valid for 7 days. To reply to this lead, just hit reply on the original email manually.",
      },
      not_configured: {
        title: "Approval feature not configured",
        body: "APPROVAL_SECRET is not set in this deployment. Set it in Vercel env vars and redeploy.",
      },
    };
    const r = reasons[result.reason];
    return htmlResponse({ kind: "error", title: r.title, message: r.body });
  }

  const { email, firstName } = result.payload;
  const settings = await getSiteSettings();
  const autoTmpl = settings.emailTemplates.autoReply;
  const subject = autoTmpl.subjectPattern.replace(/\{firstName\}/g, firstName);

  const mail = await sendLeadEmail({
    to: email,
    subject,
    html: renderAutoReplyEmail({
      firstName,
      contactInfo: settings.contactInfo,
      template: autoTmpl,
    }),
    text: renderAutoReplyText({ firstName, contactInfo: settings.contactInfo }),
    fromName: settings.automation.fromName || undefined,
    fromAddress: settings.automation.fromAddress || undefined,
    // Replies to the auto-reply land on connect@ (default From), which
    // is exactly what we want — the staff inbox.
  });

  if (!mail.ok) {
    return htmlResponse({
      kind: "error",
      title: "Couldn't send the auto-reply",
      message: "SMTP returned an error. Check Vercel function logs for the exact reason.",
    });
  }

  return htmlResponse({
    kind: "success",
    title: "Auto-reply sent ✓",
    message: `Your branded acknowledgement is on its way to <strong>${escapeHtml(firstName)}</strong> at <strong>${escapeHtml(email)}</strong>. You can close this tab.`,
  });
}

/* ─── tiny self-contained HTML page (no client JS) ─── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlResponse({
  kind,
  title,
  message,
}: {
  kind: "success" | "error";
  title: string;
  message: string;
}): NextResponse {
  const accent = kind === "success" ? "#10b981" : "#dc2626";
  const accentBg = kind === "success" ? "#ecfdf5" : "#fef2f2";
  const icon = kind === "success" ? "✓" : "!";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="robots" content="noindex,nofollow" />
    <title>${escapeHtml(title)} — Vaishnavi Consultant</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
        background: linear-gradient(165deg,#dce8ff 0%,#eef2ff 50%,#e0f7fa 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
        color: #0b1f3a; }
      .card { width: 100%; max-width: 480px; background: #fff; border-radius: 24px;
        padding: 36px; box-shadow: 0 20px 60px rgba(11,31,58,0.18); text-align: center; }
      .icon { width: 64px; height: 64px; border-radius: 50%; background: ${accentBg};
        color: ${accent}; display: grid; place-items: center; margin: 0 auto 18px;
        font-size: 32px; font-weight: 700; }
      h1 { margin: 0 0 12px; font-size: 22px; letter-spacing: -0.01em; }
      p { margin: 0; color: #5b6b85; font-size: 15px; line-height: 1.6; }
      .brand { margin-top: 24px; padding-top: 20px; border-top: 1px solid #e3e9f5;
        font-size: 12px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">${icon}</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${message}</p>
      <div class="brand">Vaishnavi Consultant</div>
    </div>
  </body>
</html>`;

  return new NextResponse(html, {
    status: kind === "success" ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
