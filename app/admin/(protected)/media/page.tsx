import { isNotNull } from "drizzle-orm";
import Link from "next/link";
import { saveSiteMedia } from "@/app/admin/actions";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import { db } from "@/lib/db/client";
import { newsArticles, projects, siteMedia } from "@/lib/db/schema";
import { mediaLabels, type SiteMediaKey } from "@/lib/media";

export default async function AdminMediaPage() {
  const [siteMediaRows, projectMedia, newsMedia] = await Promise.all([
    db.select().from(siteMedia),
    db
      .select({
        id: projects.id,
        slug: projects.slug,
        url: projects.imageUrl,
        publicId: projects.imagePublicId,
      })
      .from(projects)
      .where(isNotNull(projects.imageUrl)),
    db
      .select({
        id: newsArticles.id,
        slug: newsArticles.slug,
        url: newsArticles.imageUrl,
        publicId: newsArticles.imagePublicId,
      })
      .from(newsArticles)
      .where(isNotNull(newsArticles.imageUrl)),
  ]);
  const media = [
    ...projectMedia.map((item) => ({
      ...item,
      type: "Project",
      href: `/admin/projects/${item.id}`,
    })),
    ...newsMedia.map((item) => ({
      ...item,
      type: "News",
      href: `/admin/news/${item.id}`,
    })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Replace shared website photography here. Project and news images are managed in their editors."
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy-ink">
          Shared website images
        </h2>
        <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(mediaLabels) as SiteMediaKey[]).map((key) => {
            const item = siteMediaRows.find((row) => row.key === key);
            return (
              <form key={key} action={saveSiteMedia} className="bg-white">
                <input type="hidden" name="key" value={key} />
                <ImageUpload
                  initialUrl={item?.imageUrl}
                  initialPublicId={item?.imagePublicId}
                />
                <div className="flex items-center justify-between gap-3 border-t border-line p-4">
                  <p className="font-semibold text-navy-ink">
                    {mediaLabels[key]}
                  </p>
                  <button
                    type="submit"
                    className="min-h-10 bg-navy-deep px-3 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  >
                    Save
                  </button>
                </div>
              </form>
            );
          })}
        </div>
      </section>

      <section className="mt-8 border-t border-navy-ink/25 pt-5">
        <h2 className="mb-3 text-sm font-semibold text-navy-ink">
          Project and news images
        </h2>
      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
        {media.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.href}
            className="group bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure"
          >
            <img
              src={item.url ?? ""}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="border-t border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-semibold text-navy-ink">{item.slug}</p>
                <span className="text-xs font-semibold text-ink/45">{item.type}</span>
              </div>
              <p className="mt-1 truncate text-xs text-ink/45">
                {item.publicId ?? "Bundled website image"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {!media.length && (
        <div className="border border-line bg-white px-6 py-14 text-center">
          <p className="font-semibold text-navy-ink">No media attached</p>
          <p className="mt-1 text-sm text-ink/55">
            Upload an image while editing a project or article.
          </p>
        </div>
      )}
      </section>
    </>
  );
}
