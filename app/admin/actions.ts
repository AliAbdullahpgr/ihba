"use server";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-guard";
import { content } from "@/lib/content";
import { db } from "@/lib/db/client";
import {
  ORG_SETTINGS_ID,
  auditLogs,
  bankAccounts,
  boardMembers,
  contactSubmissions,
  galleryItems,
  galleryTranslations,
  newsArticles,
  newsTranslations,
  orgSettings,
  projectImages,
  projectTranslations,
  projects,
  siteContent,
  siteMedia,
  socialAccounts,
  volunteerApplications,
  type AuditFieldChange,
  type AuditMetadata,
} from "@/lib/db/schema";
import { MAX_ACTIVE_HERO_SLIDES } from "@/lib/hero-slides";
import { HOMEPAGE_SECTION_LIMIT, readHomepageSelection } from "@/lib/homepage-sections";
import { dict } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";
import { mediaLabels, type SiteMediaKey } from "@/lib/media";
import {
  bankFieldDefs,
  formatIban,
  normaliseIban,
  orgFieldDefs,
} from "@/lib/org-settings";
import { parseRichTextBlocks } from "@/lib/rich-text";
import { isValidLinkTarget } from "@/lib/site-links";

const stateSchema = z.enum(["draft", "published", "archived"]);
const lifecycleSchema = z.enum(["ongoing", "completed", "inactive"]);
const projectImageSchema = z.object({
  id: z.string().trim().max(120).optional().default(""),
  imageUrl: z.string().trim().min(1).max(1200),
  imagePublicId: z.string().trim().max(300).optional().default(""),
  captionTr: z.string().trim().max(300).optional().default(""),
  captionEn: z.string().trim().max(300).optional().default(""),
  altTr: z.string().trim().max(300).optional().default(""),
  altEn: z.string().trim().max(300).optional().default(""),
});
/*
  Button targets are chosen from a dropdown in the admin, but "custom address"
  is one of the choices, so the value still gets checked here. This rejects
  `javascript:` and protocol-relative URLs rather than trusting the client.
*/
const linkTargetSchema = z
  .string()
  .trim()
  .min(1, "Buton adresi boş olamaz.")
  .max(300)
  .refine(isValidLinkTarget, "Buton adresi geçerli değil. Site içi adresler / ile başlamalıdır.");

const heroSlideSchema = z.object({
  id: z.string().trim().min(1).max(120).optional().default(""),
  headline: z.object({
    pre: z.string().max(180),
    highlight: z.string().max(180),
    post: z.string().max(180),
  }),
  subcopy: z.string().trim().min(2).max(700),
  ctaPrimary: z.string().trim().min(1).max(80),
  ctaPrimaryHref: linkTargetSchema,
  ctaSecondary: z.string().trim().min(1).max(80),
  ctaSecondaryHref: linkTargetSchema,
  imageKey: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().max(1200).optional().default(""),
  imagePublicId: z.string().trim().max(300).optional().default(""),
  alt: z.string().trim().max(300).optional().default(""),
  active: z.boolean().optional().default(true),
});
const heroSlideTrashSchema = heroSlideSchema.extend({
  deletedAt: z.string().trim().min(1).max(80),
});
const optionalIbanSchema = z.string().trim().max(60).refine((value) => !value || /^[A-Z]{2}[0-9]{2}[A-Z0-9 ]{10,52}$/i.test(value), "IBAN biçimini kontrol edin.");
const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

function text(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
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
  entityId?: string,
  metadata?: AuditMetadata
) {
  await db.insert(auditLogs).values({
    id: randomUUID(),
    userId,
    action,
    entityType,
    entityId,
    // Only stored when a caller actually computed a diff; a bare save still
    // records who/what/when, as it always did.
    metadata: metadata?.changes?.length || metadata?.summary ? metadata : null,
  });
}

/**
 * Compares a settings record before and after a save and returns one entry per
 * field that genuinely moved. Used both to write the audit trail and — via the
 * same field definitions — to show the operator a confirmation diff first.
 */
export type DiffField = {
  field: string;
  label: string;
  sensitive?: boolean;
};

