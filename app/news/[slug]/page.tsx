import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailPage } from "@/app/components/pages/NewsDetailPage";
import { getPublicNewsArticle } from "@/lib/site-data";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicNewsArticle(slug);
  const translation = article?.newsTranslations.find(
    (item) => item.locale === "tr"
  );
  if (!article || !translation) return {};
  return { title: translation.title, description: translation.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!(await getPublicNewsArticle(slug))) notFound();
  return <NewsDetailPage slug={slug} />;
}
