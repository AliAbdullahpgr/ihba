import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import {
  PresidentForm,
  type PresidentCopy,
} from "@/app/admin/components/PresidentForm";
import { db } from "@/lib/db/client";
import { siteContent, siteMedia } from "@/lib/db/schema";
import { content } from "@/lib/content";
import { dict, type Lang } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";

type SearchParams = Promise<{ saved?: string }>;

function presidentCopy(locale: Lang, document: unknown): PresidentCopy {
  const merged = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    document
  ) as { presidentPage: PresidentCopy };
  return merged.presidentPage;
}

export default async function AdminPresidentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [turkish, english, portrait] = await Promise.all([
    db.query.siteContent.findFirst({ where: eq(siteContent.locale, "tr") }),
    db.query.siteContent.findFirst({ where: eq(siteContent.locale, "en") }),
    db.query.siteMedia.findFirst({
      where: eq(siteMedia.key, "presidentPortrait"),
    }),
  ]);
  if (!turkish || !english) notFound();

  const tr = presidentCopy("tr", turkish.document);
  const en = presidentCopy("en", english.document);
  const saved = (await searchParams).saved === "1";

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Başkan mesajı"
        description="Başkanın adını, görevini, mesajını, fotoğrafını ve alternatif metnini tek yerden güncelleyin."
      />
      <PresidentForm
        copies={{ tr, en }}
        image={
          portrait
            ? { url: portrait.imageUrl, publicId: portrait.imagePublicId }
            : undefined
        }
        photoEnabled={tr.photoEnabled}
        saved={saved}
      />
    </>
  );
}