function diffRecords(
  fields: DiffField[],
  before: Record<string, unknown>,
  after: Record<string, unknown>
): AuditFieldChange[] {
  const asText = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Açık" : "Kapalı";
    return String(value).trim();
  };
  return fields
    .map(({ field, label, sensitive }) => ({
      field,
      label,
      from: asText(before[field]),
      to: asText(after[field]),
      sensitive,
    }))
    .filter((change) => change.from !== change.to);
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
  const lifecycle = lifecycleSchema.parse(text(form, "lifecycle") || "ongoing");
  const featured = form.get("featured") === "on";
  const imageUrl = text(form, "imageUrl") || null;
  const imagePublicId = text(form, "imagePublicId") || null;
  const sortOrder = z.coerce.number().int().min(0).parse(text(form, "sortOrder"));

  const rawGallery = text(form, "galleryImages");
  const gallery = z
    .array(projectImageSchema)
    .max(40)
    .parse(rawGallery ? JSON.parse(rawGallery) : []);

  const turkishBody = parseRichTextBlocks(text(form, "body_tr"));
  const turkish = {
    locale: "tr" as const,
    title: z.string().min(2).parse(text(form, "title_tr")),
    region: z.string().min(2).parse(text(form, "region_tr")),
    statusLabel: z.string().min(2).parse(text(form, "statusLabel_tr")),
    summary: z.string().min(10).parse(text(form, "summary_tr")),
    body: turkishBody.length
      ? turkishBody
      : [text(form, "summary_tr")],
    facts: facts(text(form, "facts_tr")),
    chips: chips(text(form, "chips_tr")),
    imageAlt: z.string().min(3).parse(text(form, "imageAlt_tr")),
  };

  // `body_en` is excluded here on purpose: the editor always posts a JSON
  // array, so its raw value is a non-empty "[]" even when nothing was written.
  // Emptiness has to be judged after parsing.
  const englishValues = [
    "title_en",
    "region_en",
    "statusLabel_en",
    "summary_en",
    "facts_en",
    "chips_en",
    "imageAlt_en",
  ].map((name) => text(form, name));
  const englishBody = parseRichTextBlocks(text(form, "body_en"));
  const hasEnglish = englishValues.some(Boolean) || englishBody.length > 0;
  const englishFacts = facts(text(form, "facts_en"));
  const englishChips = chips(text(form, "chips_en"));
  const english = hasEnglish
    ? {
        locale: "en" as const,
        title: text(form, "title_en") || turkish.title,
        region: text(form, "region_en") || turkish.region,
        statusLabel:
          text(form, "statusLabel_en") || turkish.statusLabel,
        summary: text(form, "summary_en") || turkish.summary,
        body: englishBody.length ? englishBody : turkish.body,
        facts: englishFacts.length ? englishFacts : turkish.facts,
        chips: englishChips.length ? englishChips : turkish.chips,
        imageAlt: text(form, "imageAlt_en") || turkish.imageAlt,
      }
    : null;
  const translations = english ? [turkish, english] : [turkish];

  await db.transaction(async (tx) => {
    await tx
      .insert(projects)
      .values({
        id,
        slug,
        state,
        lifecycle,
        featured,
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
          lifecycle,
          featured,
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

    // The submitted list is authoritative: rows the operator removed from the
    // draft are deleted, and array position becomes the display order.
    const existingImages = await tx
      .select({ id: projectImages.id })
      .from(projectImages)
      .where(eq(projectImages.projectId, id));
    const keptImageIds = new Set<string>();
    for (const [index, image] of gallery.entries()) {
      const imageId = image.id || randomUUID();
      keptImageIds.add(imageId);
      const row = {
        imageUrl: image.imageUrl,
        imagePublicId: image.imagePublicId || null,
        captionTr: image.captionTr,
        captionEn: image.captionEn,
        altTr: image.altTr,
        altEn: image.altEn,
        sortOrder: index,
        updatedAt: new Date(),
      };
      if (image.id && existingImages.some((candidate) => candidate.id === image.id)) {
        await tx.update(projectImages).set(row).where(eq(projectImages.id, imageId));
      } else {
        await tx.insert(projectImages).values({ id: imageId, projectId: id, ...row });
      }
    }
    for (const existing of existingImages) {
      if (!keptImageIds.has(existing.id)) {
        await tx.delete(projectImages).where(eq(projectImages.id, existing.id));
      }
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
  await audit(session.user.id, "trash", "project", id);
  refreshPublic("/", "/projects");
  redirect("/admin/projects");
}

function parseHeroSlides(value: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("Banner bilgileri okunamadı. Sayfayı yenileyip tekrar deneyin.");
  }
  const slides = z.array(heroSlideSchema).max(12).parse(parsed).map((slide, index) => ({
    ...slide,
    id: slide.id || `slide-${index + 1}-${slide.imageKey}`,
  }));
  const activeCount = slides.filter((slide) => slide.active).length;
  if (activeCount > MAX_ACTIVE_HERO_SLIDES) {
    throw new Error(`Aynı anda en fazla ${MAX_ACTIVE_HERO_SLIDES} banner yayınlanabilir.`);
  }
  /*
    No banner at all leaves the homepage without a headline or a call to
    action. The editor blocks it too, but this is the check that actually
    guards the site.
  */
  if (activeCount === 0) {
    throw new Error("En az bir banner yayında olmalıdır. Kaydetmeden önce bir bannerı yayınlayın.");
  }
  return slides;
}

function parseHeroSlideTrash(value: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value || "[]");
  } catch {
    throw new Error("Çöp kutusu bilgileri okunamadı. Sayfayı yenileyip tekrar deneyin.");
  }
  return z.array(heroSlideTrashSchema).max(50).parse(parsed);
}

export async function restoreProject(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  const state = z.enum(["draft", "published"]).catch("draft").parse(text(form, "state"));
  await db.update(projects).set({ state, updatedAt: new Date() }).where(eq(projects.id, id));
  await audit(session.user.id, "restore", "project", id);
  refreshPublic("/", "/projects");
  redirect("/admin/trash");
}

export async function permanentlyDeleteProject(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.delete(projects).where(eq(projects.id, id));
  await audit(session.user.id, "permanent_delete", "project", id);
  refreshPublic("/", "/projects");
  redirect("/admin/trash");
}

export async function saveNews(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const slug = slugSchema.parse(text(form, "slug"));
  const state = stateSchema.parse(text(form, "state"));
  const imageUrl = text(form, "imageUrl") || null;
  const imagePublicId = text(form, "imagePublicId") || null;
  const turkish = {
    locale: "tr" as const,
    title: z.string().min(2).parse(text(form, "title_tr")),
    excerpt: z.string().min(10).parse(text(form, "excerpt_tr")),
    body: z
      .array(z.string())
      .min(1)
      .parse(parseRichTextBlocks(text(form, "body_tr"))),
    imageAlt: z.string().min(3).parse(text(form, "imageAlt_tr")),
  };
  // `body_en` is judged after parsing rather than on its raw value: the editor
  // always posts a JSON array, so "[]" would read as filled-in English.
  const englishBody = parseRichTextBlocks(text(form, "body_en"));
  const hasEnglish =
    ["title_en", "excerpt_en", "imageAlt_en"].some((name) =>
      Boolean(text(form, name))
    ) || englishBody.length > 0;
  const english = hasEnglish
    ? {
        locale: "en" as const,
        title: text(form, "title_en") || turkish.title,
        excerpt: text(form, "excerpt_en") || turkish.excerpt,
        body: englishBody.length ? englishBody : turkish.body,
        imageAlt: text(form, "imageAlt_en") || turkish.imageAlt,
      }
    : null;
  const translations = english ? [turkish, english] : [turkish];

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
  await audit(session.user.id, "trash", "news", id);
  refreshPublic("/news");
  redirect("/admin/news");
}

export async function restoreNews(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  const state = z.enum(["draft", "published"]).catch("draft").parse(text(form, "state"));
  await db.update(newsArticles).set({ state, updatedAt: new Date() }).where(eq(newsArticles.id, id));
  await audit(session.user.id, "restore", "news", id);
  refreshPublic("/news");
  redirect("/admin/trash");
}

export async function permanentlyDeleteNews(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
  await audit(session.user.id, "permanent_delete", "news", id);
  refreshPublic("/news");
  redirect("/admin/trash");
}

export async function saveGalleryItem(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const state = stateSchema.parse(text(form, "state"));
  const layout = z
    .enum(["portrait", "landscape", "wide"])
    .parse(text(form, "layout"));
  const imageUrl = z.string().min(1).parse(text(form, "imageUrl"));
  const imagePublicId = text(form, "imagePublicId") || null;
  const sortOrder = z.coerce.number().int().min(0).parse(text(form, "sortOrder"));

  const turkish = {
    locale: "tr" as const,
    category: z.string().min(2).parse(text(form, "category_tr")),
    place: z.string().min(2).parse(text(form, "place_tr")),
    caption: z.string().min(10).parse(text(form, "caption_tr")),
    imageAlt: z.string().min(3).parse(text(form, "imageAlt_tr")),
  };
  const hasEnglish = [
    "category_en",
    "place_en",
    "caption_en",
    "imageAlt_en",
  ].some((name) => Boolean(text(form, name)));
  const english = hasEnglish
    ? {
        locale: "en" as const,
        category: text(form, "category_en") || turkish.category,
        place: text(form, "place_en") || turkish.place,
        caption: text(form, "caption_en") || turkish.caption,
        imageAlt: text(form, "imageAlt_en") || turkish.imageAlt,
      }
    : null;
  const translations = english ? [turkish, english] : [turkish];

  await db.transaction(async (tx) => {
    await tx
      .insert(galleryItems)
      .values({
        id,
        state,
        imageUrl,
        imagePublicId,
        layout,
        sortOrder,
      })
      .onConflictDoUpdate({
        target: galleryItems.id,
        set: {
          state,
          imageUrl,
          imagePublicId,
          layout,
          sortOrder,
          updatedAt: new Date(),
        },
      });

    for (const translation of translations) {
      await tx
        .insert(galleryTranslations)
        .values({ galleryId: id, ...translation })
        .onConflictDoUpdate({
          target: [
            galleryTranslations.galleryId,
            galleryTranslations.locale,
          ],
          set: translation,
        });
    }
  });

  await audit(session.user.id, "save", "gallery_item", id);
  revalidateTag("gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function archiveGalleryItem(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db
    .update(galleryItems)
    .set({ state: "archived", updatedAt: new Date() })
    .where(eq(galleryItems.id, id));
  await audit(session.user.id, "trash", "gallery_item", id);
  revalidateTag("gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function restoreGalleryItem(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  const state = z.enum(["draft", "published"]).catch("draft").parse(text(form, "state"));
  await db.update(galleryItems).set({ state, updatedAt: new Date() }).where(eq(galleryItems.id, id));
  await audit(session.user.id, "restore", "gallery_item", id);
  revalidateTag("gallery");
  revalidatePath("/gallery");
  redirect("/admin/trash");
}

export async function permanentlyDeleteGalleryItem(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
  await audit(session.user.id, "permanent_delete", "gallery_item", id);
  revalidateTag("gallery");
  revalidatePath("/gallery");
  redirect("/admin/trash");
}

export async function saveBoardMember(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const roleTr = z.string().min(2).parse(text(form, "roleTr"));
  const values = {
    name: z.string().min(2).parse(text(form, "name")),
    roleEn: text(form, "roleEn") || roleTr,
    roleTr,
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
  await db.update(boardMembers).set({ visible: false, updatedAt: new Date() }).where(eq(boardMembers.id, id));
  await audit(session.user.id, "trash", "board_member", id);
  refreshPublic("/board");
  redirect("/admin/board");
}

export async function restoreBoardMember(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.update(boardMembers).set({ visible: true, updatedAt: new Date() }).where(eq(boardMembers.id, id));
  await audit(session.user.id, "restore", "board_member", id);
  refreshPublic("/board");
  redirect("/admin/trash");
}

export async function permanentlyDeleteBoardMember(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.delete(boardMembers).where(eq(boardMembers.id, id));
  await audit(session.user.id, "permanent_delete", "board_member", id);
  refreshPublic("/board");
  redirect("/admin/trash");
}

function setAtPath(
  target: Record<string, unknown>,
  path: Array<string | number>,
  value: string | string[]
) {
  let current: unknown = target;
  for (let index = 0; index < path.length - 1; index += 1) {
    current = (current as Record<string | number, unknown>)[path[index]];
  }
  (current as Record<string | number, unknown>)[path.at(-1)!] = value;
}

const legalPageKeySchema = z.enum(["kvkk", "privacy", "cookies"]);

/**
 * One legal document, saved whole.
 *
 * `saveSiteContent` writes field by field at a fixed path, which can change a
 * section but never add or remove one — the array it writes into keeps its
 * original length. The legal screen needs both, so it posts the sections it
 * currently has and this replaces the list outright.
 */
export async function saveLegalPage(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const key = legalPageKeySchema.parse(text(form, "legalKey"));

  const count = z.coerce.number().int().min(0).max(60).parse(text(form, "sectionCount") || "0");
  const sections = Array.from({ length: count }, (_, index) => ({
    heading: z.string().trim().max(300).parse(text(form, `sectionHeading:${index}`)),
    paragraphs: parseRichTextBlocks(text(form, `sectionBody:${index}`)),
  }))
    // A section with neither a heading nor any text is a row the operator added
    // and left blank; publishing an empty block helps nobody.
    .filter((section) => section.heading || section.paragraphs.length);

  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document
  ) as Record<string, unknown>;
  const legal = (document.legalPages ?? {}) as Record<string, Record<string, unknown>>;
  const before = (legal[key] ?? {}) as Record<string, unknown>;

  legal[key] = {
    ...before,
    title: z.string().trim().max(300).parse(text(form, "title")),
    lede: z.string().trim().max(2000).parse(text(form, "lede")),
    lastUpdated: z.string().trim().max(120).parse(text(form, "lastUpdated")),
    sections,
  };
  document.legalPages = legal;

  await db
    .update(siteContent)
    .set({ document, updatedBy: session.user.id, updatedAt: new Date() })
    .where(eq(siteContent.locale, locale));

  const previousCount = Array.isArray(before.sections) ? before.sections.length : 0;
  await audit(session.user.id, "save", "legal_page", `${locale}:${key}`, {
    changes: [
      {
        field: "sections",
        label: "Bölüm sayısı",
        from: String(previousCount),
        to: String(sections.length),
      },
    ],
  });
  refreshPublic("/kvkk", "/privacy-policy", "/cookie-policy");
  redirect(`/admin/legal?locale=${locale}&saved=1`);
}

export async function saveSiteContent(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document
  ) as Record<string, unknown>;
  const pathSchema = z
    .array(z.union([z.string(), z.number().int().nonnegative()]))
    .min(1);
  for (const [key, value] of form.entries()) {
    if (typeof value !== "string") continue;
    // `field:` carries one string; `rich:` carries a whole paragraph array
    // authored in the editor, replacing the list at that path wholesale.
    const kind = key.startsWith("field:")
      ? "field"
      : key.startsWith("rich:")
        ? "rich"
        : null;
    if (!kind) continue;
    const path = pathSchema.parse(
      JSON.parse(decodeURIComponent(key.slice(kind === "field" ? 6 : 5)))
    );
    setAtPath(
      document,
      path,
      kind === "rich" ? parseRichTextBlocks(value) : value.trim()
    );
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
    "/gallery",
    "/donate",
    "/volunteer",
    "/contact",
    "/kvkk",
    "/privacy-policy",
    "/cookie-policy"
  );
  // The homepage screen posts to this same action, so it says where to
  // return; anything else falls back to the content editor. (Legal texts have
  // their own action now — they need to add and remove sections, which writing
  // one field at a time cannot do.)
  const returnTo = text(form, "returnTo");
  const destinations: Record<string, string> = {
    homepage: `/admin/homepage?locale=${locale}&saved=1`,
  };
  // Each content area has its own page now, so land back on the one just
  // edited rather than bouncing the operator out to the section index.
  if (returnTo === "section") {
    const section = z
      .string()
      .regex(/^[A-Za-z][A-Za-z0-9]*$/)
      .parse(text(form, "section"));
    redirect(`/admin/content/${locale}/${section}?saved=1`);
  }
  redirect(destinations[returnTo] ?? `/admin/content?locale=${locale}`);
}

const campaignSchema = z.object({
  kicker: z.string().trim().max(120),
  title: z.object({
    pre: z.string().max(180),
    highlight: z.string().max(180),
    post: z.string().max(180),
  }),
  copy: z.string().trim().min(2, "Açıklama boş olamaz.").max(900),
  ctaPrimary: z.string().trim().min(1, "Ana buton yazısı boş olamaz.").max(80),
  ctaPrimaryHref: linkTargetSchema,
  ctaSecondary: z.string().trim().min(1, "İkinci buton yazısı boş olamaz.").max(80),
  ctaSecondaryHref: linkTargetSchema,
  goalLabel: z.string().trim().max(120),
  goalValue: z.string().trim().max(120),
  imageKey: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().max(1200).optional().default(""),
  imagePublicId: z.string().trim().max(300).optional().default(""),
});

/**
 * The homepage campaign band. Edited from its own panel rather than as loose
 * fields, so the two buttons get the same destination dropdown the banner
 * editor uses instead of a free-text path nobody can verify.
 */
export async function saveHomepageCampaign(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text(form, "campaign"));
  } catch {
    throw new Error("Kampanya bilgileri okunamadı. Sayfayı yenileyip tekrar deneyin.");
  }

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown>;
  document.campaign = campaignSchema.parse(parsed);

  await db
    .update(siteContent)
    .set({ document, updatedBy: session.user.id, updatedAt: new Date() })
    .where(eq(siteContent.locale, locale));
  await audit(session.user.id, "save", "homepage_campaign", locale);
  refreshPublic("/");
  redirect(`/admin/homepage?locale=${locale}&saved=1`);
}

