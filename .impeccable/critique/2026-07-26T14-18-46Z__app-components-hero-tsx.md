---
target: homepage hero section
total_score: 27
p0_count: 0
p1_count: 3
timestamp: 2026-07-26T14-18-46Z
slug: app-components-hero-tsx
---
# Design Critique — Homepage hero (app/components/Hero.tsx)

## Design Health Score: 27/40 (Acceptable)

Scope note: Nielsen's 10 are a blunt instrument on a single hero. 5 and 9 have
nothing to exercise them; 1, 7 and 10 are largely inherited from the page shell.
Weight 4 and 8 heaviest — they are what the question was actually about.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Locale toggle marks the active language in gold-deep while the *inactive* one sits in near-black navy — the inactive reads stronger. No active-nav state. |
| 2 | Match System / Real World | 3 | Copy is human and specific; "Bağış Yapın" still promises a transaction /donate can't complete. "Daha fazlası" names no destination. |
| 3 | User Control and Freedom | 3 | Everything is a real link, nothing traps. Locale still not deep-linkable or persisted. |
| 4 | Consistency and Standards | 3 | Strong system discipline (rationed arch, one radius, one circle) undercut by three unrelated right-hand edges in the left column and a signature mark that breaks differently per locale. |
| 5 | Error Prevention | 3 | n/a — no inputs in the hero. |
| 6 | Recognition Rather Than Recall | 4 | Every affordance labelled in words, nav is text, nothing hidden behind an icon. |
| 7 | Flexibility and Efficiency | 2 | Three fixed type steps (36/44/54px), no fluid scale — identical headline size at 1024px and 2560px while the column grows ~400px. |
| 8 | Aesthetic and Minimalist Design | 2 | ~300px dead column, four CTAs in one fold, stray gold square, mark device mis-breaking. |
| 9 | Error Recovery | 3 | n/a in the hero. |
| 10 | Help and Documentation | 2 | No cue that the page continues; the fold ends mid-photograph with nothing signalling more. |
| **Total** | | **27/40** | **Acceptable — a well-built hero with a composition problem** |

## Anti-Patterns Verdict

**LLM assessment**: Not slop. This reads as a designed page with a real system
behind it — the arch derived from the logo's bridge, the span rule with piers,
one radius, exactly one circle in the whole system and a comment in globals.css
explaining why. Those are identity decisions, not template output. Held against
it: the synthetic photograph still has AI sheen (four smiling people, mixed
ethnicity, golden-hour rim light, a box of bottled water — the canonical NGO
stock composition), and the font pairing is Space Grotesk + Inter, both on the
reflex-reject list. Identity-preservation applies to the fonts (already shipping,
already the brand); the photograph is a live problem because the hero is where a
donor decides whether this organisation is real.

**Deterministic scan**: `detect.mjs --json app` → `[]`, exit 0. Clean, same as
the 2026-07-25 run. No code-level slop patterns.

**Browser visualization**: not attempted — no browser automation tool available
in this session. Evidence is the user-supplied 1920×1080 viewport capture plus
measured layout arithmetic from source. No user-visible overlay exists.

## Overall Impression

The parts are better than the composition. Every individual decision in this
hero is defensible and several are genuinely good, but the two columns don't
resolve against each other: the left one runs out of content ~300px before the
right one ends, so the eye lands on a hole under the buttons. And the headline —
the one element with permission to be loud — is set at 54px and spends its first
50 characters clearing its throat before reaching the idea worth reading.

Single biggest opportunity: promote the conviction to the headline. "Onur
verilmez, birlikte inşa edilir." is a real line. It's currently the tail of a
sentence that starts with "Yaptığımız her şeyin merkezinde tek bir inanç var:" —
50 characters of setup at display size.

## What's Working

1. **The arch, and its rationing.** `border-radius: 50% 50% 0 0 / 38% 38% 0 0`
   with percentage radii so it scales instead of flattening, plus a second empty
   arch stepped 20px behind it. Derived from the logo, reserved for feature
   imagery only, in a system where nothing else curves. That's why it reads as a
   mark rather than as rounding.
2. **`mark-block` is implemented correctly.** `box-decoration-break: clone` with
   em-based padding — the highlight survives a line wrap without a torn box.
   Most implementations of this device get it wrong.
3. **Body-copy contrast is right.** `text-ink/70` computes to ≈6.0:1 on white.
   The most common failure in this aesthetic is light-grey body text for
   elegance; this resisted it.

## Priority Issues

- **[P1] The columns end 300px apart.** Left column: 4 headline lines (246px) +
  32 + 3 subcopy lines (78px) + 32 + 44px buttons ≈ 432px. Right column at
  col-span-5 is ~471px wide, so the 4:5 image alone is ~589px, and the figcaption
  adds ~140px → ~729px. That's ~297px of nothing under the CTAs, which the
  screenshot confirms. It reads as unfinished, not as negative space. Fix: move
  the `feature` figcaption into the left column bottom-aligned against the
  image's baseline, or let the image bleed off the right viewport edge and grow,
  or pull the SpanRule + chips row up to close the column. Suggested:
  `/impeccable layout`
