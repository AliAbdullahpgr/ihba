import { Languages } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCard, AdminPageHeader } from "@/app/admin/components/AdminUi";
import { ContentCards } from "../../../ContentCards";
import { countSections, isContentLocale, loadContentDocument } from "../../../document";
import { contentGroupByKey } from "../../../sections";

type Params = Promise<{ locale: string; group: string }>;

/** The sections inside one group, each opening its own field page. */
export default async function ContentGroupPage({ params }: { params: Params }) {
  const { locale, group: groupKey } = await params;
  if (!isContentLocale(locale)) notFound();
  const group = contentGroupByKey.get(groupKey);
  if (!group) notFound();

  const document = await loadContentDocument(locale);
  if (!document) notFound();

  const sections = countSections(document).filter((section) => section.group === group.key);
  if (!sections.length) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow={locale === "tr" ? "Türkçe içerik" : "İngilizce içerik"}
        backHref={`/admin/content?locale=${locale}`}
        backLabel="Website içeriğine dön"
        title={group.title}
        description={group.description}
        action={
          <div className="admin-language-switcher" aria-label="Dil seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <Link
              href={`/admin/content/tr/group/${group.key}`}
              className={locale === "tr" ? "admin-language-link is-active" : "admin-language-link"}
            >
              Türkçe
            </Link>
            <Link
              href={`/admin/content/en/group/${group.key}`}
              className={locale === "en" ? "admin-language-link is-active" : "admin-language-link"}
            >
              English
            </Link>
          </div>
        }
      />

      <AdminCard
        eyebrow={`${sections.length} bölüm`}
        title="Düzenlemek istediğiniz bölümü seçin"
        description="Her bölüm kendi sayfasında açılır ve yalnızca orada kaydedilir."
      >
        <ContentCards
          items={sections.map((section) => ({
            key: section.key,
            href: `/admin/content/${locale}/${section.key}`,
            title: section.title,
            description: section.description,
            icon: section.icon,
            meta: `${section.count} alan`,
          }))}
        />
      </AdminCard>
    </>
  );
}
