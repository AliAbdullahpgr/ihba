import { z } from "zod";

/**
 * Form schemas and the compose step they share.
 *
 * The site is a static export (`output: "export"` in next.config.ts), so there
 * is no server to receive a POST and nowhere safe to hold a mail credential.
 * Rather than route the association's post through an outside form service,
 * both forms hand the finished message to the reader's own mail app: on submit
 * the answers are laid out as a message and opened as a draft addressed to the
 * association, and the reader presses Send there.
 *
 * The cost is one extra press, and that the sender's own address is the one the
 * mail arrives from — which is what we want to reply to anyway. Nothing leaves
 * the browser until the reader sends it, and no third party sees it at all.
 */

/*
  Honeypot. A field that is present in the DOM but invisible and untabbable, so
  a person never fills it and a naive bot fills everything. Anything non-empty
  is rejected before a draft is composed — cheap, and it needs no third-party
  script or puzzle from the reader.
*/
const honeypot = z.string().max(0).optional().or(z.literal(""));

export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(4000),
  companyWebsite: honeypot,
});

export const volunteerSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(120),
  areaOfInterest: z.string().trim().min(1),
  availability: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  companyWebsite: honeypot,
});

export type ContactValues = z.input<typeof contactSchema>;
export type VolunteerValues = z.input<typeof volunteerSchema>;

/**
 * Maps a Zod issue set to `{ field: messageKey }`.
 *
 * Only the key travels; the wording is resolved from the dictionary at render
 * time so validation messages are translated like everything else rather than
 * being frozen into the schema in one language.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (!field || out[field]) continue;

    if (field === "consent") out[field] = "consent";
    else if (issue.code === "invalid_string" && issue.validation === "email") {
      out[field] = "email";
    } else if (issue.code === "too_small") out[field] = "short";
    else if (issue.code === "too_big") out[field] = "long";
    else out[field] = "invalid";
  }

  return out;
}

export type SubmitState = "idle" | "sent";

/** One labelled answer, as it should read in the message body. */
export type MailLine = { label: string; value: string };

/**
 * Lays the answers out as a plain-text message and returns it as a mailto URL.
 *
 * Labels come from the caller rather than from the schema, so the message the
 * association receives is written in the language the sender was reading.
 * Short answers sit one per line and the long one goes last under its own
 * heading, which is the shape a person skimming an inbox expects.
 */
export function composeMailto({
  to,
  subject,
  lines,
  bodyLabel,
  body,
}: {
  to: string;
  subject: string;
  lines: MailLine[];
  bodyLabel: string;
  body: string;
}): string {
  const text = [
    ...lines
      .filter((line) => line.value.trim())
      .map((line) => `${line.label}: ${line.value.trim()}`),
    "",
    `${bodyLabel}:`,
    body.trim(),
  ].join("\r\n");

  /*
    encodeURIComponent is right for both parts: it escapes the newlines, the
    ampersands and the Turkish characters that would otherwise end the header
    or break the query string.
  */
  return `mailto:${to}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(text)}`;
}
