import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ShareRow } from "@/app/components/ShareRow";
import { SpanRule, Tag } from "@/app/components/primitives";
import { articles, getArticle } from "@/lib/articles";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  return (
    <main className="bg-white">
      <article>
        <header className="container-site pt-12 pb-14 lg:pt-16 lg:pb-20">
          <Link
            href="/articles"
            className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-navy-ink/70 transition-colors hover:text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All articles
          </Link>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <Tag>{article.category}</Tag>
              <h1 className="display-xl mt-6 max-w-[24ch] text-[2.25rem] text-navy-ink sm:text-[3rem] lg:text-[3.75rem]">
                {article.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/70">
                {article.excerpt}
              </p>
            </div>
            <div className="flex items-end lg:col-span-3 lg:justify-end">
              <p className="border-l-2 border-gold pl-4 text-xs font-semibold leading-6 text-ink/55">
                <time dateTime={article.publishedAt}>
                  {new Date(`${article.publishedAt}T00:00:00`).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </time>
                <br />
                {article.readingTime}
              </p>
            </div>
          </div>

          <div className="mt-14">
            <SpanRule />
          </div>
        </header>

        <div className="container-site pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-2">
              <p className="eyebrow hidden border-t border-navy-ink/20 pt-4 text-ink/45 lg:block">
                Perspective
                <br />
                IHBA
              </p>
            </div>

            <div className="max-w-[46rem] lg:col-span-7">
              <div className="space-y-6 text-[1.0625rem] leading-[1.85] text-ink/78">
                {article.introduction.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? "text-xl leading-[1.7] text-navy-ink"
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {article.sections.map((section) => (
                <section
                  key={section.heading}
                  className="mt-14 border-t border-navy-ink/15 pt-9"
                >
                  <h2 className="font-display text-2xl font-medium leading-tight text-navy-ink sm:text-[1.75rem]">
                    {section.heading}
                  </h2>
                  <div className="mt-6 space-y-6 text-[1.0625rem] leading-[1.85] text-ink/78">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="mt-14 border-l-2 border-gold bg-gold-mist px-6 py-8 sm:px-9">
                <h2 className="font-display text-2xl font-medium text-navy-ink">
                  Building stronger futures
                </h2>
                <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.85] text-ink/78">
                  {article.conclusion.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <div className="mt-14 border-t border-navy-ink/15 pt-7">
                <ShareRow title={article.title} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
