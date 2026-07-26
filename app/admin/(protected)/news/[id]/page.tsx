import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { NewsForm } from "@/app/admin/components/NewsForm";
import { db } from "@/lib/db/client";
import { newsArticles } from "@/lib/db/schema";

type Params = Promise<{ id: string }>;

export default async function EditArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const article = await db.query.newsArticles.findFirst({
    where: eq(newsArticles.id, id),
    with: { newsTranslations: true },
  });
  if (!article) notFound();

  return (
    <>
      <AdminPageHeader title="Edit article" description={`/${article.slug}`} />
      <NewsForm article={article} />
    </>
  );
}