const homepageSelectionSchema = z.object({
  news: z.array(z.string().trim().min(1).max(200)).max(HOMEPAGE_SECTION_LIMIT),
  projects: z.array(z.string().trim().min(1).max(200)).max(HOMEPAGE_SECTION_LIMIT),
  areas: z.array(z.number().int().min(0).max(200)).max(HOMEPAGE_SECTION_LIMIT),
});

/**
 * Which items the curated homepage sections show.
 *
 * Written to both language documents in one transaction: the identifiers are
 * language independent, and saving only the document you happened to be
 * looking at would leave the other language showing different projects.
 */
export async function saveHomepageSelection(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const section = z.enum(["news", "projects", "areas"]).parse(text(form, "section"));

  let parsed: unknown;
  try {
    parsed = JSON.parse(text(form, "values") || "[]");
  } catch {
    throw new Error("Seçim okunamadı. Sayfayı yenileyip tekrar deneyin.");
  }

  const rows = await db.select().from(siteContent);
  if (!rows.length) throw new Error("Site content has not been seeded");

  await db.transaction(async (tx) => {
    for (const row of rows) {
      if (row.locale !== "en" && row.locale !== "tr") continue;
      const document = mergeContentDefaults(
        { ...dict[row.locale], ...content[row.locale] },
        row.document,
      ) as Record<string, unknown>;
      const current = readHomepageSelection(document.homepage);
      document.homepage = homepageSelectionSchema.parse({ ...current, [section]: parsed });
      await tx
        .update(siteContent)
        .set({ document, updatedBy: session.user.id, updatedAt: new Date() })
        .where(eq(siteContent.locale, row.locale));
    }
  });

  await audit(session.user.id, "save", "homepage_selection", section);
  refreshPublic("/");
  redirect(`/admin/homepage?locale=${locale}&saved=1`);
}

