"use server";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Copy } from "@/app/components/LanguageProvider";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db/client";
import {
  auditLogs,
  boardMembers,
  contactSubmissions,
  newsArticles,
  newsTranslations,
  projectTranslations,
  projects,
  siteContent,
  siteMedia,
  volunteerApplications,
} from "@/lib/db/schema";
import type { Lang } from "@/lib/i18n";
import { mediaLabels, type SiteMediaKey } from "@/lib/media";

const stateSchema = z.enum(["draft", "published", "archived"]);
const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

function text(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function paragraphs(value: string) {
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function chips(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function facts(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.split("|").map((item) => item.trim()))
    .filter(([label, value]) => label && value)
    .map(([label, value]) => ({ label, value }));
}

async function audit(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string
) {
  await db.insert(auditLogs).values({
    id: randomUUID(),
    userId,
    action,
    entityType,
    entityId,
  });
}

function refreshPublic(...paths: string[]) {
  revalidateTag("site-content");
  for (const path of paths) revalidatePath(path);
}

export async function saveProject(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const slug = slugSchema.parse(text(form, "slug"));
  const state = stateSchema.parse(text(form, "state"));
  const imageUrl = text(form, "imageUrl") || null;
  const imagePublicId = text(form, "imagePublicId") || null;
  const sortOrder = z.coerce.number().int().min(0).parse(text(form, "sortOrder"));

  const translations = (["en", "tr"] as const).map((locale) => {
    const title = z.string().min(2).parse(text(form, `title_${locale}`));
    const body = paragraphs(text(form, `body_${locale}`));
    return {
      locale,
      title,
      region: z.string().min(2).parse(text(form, `region_${locale}`)),
      statusLabel: z
        .string()
        .min(2)
        .parse(text(form, `statusLabel_${locale}`)),
      summary: z
        .string()
        .min(10)
        .parse(text(form, `summary_${locale}`)),
      body: body.length ? body : [text(form, `summary_${locale}`)],
      facts: facts(text(form, `facts_${locale}`)),
      chips: chips(text(form, `chips_${locale}`)),
      imageAlt: z
        .string()
        .min(3)
        .parse(text(form, `imageAlt_${locale}`)),
    };
  });

  await db.transaction(async (tx) => {
    await tx
      .insert(projects)
      .values({
        id,
        slug,
        state,
        imageUrl,
        imagePublicId,
        sortOrder,
        publishedAt: state === "published" ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          slug,
          state,
          imageUrl,
          imagePublicId,
          sortOrder,
          publishedAt: state === "published" ? new Date() : null,
          updatedAt: new Date(),
        },
      });

    for (const translation of translations) {
      await tx
        .insert(projectTranslations)
        .values({ projectId: id, ...translation })
        .onConflictDoUpdate({
          target: [
            projectTranslations.projectId,
            projectTranslations.locale,
          ],
          set: translation,
        });
    }
  });

  await audit(session.user.id, "save", "project", id);
  refreshPublic("/", "/projects", `/projects/${slug}`);
  redirect("/admin/projects");
}

export async function archiveProject(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db
    .update(projects)
    .set({ state: "archived", updatedAt: new Date() })
    .where(eq(projects.id, id));
  await audit(session.user.id, "archive", "project", id);
  refreshPublic("/", "/projects");
  redirect("/admin/projects");
}

export async function saveNews(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const slug = slugSchema.parse(text(form, "slug"));
  const state = stateSchema.parse(text(form, "state"));
  const imageUrl = text(form, "imageUrl") || null;
  const imagePublicId = text(form, "imagePublicId") || null;
  const translations = (["en", "tr"] as const).map((locale) => ({
    locale,
    title: z.string().min(2).parse(text(form, `title_${locale}`)),
    excerpt: z.string().min(10).parse(text(form, `excerpt_${locale}`)),
    body: paragraphs(text(form, `body_${locale}`)),
    imageAlt: z.string().min(3).parse(text(form, `imageAlt_${locale}`)),
  }));

  await db.transaction(async (tx) => {
    await tx
      .insert(newsArticles)
      .values({
        id,
        slug,
        state,
        imageUrl,
        imagePublicId,
        publishedAt: state === "published" ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: newsArticles.id,
        set: {
          slug,
          state,
          imageUrl,
          imagePublicId,
          publishedAt: state === "published" ? new Date() : null,
          updatedAt: new Date(),
        },
      });

    for (const translation of translations) {
      await tx
        .insert(newsTranslations)
        .values({ articleId: id, ...translation })
        .onConflictDoUpdate({
          target: [newsTranslations.articleId, newsTranslations.locale],
          set: translation,
        });
    }
  });

  await audit(session.user.id, "save", "news", id);
  refreshPublic("/news", `/news/${slug}`);
  redirect("/admin/news");
}

export async function archiveNews(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db
    .update(newsArticles)
    .set({ state: "archived", updatedAt: new Date() })
    .where(eq(newsArticles.id, id));
  await audit(session.user.id, "archive", "news", id);
  refreshPublic("/news");
  redirect("/admin/news");
}

export async function saveBoardMember(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const values = {
    name: z.string().min(2).parse(text(form, "name")),
    roleEn: z.string().min(2).parse(text(form, "roleEn")),
    roleTr: z.string().min(2).parse(text(form, "roleTr")),
    sortOrder: z.coerce
      .number()
      .int()
      .min(0)
      .parse(text(form, "sortOrder")),
    visible: form.get("visible") === "on",
  };
  await db
    .insert(boardMembers)
    .values({ id, ...values })
    .onConflictDoUpdate({
      target: boardMembers.id,
      set: { ...values, updatedAt: new Date() },
    });
  await audit(session.user.id, "save", "board_member", id);
  refreshPublic("/board");
  redirect("/admin/board");
}

export async function removeBoardMember(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.delete(boardMembers).where(eq(boardMembers.id, id));
  await audit(session.user.id, "delete", "board_member", id);
  refreshPublic("/board");
  redirect("/admin/board");
}

function setAtPath(target: Record<string, unknown>, path: Array<string | number>, value: string) {
  let current: unknown = target;
  for (let index = 0; index < path.length - 1; index += 1) {
    current = (current as Record<string | number, unknown>)[path[index]];
  }
  (current as Record<string | number, unknown>)[path.at(-1)!] = value;
}

export async function saveSiteContent(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  const document = structuredClone(row.document) as Record<string, unknown>;
  for (const [key, value] of form.entries()) {
    if (!key.startsWith("field:") || typeof value !== "string") continue;
    const path = z
      .array(z.union([z.string(), z.number().int().nonnegative()]))
      .min(1)
      .parse(JSON.parse(decodeURIComponent(key.slice(6))));
    setAtPath(document, path, value.trim());
  }

  await db
    .update(siteContent)
    .set({
      document,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(siteContent.locale, locale));
  await audit(session.user.id, "save", "site_content", locale);
  refreshPublic(
    "/",
    "/about",
    "/areas-of-work",
    "/board",
    "/president",
    "/projects",
    "/news",
    "/donate",
    "/volunteer",
    "/contact"
  );
  redirect(`/admin/content/${locale}?saved=1`);
}

export async function updateSubmissionStatus(form: FormData) {
  const session = await requireAdmin();
  const type = z.enum(["contact", "volunteer"]).parse(text(form, "type"));
  const id = text(form, "id");
  if (type === "contact") {
    const status = z
      .enum(["new", "read", "resolved"])
      .parse(text(form, "status"));
    await db
      .update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id));
  } else {
    const status = z
      .enum(["new", "reviewing", "closed"])
      .parse(text(form, "status"));
    await db
      .update(volunteerApplications)
      .set({ status })
      .where(eq(volunteerApplications.id, id));
  }
  await audit(session.user.id, "status", `${type}_submission`, id);
  revalidatePath("/admin/submissions");
}

export async function saveSiteMedia(form: FormData) {
  const session = await requireAdmin();
  const key = text(form, "key") as SiteMediaKey;
  if (!(key in mediaLabels)) throw new Error("Unknown media key");
  const imageUrl = z.string().url().parse(text(form, "imageUrl"));
  const imagePublicId = z.string().min(1).parse(text(form, "imagePublicId"));

  await db
    .insert(siteMedia)
    .values({
      key,
      imageUrl,
      imagePublicId,
      updatedBy: session.user.id,
    })
    .onConflictDoUpdate({
      target: siteMedia.key,
      set: {
        imageUrl,
        imagePublicId,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
    });
  await audit(session.user.id, "save", "site_media", key);
  refreshPublic(
    "/",
    "/about",
    "/areas-of-work",
    "/donate",
    "/volunteer"
  );
  redirect("/admin/media");
}
