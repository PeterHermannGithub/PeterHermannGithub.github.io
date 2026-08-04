---
paths:
  - "assets/css/**"
  - "assets/js/**"
  - "**/*.html"
---

# Design language

The site uses an **editorial-technical** look, chosen specifically so it does *not* read as
AI-generated boilerplate. When you touch the design, hold the line on these.

## The anti-slop principles

1. **Typography carries the personality.** Display and body are **Space Grotesk**;
   metadata, labels, nav, stats and code-ish UI use **Space Mono**. Never reintroduce Inter
   or a bare system-font stack as the brand face — that is the single most common "AI
   website" tell.
2. **One owned accent, used functionally.** The accent is an **acid lime**
   (`--accent: #c8f751`), marking interaction and emphasis. No purple/blue gradients, no
   "make it pop" gradient text, no rainbow.
3. **Hierarchy through variation, not uniformity.** Vary type scale and layout (the
   asymmetric hero, the stat strip). Avoid every-card-identical grids with one radius and
   one shadow everywhere — another classic tell.
4. **Sharp, flat surfaces.** Small radii (`--radius: 6px`), hairline borders, no soft
   drop-shadows. Hover = border turns accent plus a small lift, nothing more.
5. **Intentional motion only.** One subtle scroll-in (`.animate-on-scroll`) and
   micro-interactions. No typing animation, no decorative blanket fades. Everything respects
   `prefers-reduced-motion`.
6. **Specific, human copy.** Real numbers and a real voice. No "passionate developer creating
   modern web experiences", no vague aspirational filler.
7. **No emoji in UI, content, code, or docs.** Use the accent, mono labels, or inline SVG.
   Arrows (`→ ↗`) and `×` are typographic glyphs and are fine.

## Design tokens

All visual constants are CSS custom properties at the top of `assets/css/style.css`
(`:root` = dark, `html.light-mode` = light overrides). Change colours, fonts, radius and
spacing there and they cascade site-wide across both themes.

Key tokens: `--bg-color`, `--bg-secondary-color`, `--bg-elevated-color`, `--text-color`,
`--text-muted-color`, `--border-color`, `--accent`, `--accent-hover`, `--accent-text`
(accent as text on the page background — a deeper lime in light mode for contrast),
`--accent-ink` (text placed on an accent fill), `--font-display`, `--font-body`,
`--font-mono`, `--radius`/`--radius-sm`/`--radius-lg`, `--ease`.

`--primary-color` / `--primary-hover-color` are back-compat aliases for `--accent` so older
rules keep working.

The bulk of the editorial look lives in the **`EDITORIAL-TECHNICAL OVERHAUL`** block at the
end of `style.css`. It is loaded last and intentionally wins the cascade over the legacy
component rules above it — if a change appears not to apply, check whether an overhaul rule
is overriding it rather than adding `!important`.

## Theme

Dark is the default: the page is dark with no class on `<html>`, and light is opt-in via
`.light-mode`, set pre-paint by an inline script in each page and toggled by `main.js`.
Inverting this means updating the inline script in **every** page as well as `main.js`, or
the site flashes the wrong theme before paint.
