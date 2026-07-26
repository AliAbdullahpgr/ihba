import { z } from "zod";

/** Shared browser and API validation for contact and volunteer submissions. */

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
