import "server-only";

import nodemailer from "nodemailer";

/**
 * The corporate inbox that all contact-form messages are forwarded to.
 * Visible in the admin panel and configurable via environment variable so
 * it can be changed without a deploy.
 */
export const CONTACT_FORWARD_EMAIL =
  process.env.CONTACT_FORWARD_EMAIL ?? "info@insanlikkoprusu.org";

/** From address used for forwarded contact messages — must be authorised by the SMTP provider. */
const FROM_ADDRESS =
  process.env.SMTP_FROM_ADDRESS ?? `noreply@insanlikkoprusu.org`;

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const hasCredentials = Boolean(smtpHost && smtpUser && smtpPass);

const transporter = hasCredentials
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })
  : null;

export interface ContactMessageDetails {
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  submittedAt: Date;
  locale: string;
}

/**
 * Forwards a contact-form submission to the corporate inbox.
 * When SMTP credentials are not configured the function logs a warning and
 * returns gracefully so the public form still saves to the database.
 */
export async function forwardContactMessage(
  details: ContactMessageDetails
): Promise<void> {
  if (!transporter) {
    console.warn(
      "[email] SMTP credentials not configured — contact message was saved but NOT forwarded."
    );
    return;
  }

  const { fullName, email, phone, subject, message, submittedAt, locale } =
    details;

  const text = [
    `New contact form message — ${locale.toUpperCase()}`,
    "───────────────────────────────────────",
    `Date:  ${submittedAt.toLocaleString("en-GB")}`,
    `Name:  ${fullName}`,
    `Email: ${email}`,
    phone ? `Phone:  ${phone}` : null,
    "",
    `Subject: ${subject}`,
    "",
    message,
    "",
    "───────────────────────────────────────",
    "This message was submitted through the IHBA website contact form.",
  ]
    .filter(Boolean)
    .join("\r\n");

  const html = [
    `<div style="font-family:system-ui,sans-serif;max-width:36rem;color:#1a1a1a">`,
    `<h2 style="margin-bottom:1rem">New contact form message</h2>`,
    `<table style="font-size:14px;border-collapse:collapse;margin-bottom:1.5rem">`,
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#666">Date</td><td>${escapeHtml(submittedAt.toLocaleString("en-GB"))}</td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#666">Name</td><td>${escapeHtml(fullName)}</td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>`,
    phone
      ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#666">Phone</td><td>${escapeHtml(phone)}</td></tr>`
      : "",
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#666">Subject</td><td>${escapeHtml(subject)}</td></tr>`,
    `</table>`,
    `<hr style="border:none;border-top:1px solid #ddd;margin:1rem 0" />`,
    `<p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>`,
    `<hr style="border:none;border-top:1px solid #ddd;margin:1rem 0" />`,
    `<p style="font-size:12px;color:#999">This message was submitted through the IHBA website contact form.</p>`,
    `</div>`,
  ]
    .filter(Boolean)
    .join("");

  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: CONTACT_FORWARD_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to forward contact message:", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}