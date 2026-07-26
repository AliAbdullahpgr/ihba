# Design System

## Theme

IHBA uses a restrained editorial system based on institutional ledgers and the
structural language of a bridge. Public pages are white-led, sharp-edged, and
spacious. Admin pages reuse the brand tokens while increasing density and
reducing display treatments.

## Colors

- Navy: `#204080`
- Deep navy: `#243A63`
- Ink navy: `#262A33`
- Azure: `#2E8FD4`
- Deep azure: `#1C7BB8`
- Gold: `#C7A45F`
- Deep gold: `#A98843`
- Line: `#E3ECF5`
- White: `#FFFFFF`
- Warm supporting surface: `#F3EDDF`
- Text ink: `#1A1F36`

Admin surfaces use white for content, `azure-mist` for navigation and selected
rows, navy for primary actions, gold only for warnings or publishing emphasis,
and semantic red/green colors only for destructive and success states.

## Typography

- Public display: Space Grotesk, medium to bold.
- Body and all admin UI: Inter.
- Admin headings use a fixed compact scale; display typography is reserved for
  the admin product name and empty states.
- Public typography and spacing remain unchanged.

## Components

- Square controls and panels with one-pixel rules.
- Buttons have a 44px minimum target and use Lucide icons when available.
- Tables and ledgers use horizontal rules rather than floating cards.
- Status labels are compact and high contrast.
- Inputs include default, hover, focus, invalid, disabled, and loading states.
- Destructive actions require an explicit confirmation surface.

## Layout

- Public pages retain the existing `container-site` layout.
- Admin uses a fixed desktop sidebar, compact top bar, and full-width work area.
- Sidebar collapses to an accessible drawer on narrow viewports.
- Forms use a readable two-column layout where fields are naturally paired.
- No nested cards or decorative section containers.

## Motion

Admin transitions communicate state only and run for 150-200ms. All motion has
a reduced-motion alternative. Public motion remains unchanged.
