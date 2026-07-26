import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDisc, SpanRule, Tag } from "@/app/components/primitives";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Ideas and perspectives from IHBA on humanitarian assistance, education and sustainable development.",
};

export default function ArticlesPage() {
  return (
    <>
      <header className="bg-white">
        <div className="container-site pt-12 pb-14 lg:pt-16 lg:pb-16">
          <p className="eyebrow mb-5 text-gold-deep">Ideas & perspectives</p>
          <h1 className="display-xl max-w-[18ch] text-[2rem] text-navy-ink sm:text-[2.5rem] lg:text-[3rem]">
            Articles
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/70">
            Reflections on humanitarian assistance, education and the patient
            work of building stronger communities.
          </p>
          <div className="mt-12">
            <SpanRule />
          </div>
        </div>
      </header>

      <main className="bg-white pb-20 lg:pb-28">
        <div className="container-site">
          <div className="border-t border-navy-ink/15">
            {articles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group grid gap-8 border-b border-navy-ink/15 py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure md:grid-cols-12 md:py-14"
              >
                <div className="md:col-span-2">
                  <span className="font-display text-sm font-medium text-navy-ink/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="md:col-span-7">
                  <Tag>{article.category}</Tag>
                  <h2 className="mt-5 font-display text-2xl font-medium leading-tight text-navy-ink decoration-gold decoration-2 underline-offset-4 group-hover:underline sm:text-3xl">
                    {article.title}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-end justify-between gap-5 md:col-span-3 md:flex-col md:items-end">
                  <p className="text-xs font-semibold text-ink/45">
                    <time dateTime={article.publishedAt}>
                      {new Date(`${article.publishedAt}T00:00:00`).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </time>
                    <span className="mx-2" aria-hidden="true">·</span>
                    {article.readingTime}
                  </p>
                  <ArrowDisc />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