- **[P1] The headline never reaches display scale, and never scales.**
  `text-[2.25rem] sm:text-[2.75rem] lg:text-[3.375rem]` — three fixed steps,
  1.22 between them, nothing above 1024px. At 54px with -0.02em, Space Grotesk
  reads as a large UI heading, not a broadsheet headline. There is headroom to
  ~96px. Compounding it: 87 characters across 4 lines, the first 50 of which are
  preamble. Fix: `clamp()` to ~72–80px at the top end, cut the preamble or demote
  it to a standfirst above the h1, and add the project's own `text-balance`
  utility (defined in globals.css, used in SectionHeader and PresidentQuote, but
  not here). Suggested: `/impeccable typeset`
- **[P1] Four CTAs in one fold, and the heaviest one points at the least
  important destination.** Header "Bağış", hero "Bağış Yapın" (solid navy),
  "Çalışmalarımız" (outline), and "Daha fazlası" carrying a filled navy
  `ArrowDisc` — the only circle in the design system, therefore the single most
  visually magnetic element in the fold — routing to /about. Four options at one
  decision point sits at the working-memory limit, and the visual hierarchy
  actively misranks them. Fix: strip the disc from the figcaption link (plain
  underlined text), or drop that CTA — a photo caption isn't a competing offer.
  Suggested: `/impeccable distill`
- **[P2] The signature mark breaks wherever the column happens to end.** The
  highlight starts mid-sentence, so in TR at this width it splits into two ragged
  boxes — "birlikte" beginning mid-line 3, "inşa edilir." on line 4 — with
  nothing aligning. In EN ("built together.") it will break somewhere else
  entirely. The most recognisable device in the system currently renders
  differently per locale and per viewport with no authorial control. Fix: keep
  the marked phrase short enough that it cannot wrap, or restructure so the mark
  begins a line. Suggested: `/impeccable typeset`
- **[P2] `gold-deep` on white fails AA at the sizes it's used.** #A98843 on
  white = 3.34:1. The `eyebrow` utility is 11px bold and the locale toggle is
  12px bold — both need 4.5:1. So "HİKÂYEMİZ" in the hero figcaption and the
  active-language indicator are both below AA, and the toggle additionally
  signals state by colour alone. Fix: darken gold-deep for text use (a separate
  `--color-gold-text` around #7A6026 clears 4.5:1) and give the active locale a
  non-colour cue. Suggested: `/impeccable audit`

## Persona Red Flags

**Jordan (first-time TR donor)**: reads 87 characters of headline before learning
what IHBA does — the subcopy carries that load, in 16px grey, below the fold's
visual centre. First glance gives a photograph and a philosophical claim.
"Daha fazlası" is the boldest-looking link and it leads away from donating. The
photograph's AI sheen plants the "is this real?" doubt at first contact.

**Riley (stress-tester)**: at 1440px the headline is the same 54px as at 1024px
while the column is 400px wider. Resizes to ~1100px and watches the mark device
re-break into a different ragged shape. Switches to EN and the highlight lands
somewhere else again. Notes the hero `alt` text is hardcoded English on a
Turkish-default page.

**Casey (mobile)**: at <lg the grid collapses and the image gets `mt-14` — so
the order becomes headline, copy, two buttons, then a 589px-tall photograph, then
a caption with a third CTA, then the chips. Both primary CTAs are above the
photograph and reachable, which is right. But the fold on a 390×844 phone ends
inside the headline: 36px × 1.14 over ~6 lines of Turkish plus the 56px header
means the CTAs are two scrolls down.

## Minor Observations

Subcopy `max-w-lg` (512px) inside a ~660px column produces a third right-hand
edge — headline runs to ~820px, paragraph stops at ~512px, buttons at ~360px,
none aligned · hero `<img>` has no `fetchpriority="high"` though it is certainly
the LCP element and `images.unoptimized` means no framework help (the
`aspect-[4/5]` class does reserve the box, so CLS is fine) · 170KB webp is a
respectable weight · the 20px `bg-gold` square hanging off the arch's left edge
has no relationship to the span rule's 6rem pier interval and isn't repeated, so
it reads as a stray div rather than a pier · TR subcopy "insani yardımı eğitim,"
garden-paths — the eye parses "insani yardımı eğitim" as one unit before the
comma resolves it (EN confirms the intent is "assistance *with* education"); an
"ile" or a recast would fix it · logo wordmark carries a dotted İ while running
copy uses undotted IHBA — worth confirming that's intentional · hero `alt` is
English on the TR-default page · no scroll affordance at a fold that ends
mid-photograph.

## Questions to Consider

1. What if the headline were just "Onur verilmez, birlikte inşa edilir." at 76px,
   and the current preamble became a small standfirst above it?
2. The photograph is the largest, most expensive-looking element in the fold and
   it's synthetic. Would one real photograph — the founding board, the Sultanbeyli
   office, the Mazar-i-Sharif land — do more for a donor's trust than a polished
   composite?
3. Is the figcaption earning its place in the hero at all, or is it a second
   story competing with the first one for the same fold?