export async function saveHeroSlides(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown>;
  const slides = parseHeroSlides(text(form, "slides"));
  const trash = parseHeroSlideTrash(text(form, "trash"));
  document.heroSlides = slides;
  document.heroSlidesTrash = trash;

  await db
    .update(siteContent)
    .set({
      document,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(siteContent.locale, locale));
  await audit(session.user.id, "save", "hero_slider", locale);
  refreshPublic("/", "/admin/slider");
  redirect(`/admin/slider?locale=${locale}&saved=1`);
}

const socialAccountSchema = z.object({
  id: z.string().trim().max(120).optional().default(""),
  platform: z.string().trim().min(1, "Platform seçin.").max(60),
  label: z.string().trim().max(80),
  url: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) => !value || /^https:\/\//i.test(value),
      "HTTPS bağlantısı kullanın."
    ),
  active: z.boolean().optional().default(true),
  openInNewTab: z.boolean().optional().default(true),
});

export async function saveSocialAccounts(form: FormData) {
  const session = await requireAdmin();
  const raw = text(form, "accounts");
  const submitted = z
    .array(socialAccountSchema)
    .max(30)
    .parse(raw ? JSON.parse(raw) : [])
    .map((account, index) => ({ ...account, sortOrder: index }));

  const existing = await db.select().from(socialAccounts);
  const changes: AuditFieldChange[] = [];
  for (const account of submitted) {
    const before = existing.find((candidate) => candidate.id === account.id);
    if (!before) {
      changes.push({
        field: `social:${account.platform}`,
        label: `Yeni hesap (${account.platform})`,
        from: "—",
        to: account.url || "(bağlantı yok)",
      });
      continue;
    }
    if (before.url !== account.url) {
      changes.push({
        field: `social:${account.platform}:url`,
        label: `${account.platform} — bağlantı`,
        from: before.url,
        to: account.url,
      });
    }
    if (before.active !== account.active) {
      changes.push({
        field: `social:${account.platform}:active`,
        label: `${account.platform} — yayın durumu`,
        from: before.active ? "Açık" : "Kapalı",
        to: account.active ? "Açık" : "Kapalı",
      });
    }
  }
  for (const before of existing) {
    if (submitted.some((account) => account.id === before.id)) continue;
    changes.push({
      field: `social:${before.platform}`,
      label: `Hesap kaldırıldı (${before.platform})`,
      from: before.url,
      to: "Kaldırıldı",
    });
  }

  await db.transaction(async (tx) => {
    const keptIds = new Set<string>();
    for (const account of submitted) {
      const id = account.id || randomUUID();
      keptIds.add(id);
      const row = {
        platform: account.platform,
        label: account.label,
        url: account.url,
        active: account.active,
        openInNewTab: account.openInNewTab,
        sortOrder: account.sortOrder,
        updatedAt: new Date(),
      };
      if (account.id && existing.some((candidate) => candidate.id === account.id)) {
        await tx.update(socialAccounts).set(row).where(eq(socialAccounts.id, id));
      } else {
        await tx.insert(socialAccounts).values({ id, ...row });
      }
    }
    for (const before of existing) {
      if (!keptIds.has(before.id)) {
        await tx.delete(socialAccounts).where(eq(socialAccounts.id, before.id));
      }
    }
  });

  await audit(session.user.id, "save", "social_accounts", "all", { changes });
  refreshPublic("/", "/contact");
  redirect("/admin/social?saved=1");
}

