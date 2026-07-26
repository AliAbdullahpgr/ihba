import { z } from "zod";

/**
 * Form schemas and the single submit path they share.
 *
 * The site is a static export (`output: "export"` in next.config.ts), so there
 * is no server to receive a POST and no place to hold an SMTP credential. Both
 * forms therefore post to an external form-to-email endpoint named in
 * NEXT_PUBLIC_FORM_ENDPOINT — Formspree, Web3Forms, Basin and Netlify Forms all
 * accept a plain JSON body and will deliver to the association's inbox.
 *
 * With no endpoint configured the forms do not pretend to work: they render a
 * notice and the mailto route instead, which is what was there before.
 */

export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

/*
  Honeypot. A field that is present in the DOM but invisible and untabbable, so
  a person never fills it and a naive bot fills everything. Anything non-empty
  is rejected before the network call — cheap, and it needs no third-party
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

export type SubmitState = "idle" | "sending" | "sent" | "error";

/** Posts a validated payload as JSON. Returns false on any non-2xx or network fault. */
export async function submitForm(
  payload: Record<string, unknown>
): Promise<boolean> {
  if (!FORM_ENDPOINT) return false;

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
