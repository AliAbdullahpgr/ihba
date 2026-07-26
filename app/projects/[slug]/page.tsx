import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/app/components/pages/ProjectDetailPage";
import { getPublicProject } from "@/lib/site-data";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  const translation = project?.projectTranslations.find(
    (item) => item.locale === "tr"
  );
  if (!project || !translation) return {};

  return {
    title: translation.title,
    description: translation.summary,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  if (!(await getPublicProject(slug))) notFound();
  return <ProjectDetailPage slug={slug} />;
}