const bankAccountSchema = z.object({
  id: z.string().trim().max(120).optional().default(""),
  currency: z.string().trim().min(1, "Para birimi yazın.").max(24),
  bankName: z.string().trim().max(160),
  accountHolder: z.string().trim().max(160),
  iban: optionalIbanSchema,
  active: z.boolean().optional().default(true),
});

/**
 * Bank accounts, edited on the donation screen — the page an operator reaches
 * for when they want to publish an IBAN. They live in their own table and
 * their own action rather than riding along with another form: two screens
 * submitting the whole list would let a stale snapshot delete an account added
 * elsewhere, which is not a mistake to risk with the account bağış money
 * arrives in.
 */
export async function saveBankAccounts(form: FormData) {
  const session = await requireAdmin();

  const submitted = z
    .array(bankAccountSchema)
    .max(24)
    .parse(JSON.parse(text(form, "bankAccounts") || "[]"))
    .map((account, index) => ({
      ...account,
      iban: normaliseIban(account.iban),
      sortOrder: index,
    }));

  const existing = await db.select().from(bankAccounts);

  // Diff by identity so an added or removed account reads as such rather than
  // as a cascade of field edits.
  const changes: AuditFieldChange[] = [];
  for (const account of submitted) {
    const before = existing.find((candidate) => candidate.id === account.id);
    if (!before) {
      changes.push({
        field: `bank:${account.currency}`,
        label: `Banka hesabı (${account.currency})`,
        from: "—",
        to: `${account.bankName} · ${formatIban(account.iban)}`.trim(),
        sensitive: true,
      });
      continue;
    }
    for (const { field, label } of bankFieldDefs) {
      const from = String(before[field as keyof typeof before] ?? "");
      const to = String(account[field as keyof typeof account] ?? "");
      if (from === to) continue;
      changes.push({
        field: `bank:${account.currency}:${field}`,
        label: `${account.currency} — ${label}`,
        from: field === "iban" ? formatIban(from) : from,
        to: field === "iban" ? formatIban(to) : to,
        sensitive: true,
      });
    }
  }
  for (const before of existing) {
    if (submitted.some((account) => account.id === before.id)) continue;
    changes.push({
      field: `bank:${before.currency}`,
      label: `Banka hesabı (${before.currency})`,
      from: `${before.bankName} · ${formatIban(before.iban)}`.trim(),
      to: "Kaldırıldı",
      sensitive: true,
    });
  }

  await db.transaction(async (tx) => {
    const keptIds = new Set<string>();
    for (const account of submitted) {
      const id = account.id || randomUUID();
      keptIds.add(id);
      const row = {
        currency: account.currency,
        bankName: account.bankName,
        accountHolder: account.accountHolder,
        iban: account.iban,
        active: account.active,
        sortOrder: account.sortOrder,
        updatedAt: new Date(),
      };
      if (account.id && existing.some((candidate) => candidate.id === account.id)) {
        await tx.update(bankAccounts).set(row).where(eq(bankAccounts.id, id));
      } else {
        await tx.insert(bankAccounts).values({ id, ...row });
      }
    }
    for (const before of existing) {
      if (!keptIds.has(before.id)) {
        await tx.delete(bankAccounts).where(eq(bankAccounts.id, before.id));
      }
    }
  });

  await audit(session.user.id, "save", "bank_accounts", "all", { changes });
  // The donate page reads active accounts through lib/site-data, so revalidating
  // it is what makes a newly added IBAN visible to visitors.
  refreshPublic("/", "/donate", "/contact");
  redirect("/admin/donation?accounts=1");
}

