import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date());

export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: integer("email_verified", { mode: "boolean" })
      .default(false)
      .notNull(),
    image: text("image"),
    role: text("role").default("user").notNull(),
    banned: integer("banned", { mode: "boolean" }).default(false).notNull(),
    banReason: text("ban_reason"),
    banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("user_email_idx").on(table.email)]
);

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [
    uniqueIndex("session_token_idx").on(table.token),
    index("session_user_idx").on(table.userId),
  ]
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("account_user_idx").on(table.userId)]
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const siteContent = sqliteTable("site_content", {
  locale: text("locale", { enum: ["en", "tr"] }).primaryKey(),
  document: text("document", { mode: "json" }).notNull().$type<Record<string, unknown>>(),
  updatedBy: text("updated_by").references(() => user.id, {
    onDelete: "set null",
  }),
  updatedAt: updatedAt(),
});

export const siteMedia = sqliteTable("site_media", {
  key: text("key").primaryKey(),
  imageUrl: text("image_url").notNull(),
  imagePublicId: text("image_public_id").notNull(),
  updatedBy: text("updated_by").references(() => user.id, {
    onDelete: "set null",
  }),
  updatedAt: updatedAt(),
});

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    /**
     * Publication state — whether the project is visible on the site at all.
     * Deliberately separate from `lifecycle` below: a finished project should
     * still be published, so "completed" is not a reason to hide it.
     */
    state: text("state", {
      enum: ["draft", "published", "archived"],
    })
      .default("draft")
      .notNull(),
    /** How the work itself is going, independent of whether it is published. */
    lifecycle: text("lifecycle", {
      enum: ["ongoing", "completed", "inactive"],
    })
      .default("ongoing")
      .notNull(),
    /** Whether the project is promoted onto the homepage. */
    featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),
    sortOrder: integer("sort_order").default(0).notNull(),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("project_slug_idx").on(table.slug),
    index("project_state_order_idx").on(table.state, table.sortOrder),
    index("project_featured_idx").on(table.featured, table.sortOrder),
  ]
);

/**
 * Additional photographs for a single project.
 *
 * Kept separate from `galleryItems`, which is the site-wide gallery and has no
 * project relation — the two answer different questions ("show me this
 * project's photos" vs "show me the organisation's gallery"), and conflating
 * them would mean every project photo also appearing in the public gallery.
 *
 * Captions and alt text sit in flat per-language columns rather than a
 * translations table, matching `boardMembers` — two short strings per language
 * does not warrant the extra join.
 */
export const projectImages = sqliteTable(
  "project_images",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    imagePublicId: text("image_public_id"),
    captionTr: text("caption_tr").default("").notNull(),
    captionEn: text("caption_en").default("").notNull(),
    altTr: text("alt_tr").default("").notNull(),
    altEn: text("alt_en").default("").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("project_image_order_idx").on(table.projectId, table.sortOrder)]
);

export const projectTranslations = sqliteTable(
  "project_translations",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    locale: text("locale", { enum: ["en", "tr"] }).notNull(),
    title: text("title").notNull(),
    region: text("region").notNull(),
    statusLabel: text("status_label").notNull(),
    summary: text("summary").notNull(),
    body: text("body", { mode: "json" }).notNull().$type<string[]>(),
    facts: text("facts", { mode: "json" })
      .notNull()
      .$type<Array<{ label: string; value: string }>>(),
    chips: text("chips", { mode: "json" }).notNull().$type<string[]>(),
    imageAlt: text("image_alt").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.locale] }),
    index("project_translation_locale_idx").on(table.locale),
  ]
);

export const projectRelations = relations(projects, ({ many }) => ({
  projectTranslations: many(projectTranslations),
  projectImages: many(projectImages),
}));

export const projectImageRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const projectTranslationRelations = relations(
  projectTranslations,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTranslations.projectId],
      references: [projects.id],
    }),
  })
);

