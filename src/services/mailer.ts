/**
 * Transactional mailer — Google Workspace SMTP via Nodemailer.
 *
 * Auth uses a single Workspace user (e.g. harihar@vaishnaviconsultant.com)
 * with a Google **App Password**, but the visible "From" displays an alias
 * (connect@vaishnaviconsultant.com) configured on that same account.
 *
 * Required env (see .env.example):
 *   SMTP_USER          — Workspace login email (real mailbox)
 *   SMTP_PASS          — Google App Password (16-char, no spaces)
 *   MAIL_FROM_NAME     — Display name, e.g. "Vaishnavi Consultant"
 *   MAIL_FROM_ADDRESS  — Alias to show as From, e.g. connect@…
 *   LEAD_TO            — Inbox that receives lead notifications
 */

import nodemailer, { type Transporter } from "nodemailer";

interface MailerEnv {
  user: string;
  pass: string;
  fromName: string;
  fromAddress: string;
  leadTo: string;
}

function readEnv(): MailerEnv | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.MAIL_FROM_NAME ?? "Vaishnavi Consultant";
  const fromAddress = process.env.MAIL_FROM_ADDRESS ?? user;
  const leadTo = process.env.LEAD_TO ?? fromAddress;

  if (!user || !pass || !fromAddress || !leadTo) return null;
  return { user, pass, fromName, fromAddress, leadTo };
}

let cached: Transporter | null = null;

function getTransport(env: MailerEnv): Transporter {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") !== "false",
    auth: { user: env.user, pass: env.pass },
  });
  return cached;
}

export interface SendArgs {
  subject: string;
  html: string;
  text: string;
  /** Lead's email — so a one-tap "Reply" in the inbox replies to the lead. */
  replyTo?: string;
  /** Override the recipient. Defaults to LEAD_TO (internal notification). */
  to?: string;
  /** Override From display name. Defaults to MAIL_FROM_NAME env. */
  fromName?: string;
  /** Override From address. Defaults to MAIL_FROM_ADDRESS env. */
  fromAddress?: string;
}

export interface SendResult {
  ok: boolean;
  /** Set when SMTP isn't configured — caller may degrade gracefully. */
  skipped?: boolean;
  /** Nodemailer message id when ok. */
  messageId?: string;
  error?: string;
}

export async function sendLeadEmail(args: SendArgs): Promise<SendResult> {
  const env = readEnv();
  if (!env) {
    // Surface a loud server log but don't break the user-facing form —
    // the lead is still validated and returned with an id, so support can
    // backfill once SMTP is configured in Vercel.
    console.warn("[mailer] SMTP env not configured — email skipped.");
    return { ok: true, skipped: true };
  }

  try {
    const fromName = args.fromName?.trim() || env.fromName;
    const fromAddress = args.fromAddress?.trim() || env.fromAddress;
    const info = await getTransport(env).sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: args.to ?? env.leadTo,
      replyTo: args.replyTo,
      subject: args.subject,
      html: args.html,
      text: args.text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown SMTP error";
    console.error("[mailer] sendMail failed:", message);
    return { ok: false, error: message };
  }
}
