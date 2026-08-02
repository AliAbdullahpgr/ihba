import { notFound, redirect } from "next/navigation";
import { isContentLocale } from "../document";

type Params = Promise<{ locale: string }>;

/**
 * The per-language index folded back into /admin/content, which carries the
 * language as `?locale=`. This route stays as a redirect: it is what older
 * bookmarks point at, and what `saveSiteContent` falls back to.
 */
export default async function ContentLocaleIndexPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isContentLocale(locale)) notFound();
  redirect(`/admin/content?locale=${locale}`);
}
