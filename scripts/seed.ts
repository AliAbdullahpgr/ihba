import { randomUUID } from "crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { projectImages } from "../app/components/pages/projectImages";
import { content } from "../lib/content";
import { db } from "../lib/db/client";
import {
  account,
  boardMembers,
  projectTranslations,
  projects,
  siteContent,
  user,
} from "../lib/db/schema";
import { dict, type Lang } from "../lib/i18n";

const ADMIN_EMAIL = "admin@ihba.local";
const ADMIN_PASSWORD = "IHBA-Admin-2026!";
const ADMIN_NAME = "IHBA Administrator";
const locales: Lang[] = ["en", "tr"];

async function seedContent() {
  for (const locale of locales) {
    const document = { ...dict[locale], ...content[locale] };
    await db
      .insert(siteContent)
      .values({ locale, document })
      .onConflictDoNothing();
  }

  const englishProjects = content.en.projectsPage.details;
  for (const [index, english] of englishProjects.entries()) {
    const id = `project_${english.slug}`;
    const image = projectImages[english.slug];
    await db
      .insert(projects)
      .values({
        id,
        slug: english.slug,
        state: "published",
        imageUrl: image?.src,
        sortOrder: index,
        publishedAt: new Date(),
      })
      .onConflictDoNothing();

    for (const locale of locales) {
      const detail = content[locale].projectsPage.details[index];
      const card = dict[locale].projects.cards[index];
      await db
        .insert(projectTranslations)
        .values({
          projectId: id,
          locale,
          title: detail.title,
          region: detail.region,
          statusLabel: detail.status,
          summary: detail.body[0] ?? "",
          body: detail.body,
          facts: detail.facts,
          chips: card?.chips ?? [],
          imageAlt: image?.alt ?? detail.title,
        })
        .onConflictDoNothing();
    }
  }

  for (const [index, member] of content.en.boardPage.members.entries()) {
    const id = `board_${index + 1}`;
    await db
      .insert(boardMembers)
      .values({
        id,
        name: member.name,
        roleEn: member.role,
        roleTr: content.tr.boardPage.members[index]?.role ?? member.role,
        sortOrder: index,
      })
      .onConflictDoNothing();
  }
}

async function seedAdmin() {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, ADMIN_EMAIL),
  });

  if (!existing) {
    const id = randomUUID();
    const now = new Date();
    await db.insert(user).values({
      id,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      emailVerified: true,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });
    await db.insert(account).values({
      id: randomUUID(),
      accountId: id,
      providerId: "credential",
      userId: id,
      password: await hashPassword(ADMIN_PASSWORD),
      createdAt: now,
      updatedAt: now,
    });
  }

  await db
    .update(user)
    .set({ role: "admin", emailVerified: true, updatedAt: new Date() })
    .where(eq(user.email, ADMIN_EMAIL));
}

async function main() {
  await seedContent();
  await seedAdmin();
  console.log("Seed complete.");
  console.log(`Admin email: ${ADMIN_EMAIL}`);
  console.log(`Temporary password: ${ADMIN_PASSWORD}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
