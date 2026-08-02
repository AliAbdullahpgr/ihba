import { asc, desc, eq } from "drizzle-orm";
import { ArrowUpRight, CheckCircle2, Languages, ListTree } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton, AdminPageHeader } from "@/app/admin/components/AdminUi";
import {
  HomepageSectionEditor,
  type CampaignData,
  type HomepageSection,
  type SelectOption,
} from "@/app/admin/components/HomepageSectionEditor";
import { content } from "@/lib/content";
import { fieldsAtPaths } from "@/lib/content-fields";
import { db } from "@/lib/db/client";
import {
  newsArticles,
  newsTranslations,
  projects,
  projectTranslations,
  siteContent,
  siteMedia,
} from "@/lib/db/schema";
import { readHomepageSelection } from "@/lib/homepage-sections";
import { dict, type Lang } from "@/lib/i18n";
import { bundledMedia, mediaLabels } from "@/lib/media";
import { mergeContentDefaults } from "@/lib/merge-content";

type SearchParams = Promise<{ locale?: string; saved?: string }>;

/**
 * Picks the translation for the requested language, falling back to Turkish —
 * English translations are optional throughout the admin, and an untranslated
 * article should still be selectable rather than vanishing from the list.
 */
function pickTranslation<T extends { locale: string }>(rows: T[], locale: Lang) {
  return rows.find((row) => row.locale === locale) ?? rows.find((row) => row.locale === "tr");
}

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const locale: Lang = params.locale === "en" ? "en" : "tr";

  const [row, newsRows, projectRows, mediaRows] = await Promise.all([
    db.query.siteContent.findFirst({ where: eq(siteContent.locale, locale) }),
    db
      .select({ article: newsArticles, translation: newsTranslations })
      .from(newsArticles)
      .innerJoin(newsTranslations, eq(newsTranslations.articleId, newsArticles.id))
      .where(eq(newsArticles.state, "published"))
      .orderBy(desc(newsArticles.publishedAt)),
    db
      .select({ project: projects, translation: projectTranslations })
      .from(projects)
      .innerJoin(projectTranslations, eq(projectTranslations.projectId, projects.id))
      .where(eq(projects.state, "published"))
      .orderBy(asc(projects.sortOrder)),
    db.select().from(siteMedia),
  ]);
  if (!row) notFound();

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown> & typeof dict.tr & typeof content.tr;
  const selection = readHomepageSelection(document.homepage);

  const newsOptions: SelectOption[] = Array.from(
    new Map(newsRows.map((entry) => [entry.article.id, entry.article])).values(),
  ).map((article) => {
    const translations = newsRows
      .filter((entry) => entry.article.id === article.id)
      .map((entry) => entry.translation);
    const translation = pickTranslation(translations, locale);
    const publishedAt = article.publishedAt ?? article.createdAt;
    return {
      id: article.slug,
      title: translation?.title ?? article.slug,
      meta: publishedAt.toLocaleDateString("tr-TR"),
      image: article.imageUrl ?? undefined,
    };
  });

  const projectOptions: SelectOption[] = Array.from(
    new Map(projectRows.map((entry) => [entry.project.id, entry.project])).values(),
  ).map((project) => {
    const translations = projectRows
      .filter((entry) => entry.project.id === project.id)
      .map((entry) => entry.translation);
    const translation = pickTranslation(translations, locale);
    return {
      id: project.slug,
      title: translation?.title ?? project.slug,
      meta: translation?.region ?? undefined,
      image: project.imageUrl ?? undefined,
    };
  });

  const mediaOptions = (Object.keys(mediaLabels) as Array<keyof typeof mediaLabels>).map(
    (key) => ({
      key,
      label: mediaLabels[key],
      url: mediaRows.find((media) => media.key === key)?.imageUrl ?? bundledMedia[key].url,
    }),
  );

  /**
   * The homepage, in the order visitors scroll through it. Keep this in step
   * with `app/components/Landing.tsx`.
   */
  const sections: HomepageSection[] = [
    {
      id: "banner",
      title: "Giriş bannerı",
      description: "Sayfanın en üstünde dönen büyük görseller, başlıklar ve çağrı butonları.",
      icon: "banner",
      kind: "link",
      href: "/admin/slider",
      action: "Bannerları yönet",
    },
    {
      id: "intro",
      title: "Tanıtım bölümü",
      description: "Kurumu kısaca anlatan giriş başlığı ve metni.",
      icon: "intro",
      kind: "fields",
      fields: fieldsAtPaths(document, [
        ["about", "title"],
        ["about", "lede"],
        ["about", "ledeExtra"],
      ]),
    },
    {
      id: "news",
      title: "Son haberler",
      description: "Anasayfada gösterilecek üç haberi seçin.",
      icon: "news",
      kind: "select",
      section: "news",
      options: newsOptions,
      selected: selection.news,
      automaticHint: "en yeni üç haber gösterilir.",
      emptyHint: "Henüz yayında haber yok. Önce Haberler sayfasından bir haber yayınlayın.",
      manageHref: "/admin/news",
      manageLabel: "Haberler sayfasına gidin",
    },
    {
      id: "projects",
      title: "Projeler",
      description: "Anasayfada öne çıkacak üç projeyi seçin.",
      icon: "projects",
      kind: "select",
      section: "projects",
      options: projectOptions,
      selected: selection.projects,
      automaticHint: "listedeki ilk üç proje gösterilir.",
      emptyHint: "Henüz yayında proje yok. Önce Projeler sayfasından bir proje yayınlayın.",
      manageHref: "/admin/projects",
      manageLabel: "Projeler sayfasına gidin",
    },
    {
      id: "president",
      title: "Başkanın mesajı",
      description: "Anasayfadaki başkan bölümünün başlığı, alıntısı ve isim bilgisi.",
      icon: "president",
      note: "Fotoğraf ve tam mesaj için Başkan mesajı sayfasını kullanın.",
      kind: "fields",
      fields: fieldsAtPaths(document, [
        ["presidentPage", "title"],
        ["presidentPage", "lede"],
        ["presidentPage", "name"],
        ["presidentPage", "role"],
        ["presidentPage", "imageAlt"],
      ]),
    },
    {
      id: "campaign",
      title: "Kampanya çağrısı",
      description: "Bağış ya da kampanya için öne çıkan geniş çağrı bölümü.",
      icon: "campaign",
      kind: "campaign",
      campaign: document.campaign as CampaignData,
      mediaOptions,
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Anasayfa"
        title="Anasayfa düzeni"
        description="Anasayfa, ziyaretçilerin gördüğü sırayla aşağıda listelenmiştir. Düzenlemek istediğiniz bölümü seçin."
        action={
          <div className="admin-homepage-header-actions">
            <div className="admin-language-switcher" aria-label="İçerik dili seçimi">
              <Languages className="size-4" aria-hidden="true" />
              <AdminButton
                href="/admin/homepage?locale=tr"
                variant={locale === "tr" ? "primary" : "secondary"}
              >
                Türkçe
              </AdminButton>
              <AdminButton
                href="/admin/homepage?locale=en"
                variant={locale === "en" ? "primary" : "secondary"}
              >
                English
              </AdminButton>
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-button admin-button-secondary"
            >
              Anasayfayı görüntüle <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      {params.saved === "1" && (
        <div className="admin-feedback admin-feedback-success" role="status">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Değişiklikler kaydedildi. Website kısa süre içinde güncellenecek.
        </div>
      )}

      <HomepageSectionEditor locale={locale} sections={sections} />

      {/*
        This screen curates the homepage — which items appear, in what order —
        and exposes only the handful of fields that belong to that decision.
        Everything else the homepage says lives in the content editor, so point
        there rather than leaving people to guess where a stray line is set.
      */}
      <div className="admin-content-language-note">
        <ListTree className="size-4" aria-hidden="true" />
        <p>
          <strong>Aradığınız metin burada yok mu?</strong> Anasayfadaki tüm bölümlerin metinleri —
          kayan şerit, istatistikler, bülten, iletişim çağrısı ve diğerleri —{" "}
          <Link href={`/admin/content/${locale}/group/homepage`}>
            Anasayfa bölümleri sayfasında
          </Link>{" "}
          tek tek düzenlenir.
        </p>
      </div>

      {/*
        Three sections used to be edited on this screen and are no longer on the
        homepage at all. Staff who knew them by name would otherwise scroll this
        list looking for something that has quietly gone, so say where each one
        went rather than let the absence speak for itself.
      */}
      <div className="admin-content-language-note">
        <ListTree className="size-4" aria-hidden="true" />
        <p>
          <strong>Misyon, vizyon, değerler ve sık sorulan sorular anasayfadan kaldırıldı.</strong>{" "}
          Bu bölümler artık{" "}
          <Link href="/about" target="_blank" rel="noreferrer">
            Hakkımızda sayfasında
          </Link>{" "}
          görünüyor; metinlerini{" "}
          <Link href={`/admin/content/${locale}/about`}>Hakkımızda önizlemesi</Link> ve{" "}
          <Link href={`/admin/content/${locale}/faq`}>Sıkça sorulan sorular</Link> sayfalarından
          düzenleyebilirsiniz. Faaliyet alanları bölümü de kaldırıldı; alanlar yalnızca{" "}
          <Link href="/areas-of-work" target="_blank" rel="noreferrer">
            Faaliyet Alanlarımız sayfasında
          </Link>{" "}
          yer alıyor.
        </p>
      </div>
    </>
  );
}
