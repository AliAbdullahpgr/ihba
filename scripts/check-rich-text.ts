import { sanitizeRichTextHtml, toBlockHtml, parseRichTextBlocks, stripHtml, blocksToHtml } from "../lib/rich-text";

const cases: Array<[string, string, string]> = [
  ["strips script", sanitizeRichTextHtml('<p>hi</p><script>alert(1)</script>'), "<p>hi</p>"],
  ["drops javascript: href", sanitizeRichTextHtml('<a href="javascript:alert(1)">x</a>'), "x"],
  ["keeps https link + rel", sanitizeRichTextHtml('<a href="https://a.com">x</a>'), '<a href="https://a.com" target="_blank" rel="noopener noreferrer">x</a>'],
  ["keeps relative link", sanitizeRichTextHtml('<a href="/news">x</a>'), '<a href="/news">x</a>'],
  ["strips onclick", sanitizeRichTextHtml('<p onclick="evil()">hi</p>'), "<p>hi</p>"],
  ["unwraps disallowed tag", sanitizeRichTextHtml('<div><p>hi</p></div>'), "<p>hi</p>"],
  ["strips img", sanitizeRichTextHtml('<img src=x onerror=alert(1)>'), ""],
  ["legacy plain text", toBlockHtml("Merhaba dünya"), "<p>Merhaba dünya</p>"],
  ["legacy ## heading", toBlockHtml("## Başlık"), "<h2>Başlık</h2>"],
  ["escapes legacy angle brackets", toBlockHtml("a < b & c"), "<p>a &lt; b &amp; c</p>"],
  ["keeps html block", toBlockHtml("<p><strong>bold</strong></p>"), "<p><strong>bold</strong></p>"],
  ["keeps list", toBlockHtml("<ul><li>bir</li><li>iki</li></ul>"), "<ul><li>bir</li><li>iki</li></ul>"],
];

let failed = 0;
for (const [name, actual, expected] of cases) {
  if (actual !== expected) { failed++; console.log(`FAIL ${name}\n  got:      ${actual}\n  expected: ${expected}`); }
  else console.log(`ok   ${name}`);
}

// round trips
const blocks = parseRichTextBlocks(JSON.stringify(["<p>Bir</p>", "<p></p>", "<h2>İki</h2>", "<p><em>üç</em></p>"]));
console.log(JSON.stringify(blocks) === JSON.stringify(["<p>Bir</p>","<h2>İki</h2>","<p><em>üç</em></p>"]) ? "ok   drops empty blocks" : (failed++, `FAIL empty blocks: ${JSON.stringify(blocks)}`));

const legacy = parseRichTextBlocks("Bir paragraf.\n\nİkinci paragraf.");
console.log(JSON.stringify(legacy) === JSON.stringify(["Bir paragraf.","İkinci paragraf."]) ? "ok   legacy no-JS fallback" : (failed++, `FAIL legacy: ${JSON.stringify(legacy)}`));

const strip = stripHtml("<p>Merhaba <strong>dünya</strong></p><p>ikinci</p>");
console.log(strip === "Merhaba dünya ikinci" ? "ok   stripHtml" : (failed++, `FAIL stripHtml: "${strip}"`));

const mixed = blocksToHtml(["Eski paragraf", "## Eski başlık", "<p>Yeni <strong>metin</strong></p>"]);
console.log(mixed === "<p>Eski paragraf</p><h2>Eski başlık</h2><p>Yeni <strong>metin</strong></p>" ? "ok   mixed legacy+new row" : (failed++, `FAIL mixed: ${mixed}`));

console.log(failed ? `\n${failed} FAILED` : "\nAll passed");
