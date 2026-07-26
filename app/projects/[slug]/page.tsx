import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/app/components/pages/ProjectDetailPage";
import { projectSlugs } from "@/app/components/pages/projectImages";
import { content } from "@/lib/content";

/** Static export needs every project route enumerated at build time. */
export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  /* Turkish is the default language, so the prerendered metadata is Turkish. */
  const project = content.tr.projectsPage.details.find(
    (item) => item.slug === slug
  );
  if (!project) return {};

  return {
    title: project.title,
    description: project.body[0],
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  if (!projectSlugs.includes(slug)) notFound();
  return <ProjectDetailPage slug={slug} />;
}