export const newsArticles = sqliteTable(
  "news_articles",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    state: text("state", {
      enum: ["draft", "published", "archived"],
    })
      .default("draft")
      .notNull(),
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("news_slug_idx").on(table.slug),
    index("news_state_date_idx").on(table.state, table.publishedAt),
  ]
);

export const newsTranslations = sqliteTable(
  "news_translations",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => newsArticles.id, { onDelete: "cascade" }),
    locale: text("locale", { enum: ["en", "tr"] }).notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body", { mode: "json" }).notNull().$type<string[]>(),
    imageAlt: text("image_alt").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.locale] }),
    index("news_translation_locale_idx").on(table.locale),
  ]
);

export const newsRelations = relations(newsArticles, ({ many }) => ({
  newsTranslations: many(newsTranslations),
}));

export const newsTranslationRelations = relations(
  newsTranslations,
  ({ one }) => ({
    article: one(newsArticles, {
      fields: [newsTranslations.articleId],
      references: [newsArticles.id],
    }),
  })
);

export const galleryItems = sqliteTable(
  "gallery_items",
  {
    id: text("id").primaryKey(),
    state: text("state", {
      enum: ["draft", "published", "archived"],
    })
      .default("draft")
      .notNull(),
    imageUrl: text("image_url").notNull(),
    imagePublicId: text("image_public_id"),
    layout: text("layout", {
      enum: ["portrait", "landscape", "wide"],
    })
      .default("landscape")
      .notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("gallery_state_order_idx").on(table.state, table.sortOrder),
  ]
);

export const galleryTranslations = sqliteTable(
  "gallery_translations",
  {
    galleryId: text("gallery_id")
      .notNull()
      .references(() => galleryItems.id, { onDelete: "cascade" }),
    locale: text("locale", { enum: ["en", "tr"] }).notNull(),
    category: text("category").notNull(),
    place: text("place").notNull(),
    caption: text("caption").notNull(),
    imageAlt: text("image_alt").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.galleryId, table.locale] }),
    index("gallery_translation_locale_idx").on(table.locale),
  ]
);

export const galleryRelations = relations(galleryItems, ({ many }) => ({
  galleryTranslations: many(galleryTranslations),
}));

export const galleryTranslationRelations = relations(
  galleryTranslations,
  ({ one }) => ({
    galleryItem: one(galleryItems, {
      fields: [galleryTranslations.galleryId],
      references: [galleryItems.id],
    }),
  })
);

