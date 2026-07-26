import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { volunteerApplications } from "@/lib/db/schema";
import { volunteerSchema } from "@/lib/forms";

const requestSchema = volunteerSchema.extend({
  locale: z.enum(["en", "tr"]),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }
  if (parsed.data.companyWebsite) return NextResponse.json({ ok: true });

  await db.insert(volunteerApplications).values({
    id: randomUUID(),
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    city: parsed.data.city,
    areaOfInterest: parsed.data.areaOfInterest,
    availability: parsed.data.availability,
    message: parsed.data.message,
    consent: parsed.data.consent,
    locale: parsed.data.locale,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
