import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { contactSchema } from "@/lib/forms";

const requestSchema = contactSchema.extend({
  locale: z.enum(["en", "tr"]),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }
  if (parsed.data.companyWebsite) return NextResponse.json({ ok: true });

  await db.insert(contactSubmissions).values({
    id: randomUUID(),
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
    locale: parsed.data.locale,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
