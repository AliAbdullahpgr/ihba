import { blocksToHtml } from "@/lib/rich-text";

/**
 * Renders admin-authored body copy.
 *
 * The markup is re-sanitised here rather than trusted from the database: the
 * write path already filters it, but rendering is where an unsafe attribute
 * would actually matter, and rows predating the editor never passed through
 * that filter at all.
 */
export function RichText({
  blocks,
  className = "",
}: {
  blocks: string[];
  className?: string;
}) {
  const html = blocksToHtml(blocks);
  if (!html) return null;

  return (
    <div
      className={`rich-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
