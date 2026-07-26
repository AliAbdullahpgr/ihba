import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";

const requestSchema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(["en", "tr"]),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();
  await db
    .insert(newsletterSubscribers)
    .values({ id: randomUUID(), email, locale: parsed.data.locale })
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: { active: true, locale: parsed.data.locale },
    });
  return NextResponse.json({ ok: true }, { status: 201 });
}