export const boardMembers = sqliteTable("board_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  roleEn: text("role_en").notNull(),
  roleTr: text("role_tr").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  visible: integer("visible", { mode: "boolean" }).default(true).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const contactSubmissions = sqliteTable(
  "contact_submissions",
  {
    id: text("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    locale: text("locale", { enum: ["en", "tr"] }).notNull(),
    status: text("status", { enum: ["new", "read", "replied", "archived"] })
      .default("new")
      .notNull(),
    createdAt: createdAt(),
  },
  (table) => [index("contact_status_date_idx").on(table.status, table.createdAt)]
);

export const volunteerApplications = sqliteTable(
  "volunteer_applications",
  {
    id: text("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    city: text("city").notNull(),
    areaOfInterest: text("area_of_interest").notNull(),
    availability: text("availability").notNull(),
    message: text("message").notNull(),
    consent: integer("consent", { mode: "boolean" }).notNull(),
    locale: text("locale", { enum: ["en", "tr"] }).notNull(),
    status: text("status", { enum: ["new", "reviewing", "closed"] })
      .default("new")
      .notNull(),
    createdAt: createdAt(),
  },
  (table) => [index("volunteer_status_date_idx").on(table.status, table.createdAt)]
);

export const newsletterSubscribers = sqliteTable(
  "newsletter_subscribers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    locale: text("locale", { enum: ["en", "tr"] }).notNull(),
    active: integer("active", { mode: "boolean" }).default(true).notNull(),
    createdAt: createdAt(),
  },
  (table) => [uniqueIndex("newsletter_email_idx").on(table.email)]
);

/**
 * Organisation-level facts and site-wide switches.
 *
 * A single row, keyed by `ORG_SETTINGS_ID`. These values are language
 * independent — an IBAN and a MERSİS number do not have a Turkish and an
 * English version — which is why they live here rather than inside the
 * per-locale `siteContent` document.
 */
export const orgSettings = sqliteTable("org_settings", {
  id: text("id").primaryKey(),
  phone: text("phone").default("").notNull(),
  whatsapp: text("whatsapp").default("").notNull(),
  email: text("email").default("").notNull(),
  address: text("address").default("").notNull(),
  mapsUrl: text("maps_url").default("").notNull(),
  workingHours: text("working_hours").default("").notNull(),
  registryNumber: text("registry_number").default("").notNull(),
  taxNumber: text("tax_number").default("").notNull(),
  mersisNumber: text("mersis_number").default("").notNull(),
  establishedOn: text("established_on").default("").notNull(),
  orgStatus: text("org_status").default("").notNull(),
  updatedBy: text("updated_by").references(() => user.id, {
    onDelete: "set null",
  }),
  updatedAt: updatedAt(),
});

export const ORG_SETTINGS_ID = "default";

/**
 * Bank accounts, one row per currency. A table rather than fixed TRY/USD/EUR
 * columns so a new currency is data entry rather than a migration.
 */
export const bankAccounts = sqliteTable(
  "bank_accounts",
  {
    id: text("id").primaryKey(),
    currency: text("currency").notNull(),
    bankName: text("bank_name").default("").notNull(),
    accountHolder: text("account_holder").default("").notNull(),
    iban: text("iban").default("").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    active: integer("active", { mode: "boolean" }).default(true).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("bank_account_order_idx").on(table.sortOrder)]
);

/**
 * Social profiles. Moved out of the per-locale content document so that the
 * platform list is open-ended and the display order is editable — neither was
 * possible against a fixed five-key union.
 */
export const socialAccounts = sqliteTable(
  "social_accounts",
  {
    id: text("id").primaryKey(),
    /** Chooses the icon; unrecognised values fall back to a generic link icon. */
    platform: text("platform").notNull(),
    label: text("label").default("").notNull(),
    url: text("url").default("").notNull(),
    active: integer("active", { mode: "boolean" }).default(true).notNull(),
    openInNewTab: integer("open_in_new_tab", { mode: "boolean" })
      .default(true)
      .notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("social_account_order_idx").on(table.sortOrder)]
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    /**
     * What actually changed. `changes` carries the before/after pair for each
     * touched field so the activity log can answer "what was the IBAN before?"
     * rather than only "someone saved the donation settings".
     */
    metadata: text("metadata", { mode: "json" }).$type<AuditMetadata>(),
    createdAt: createdAt(),
  },
  (table) => [
    index("audit_entity_idx").on(table.entityType, table.entityId),
    index("audit_created_idx").on(table.createdAt),
  ]
);

export type AuditFieldChange = {
  field: string;
  label: string;
  from: string;
  to: string;
  /** Marks bank/IBAN changes so the log can surface them more prominently. */
  sensitive?: boolean;
};

export type AuditMetadata = {
  changes?: AuditFieldChange[];
  summary?: string;
};

export const schema = {
  user,
  session,
  account,
  verification,
  siteContent,
  siteMedia,
  projects,
  projectTranslations,
  projectImages,
  projectRelations,
  projectTranslationRelations,
  projectImageRelations,
  newsArticles,
  newsTranslations,
  newsRelations,
  newsTranslationRelations,
  galleryItems,
  galleryTranslations,
  galleryRelations,
  galleryTranslationRelations,
  boardMembers,
  contactSubmissions,
  volunteerApplications,
  newsletterSubscribers,
  orgSettings,
  bankAccounts,
  socialAccounts,
  auditLogs,
};