/** Reads the settings row, creating the singleton on first use. */
export async function readOrgSettings() {
  const row = await db.query.orgSettings.findFirst({
    where: eq(orgSettings.id, ORG_SETTINGS_ID),
  });
  return row ?? null;
}

export async function saveOrganisationSettings(form: FormData) {
  const session = await requireAdmin();

  const values: Record<string, string> = {};
  for (const definition of orgFieldDefs) {
    values[definition.field] = text(form, definition.field);
  }
  if (values.email) {
    z.string().email("Geçerli bir e-posta adresi yazın.").parse(values.email);
  }
  if (values.mapsUrl) {
    z.string().url("Geçerli bir bağlantı yazın.").parse(values.mapsUrl);
  }
  const existing = await readOrgSettings();

  const changes: AuditFieldChange[] = diffRecords(
    orgFieldDefs.map(({ field, label }) => ({ field, label })),
    { ...(existing ?? {}) },
    values
  );

  // Bank accounts used to be part of this form. They are edited on the
  // donation screen now, through `saveBankAccounts`, so nothing here touches
  // that table — this action receiving no account list must not be read as
  // "delete them all".
  const record = {
    ...values,
    updatedBy: session.user.id,
    updatedAt: new Date(),
  };
  if (existing) {
    await db.update(orgSettings).set(record).where(eq(orgSettings.id, ORG_SETTINGS_ID));
  } else {
    await db.insert(orgSettings).values({ id: ORG_SETTINGS_ID, ...record });
  }

  await audit(session.user.id, "save", "organisation_settings", ORG_SETTINGS_ID, {
    changes,
  });
  refreshPublic("/", "/contact", "/donate", "/about");
  redirect("/admin/organisation?saved=1");
}

