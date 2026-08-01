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
    state: text("state", {
      enum: ["draft", "published", "archived"],
    })
      .default("draft")
      .notNull(),
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
  ]
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

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (table) => [index("audit_entity_idx").on(table.entityType, table.entityId)]
);

export const schema = {
  user,
  session,
  account,
  verification,
  siteContent,
  siteMedia,
  projects,
  projectTranslations,
  projectRelations,
  projectTranslationRelations,
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
  auditLogs,
};
