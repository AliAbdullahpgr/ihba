/**
 * Rich text storage format.
 *
 * Long-form copy (news articles, project write-ups) is stored the way it always
 * was: a `string[]` on the row, one entry per top-level block. What changed is
 * that an entry may now be a block of HTML — `<p>…</p>`, `<h2>…</h2>`,
 * `<ul>…</ul>` — instead of only a bare line of text.
 *
 * Keeping the column shape means no migration and no coordinated deploy: rows
 * written before the editor existed still hold plain strings, and every reader
 * goes through `toBlockHtml` below, which promotes those older entries to
 * paragraphs (and honours the `## ` heading convention the textarea hint used
 * to document). Mixed content within a single row is fine.
 */

const ALLOWED_TAGS: Record<string, readonly string[]> = {
  p: [],
  h2: [],
  h3: [],
  strong: [],
  em: [],
  u: [],
  s: [],
  ul: [],
  ol: [],
  li: [],
  blockquote: [],
  br: [],
  a: ["href", "target", "rel"],
};

/** Tags whose *contents* are dropped along with the tag, not unwrapped. */
const VOID_CONTENT_TAGS = ["script", "style", "iframe", "object", "embed", "template"];

const TAG_RE = /<(\/)?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g;
const ATTR_RE = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Only ever called on content an authenticated admin wrote, so this is
 * defence in depth rather than the trust boundary — but the editor output is
 * rendered with `dangerouslySetInnerHTML`, and an allowlist is cheap insurance
 * against a paste from a compromised source smuggling markup through.
 */
function safeHref(rawHref: string) {
  const href = rawHref.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  // Relative links stay in-site; anything else (javascript:, data:, …) is dropped.
  if (href.startsWith("/") || href.startsWith("#")) return href;
  return null;
}

export function sanitizeRichTextHtml(input: string) {
  let html = input.replace(/<!--[\s\S]*?-->/g, "");

  for (const tag of VOID_CONTENT_TAGS) {
    html = html
      .replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, "gi"), "")
      .replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }

  // An anchor whose href is rejected gets unwrapped, and its closing tag has to
  // be dropped with it or the output is left with a stray `</a>`. Anchors cannot
  // nest, so a counter is enough to pair them up.
  let unwrappedAnchors = 0;

  return html.replace(TAG_RE, (match, closing: string | undefined, rawName: string, rawAttrs: string) => {
    const name = rawName.toLowerCase();
    const allowedAttrs = ALLOWED_TAGS[name];
    // Unknown tag: drop the tag itself but keep whatever it wrapped.
    if (!allowedAttrs) return "";
    if (closing) {
      if (name === "a" && unwrappedAnchors > 0) {
        unwrappedAnchors -= 1;
        return "";
      }
      return `</${name}>`;
    }
    if (name === "br") return "<br />";

    const attrs: string[] = [];
    let external = false;
    for (const attr of rawAttrs.matchAll(ATTR_RE)) {
      const attrName = attr[1].toLowerCase();
      if (!allowedAttrs.includes(attrName)) continue;
      const value = attr[2] ?? attr[3] ?? attr[4] ?? "";
      if (attrName === "href") {
        const href = safeHref(value);
        if (!href) continue;
        external = /^https?:\/\//i.test(href);
        attrs.push(`href="${escapeHtml(href)}"`);
      } else if (attrName === "target" || attrName === "rel") {
        // Recomputed below so the pair is always consistent.
        continue;
      }
    }

    if (name === "a") {
      // A link that lost its href is no longer a link; unwrap it so the text
      // survives rather than rendering a dead anchor.
      if (!attrs.length) {
        unwrappedAnchors += 1;
        return "";
      }
      if (external) attrs.push('target="_blank"', 'rel="noopener noreferrer"');
    }

    return attrs.length ? `<${name} ${attrs.join(" ")}>` : `<${name}>`;
  });
}

/** True when a stored entry is already a block of markup rather than bare text. */
function isHtmlBlock(value: string) {
  return /^<(p|h2|h3|ul|ol|blockquote)\b/i.test(value.trim());
}

/**
 * Normalises one stored entry into renderable block HTML, absorbing the two
 * pre-editor conventions: `## ` prefixed headings and plain paragraph text.
 */
export function toBlockHtml(block: string) {
  const value = block.trim();
  if (!value) return "";
  if (isHtmlBlock(value)) return sanitizeRichTextHtml(value);
  if (value.startsWith("## ")) return `<h2>${escapeHtml(value.slice(3).trim())}</h2>`;
  return `<p>${escapeHtml(value)}</p>`;
}

/** Stored blocks → a single HTML string, for the editor and for rendering. */
export function blocksToHtml(blocks: string[]) {
  return blocks.map(toBlockHtml).filter(Boolean).join("");
}

/**
 * Reads what the editor submitted. The client sends a JSON array of blocks
 * (it has a real DOM parser available, so it splits far more reliably than we
 * could here); anything else is treated as legacy blank-line-separated text so
 * that a form posted without JavaScript still saves sensible content.
 */
export function parseRichTextBlocks(raw: string): string[] {
  const value = raw.trim();
  if (!value) return [];

  if (value.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((block): block is string => typeof block === "string")
          .map((block) => sanitizeRichTextHtml(block).trim())
          .filter((block) => block && !isEmptyBlock(block));
      }
    } catch {
      // Fall through to the plain-text reading below.
    }
  }

  return value
    .split(/\r?\n\s*\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/** An `<p></p>` left behind by an empty trailing line carries no content. */
function isEmptyBlock(block: string) {
  return !stripHtml(block).trim();
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/**
 * Plain-text projection, for the places that need words without markup:
 * the project deck, list-page summaries, and meta descriptions.
 */
export function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|h2|h3|li|blockquote)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Stored blocks → plain text, e.g. for the lede promoted out of a body. */
export function blocksToPlainText(blocks: string[]) {
  return blocks.map(stripHtml).filter(Boolean).join(" ");
}
