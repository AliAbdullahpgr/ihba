import { eq } from "drizzle-orm";
import { Languages, SlidersHorizontal } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton, AdminPageHeader } from "@/app/admin/components/AdminUi";
import { SliderManager } from "@/app/admin/components/SliderManager";
import { db } from "@/lib/db/client";
import { content } from "@/lib/content";
import {
  normaliseHeroSlide,
  resolveHeroSlides,
  type HeroSlideTrashRecord,
} from "@/lib/hero-slides";
import { dict, type Lang } from "@/lib/i18n";
import { mediaLabels, bundledMedia } from "@/lib/media";
import { mergeContentDefaults } from "@/lib/merge-content";
import { siteContent } from "@/lib/db/schema";

type SearchParams = Promise<{ locale?: string; saved?: string }>;

function readTrash(document: unknown): HeroSlideTrashRecord[] {
  if (!document || typeof document !== "object") return [];
  const value = (document as { heroSlidesTrash?: unknown }).heroSlidesTrash;
  if (!Array.isArray(value)) return [];
  return value
    .map((slide, index) => {
      const normalised = normaliseHeroSlide(slide, index);
      if (!normalised || !slide || typeof slide !== "object") return null;
      const deletedAt = (slide as { deletedAt?: unknown }).deletedAt;
      return typeof deletedAt === "string" && deletedAt
        ? { ...normalised, deletedAt }
        : null;
    })
    .filter((slide): slide is HeroSlideTrashRecord => Boolean(slide));
}

export default async function AdminSliderPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const locale: Lang = params.locale === "en" ? "en" : "tr";
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) notFound();
  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as typeof dict.tr & typeof content.tr;

  // Rebuilds the first banner from the legacy `hero` block when the saved
  // document predates the change that made every banner an ordinary entry.
  const slides = resolveHeroSlides(document);

  const mediaRows = await db.query.siteMedia.findMany();
  const mediaOptions = (Object.keys(mediaLabels) as Array<keyof typeof mediaLabels>).map(
    (key) => ({
      key,
      label: mediaLabels[key],
      url: mediaRows.find((media) => media.key === key)?.imageUrl ?? bundledMedia[key].url,
    }),
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Anasayfa"
        title="Anasayfa bannerı"
        description="Anasayfanın giriş bölümünde dönen bannerları yönetin. Şeritten bir banner seçin, metnini ve görselini düzenleyin."
        action={
          <div className="admin-language-switcher" aria-label="Banner dili seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <AdminButton
              href="/admin/slider?locale=tr"
              variant={locale === "tr" ? "primary" : "secondary"}
            >
              Türkçe
            </AdminButton>
            <AdminButton
              href="/admin/slider?locale=en"
              variant={locale === "en" ? "primary" : "secondary"}
            >
              English
            </AdminButton>
          </div>
        }
      />

      <div className="admin-feedback admin-feedback-info" role="note">
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Bannerlar soldan sağa, şeritteki sırayla gösterilir. Her dil ayrı düzenlenir —
        Türkçe bannerları kaydettikten sonra İngilizce'yi de kontrol edin.
      </div>

      <SliderManager
        locale={locale}
        initialSlides={slides}
        initialTrash={readTrash(row.document)}
        mediaOptions={mediaOptions}
        saved={params.saved === "1"}
      />
    </>
  );
}
