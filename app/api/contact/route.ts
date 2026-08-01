import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { forwardContactMessage } from "@/lib/email";
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

  const { fullName, email, phone, subject, message, locale } = parsed.data;
  const now = new Date();

  await db.insert(contactSubmissions).values({
    id: randomUUID(),
    fullName,
    email,
    phone: phone || null,
    subject,
    message,
    locale,
  });

  try {
    await forwardContactMessage({
      fullName,
      email,
      phone: phone || null,
      subject,
      message,
      submittedAt: now,
      locale,
    });
  } catch (error) {
    console.error("[contact] Email forward failed:", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}