export async function saveContactSettings(form: FormData) {
  const session = await requireAdmin();
  const updates = (["tr", "en"] as const).map((locale) => ({
    locale,
    email: z.string().email("Geçerli bir e-posta adresi yazın.").parse(text(form, `email_${locale}`)),
    phone: z.string().min(7).max(40).parse(text(form, `phone_${locale}`)),
    address: z.string().min(10).max(500).parse(text(form, `address_${locale}`)),
  }));
  const rows = await db.select().from(siteContent);
  const documents = updates.map((update) => {
    const row = rows.find((candidate) => candidate.locale === update.locale);
    if (!row) throw new Error(`Site content has not been seeded for ${update.locale}`);
    const document = mergeContentDefaults(
      { ...dict[update.locale], ...content[update.locale] },
      row.document,
    ) as Record<string, unknown>;
    const utility = (document.utility && typeof document.utility === "object" ? document.utility : {}) as Record<string, unknown>;
    const contactPage = (document.contactPage && typeof document.contactPage === "object" ? document.contactPage : {}) as Record<string, unknown>;
    utility.email = update.email;
    utility.phone = update.phone;
    contactPage.address = update.address;
    if (Array.isArray(contactPage.rows)) {
      contactPage.rows = contactPage.rows.map((row, index) => index === 0 && row && typeof row === "object"
        ? { ...(row as Record<string, unknown>), value: update.phone }
        : index === 1 && row && typeof row === "object"
          ? { ...(row as Record<string, unknown>), value: update.email }
          : row);
    }
    document.utility = utility;
    document.contactPage = contactPage;
    if (document.footer && typeof document.footer === "object") {
      document.footer = { ...(document.footer as Record<string, unknown>), addressLine: update.address };
    }
    return { locale: update.locale, document };
  });
  await db.transaction(async (tx) => {
    for (const { locale, document } of documents) {
      await tx.update(siteContent).set({ document, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(siteContent.locale, locale));
    }
  });
  await audit(session.user.id, "save", "contact_settings", "all-locales");
  refreshPublic("/", "/contact");
  redirect("/admin/contact?saved=1");
}

export async function saveDonationSettings(form: FormData) {
  const session = await requireAdmin();
  const updates = (["tr", "en"] as const).map((locale) => ({
    locale,
    title: z.string().min(2).max(160).parse(text(form, `title_${locale}`)),
    lede: z.string().min(2).max(500).parse(text(form, `lede_${locale}`)),
    accountsNote: z.string().min(2).max(500).parse(text(form, `accountsNote_${locale}`)),
  }));
  const rows = await db.select().from(siteContent);
  const documents = updates.map((update) => {
    const row = rows.find((candidate) => candidate.locale === update.locale);
    if (!row) throw new Error(`Site content has not been seeded for ${update.locale}`);
    const document = mergeContentDefaults(
      { ...dict[update.locale], ...content[update.locale] },
      row.document,
    ) as Record<string, unknown>;
    const current = (document.donatePage && typeof document.donatePage === "object" ? document.donatePage : {}) as Record<string, unknown>;
    document.donatePage = { ...current, ...update, locale: undefined };
    delete (document.donatePage as Record<string, unknown>).locale;
    return { locale: update.locale, document };
  });
  await db.transaction(async (tx) => {
    for (const { locale, document } of documents) {
      await tx.update(siteContent).set({ document, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(siteContent.locale, locale));
    }
  });
  await audit(session.user.id, "save", "donation_settings", "all-locales");
  refreshPublic("/", "/donate");
  redirect("/admin/donation?saved=1");
}

export async function restoreHeroSlide(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const id = text(form, "id");
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown>;
  const slides = parseHeroSlides(JSON.stringify(document.heroSlides ?? []));
  const trash = parseHeroSlideTrash(JSON.stringify(document.heroSlidesTrash ?? []));
  const target = trash.find((slide) => slide.id === id);
  if (!target) redirect("/admin/trash");
  const { deletedAt: _deletedAt, ...restored } = target;
  if (!slides.some((slide) => slide.id === id)) {
    document.heroSlides = [
      ...slides,
      { ...restored, active: restored.active && slides.filter((slide) => slide.active).length < 5 },
    ];
  }
  document.heroSlidesTrash = trash.filter((slide) => slide.id !== id);
  await db
    .update(siteContent)
    .set({ document, updatedBy: session.user.id, updatedAt: new Date() })
    .where(eq(siteContent.locale, locale));
  await audit(session.user.id, "restore", "hero_slider", id);
  refreshPublic("/", "/admin/slider");
  redirect("/admin/trash");
}

export async function permanentlyDeleteHeroSlide(form: FormData) {
  const session = await requireAdmin();
  const locale = z.enum(["en", "tr"]).parse(text(form, "locale"));
  const id = text(form, "id");
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) throw new Error("Site content has not been seeded");

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown>;
  const trash = parseHeroSlideTrash(JSON.stringify(document.heroSlidesTrash ?? []));
  document.heroSlidesTrash = trash.filter((slide) => slide.id !== id);
  await db
    .update(siteContent)
    .set({ document, updatedBy: session.user.id, updatedAt: new Date() })
    .where(eq(siteContent.locale, locale));
  await audit(session.user.id, "permanent_delete", "hero_slider", id);
  refreshPublic("/admin/trash");
  redirect("/admin/trash");
}

export async function savePresidentProfile(form: FormData) {
  const session = await requireAdmin();
  const imageUrl = text(form, "imageUrl");
  const imagePublicId = text(form, "imagePublicId");
  if (Boolean(imageUrl) !== Boolean(imagePublicId)) {
    throw new Error("The president photograph upload is incomplete");
  }
  const photoEnabled = Boolean(imageUrl && imagePublicId);

  const documents = await Promise.all(
    (["tr", "en"] as const).map(async (locale) => {
      const row = await db.query.siteContent.findFirst({
        where: eq(siteContent.locale, locale),
      });
      if (!row) throw new Error(`Site content has not been seeded for ${locale}`);

      const document = mergeContentDefaults(
        { ...dict[locale], ...content[locale] },
        row.document
      ) as unknown as Record<string, unknown> & {
        presidentPage: Record<string, unknown>;
      };
      const message = parseRichTextBlocks(text(form, `message_${locale}`));
      const president = {
        ...document.presidentPage,
        title: z.string().min(2).max(160).parse(text(form, `title_${locale}`)),
        lede: z.string().min(2).max(500).parse(text(form, `lede_${locale}`)),
        name: z.string().min(2).max(120).parse(text(form, `name_${locale}`)),
        role: z.string().min(2).max(160).parse(text(form, `role_${locale}`)),
        imageAlt: z.string().max(300).parse(text(form, `imageAlt_${locale}`)),
        photoEnabled,
        message: z.array(z.string().min(1)).min(1).parse(message),
      };
      document.presidentPage = president;
      return { locale, document };
    })
  );

  await db.transaction(async (tx) => {
    for (const { locale, document } of documents) {
      await tx
        .update(siteContent)
        .set({
          document,
          updatedBy: session.user.id,
          updatedAt: new Date(),
        })
        .where(eq(siteContent.locale, locale));
    }

    if (photoEnabled) {
      await tx
        .insert(siteMedia)
        .values({
          key: "presidentPortrait",
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
    }
  });

  await audit(session.user.id, "save", "president_profile", "president");
  if (photoEnabled) {
    await audit(session.user.id, "save", "site_media", "presidentPortrait");
  } else {
    await audit(session.user.id, "remove", "site_media", "presidentPortrait");
  }
  refreshPublic("/", "/about", "/president", "/admin/media");
  redirect("/admin/president?saved=1");
}

export async function updateSubmissionStatus(form: FormData) {
  const session = await requireAdmin();
  const type = z.enum(["contact", "volunteer"]).parse(text(form, "type"));
  const id = text(form, "id");
  if (type === "contact") {
    const status = z
      .enum(["new", "read", "replied", "archived"])
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
  revalidatePath("/admin/messages");
}

export async function deleteContactMessage(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.update(contactSubmissions).set({ status: "archived" }).where(eq(contactSubmissions.id, id));
  await audit(session.user.id, "trash", "contact_submission", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/messages");
}

export async function restoreContactMessage(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.update(contactSubmissions).set({ status: "new" }).where(eq(contactSubmissions.id, id));
  await audit(session.user.id, "restore", "contact_submission", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/messages");
  redirect("/admin/trash");
}

export async function permanentlyDeleteContactMessage(form: FormData) {
  const session = await requireAdmin();
  const id = text(form, "id");
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  await audit(session.user.id, "permanent_delete", "contact_submission", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/messages");
  redirect("/admin/trash");
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
    "/president",
    "/donate",
    "/volunteer"
  );
  redirect("/admin/media");
}
