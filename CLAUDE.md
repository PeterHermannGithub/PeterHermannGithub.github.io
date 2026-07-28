# CLAUDE.md — PeterHermannGithub.github.io

## Documentation policy

This repository keeps exactly two docs:

1. **CLAUDE.md** (this file) — guidance for AI assistants and the technical reference.
2. **README.md** — human quick-start.

Update both when a change makes them stale.

---

## What this is

A personal portfolio for Peter Pal Hermann (data scientist / ML engineer), built
as a static site in plain HTML/CSS/JS and deployed on GitHub Pages. No build step,
no framework, no bundler. Edit files, push, done. Custom domain lives in `CNAME`.

It is bilingual (EN/HU), has a dark/light theme, a client-side search, and an
interactive code viewer.

---

## Design language (read before changing anything visual)

The site uses an **editorial-technical** look, chosen specifically to *not* read as
AI-generated boilerplate. When you touch the design, hold the line on these rules.

**The anti-slop principles** (these are the point — don't regress them):

1. **Typography carries the personality.** Display + body is **Space Grotesk**;
   metadata, labels, nav, stats, and code-ish UI use **Space Mono**. Never
   reintroduce Inter or a bare system-font stack as the brand face — that is the
   single most common "AI website" tell.
2. **One owned accent, used functionally.** The accent is an **acid lime**
   (`--accent: #c8f751`). It marks interaction and emphasis. No purple/blue
   gradients, no "make it pop" gradient text, no rainbow.
3. **Hierarchy through variation, not uniformity.** Vary type scale and layout
   (the asymmetric hero, the stat strip). Avoid every-card-identical grids with one
   radius and one shadow everywhere — another classic tell.
4. **Sharp, flat surfaces.** Small radii (`--radius: 6px`), hairline borders,
   no soft drop-shadows. Hover = border turns accent + a small lift, nothing more.
5. **Intentional motion only.** A single subtle scroll-in (`.animate-on-scroll`)
   and micro-interactions. No typing animation, no decorative blanket fades.
   Everything respects `prefers-reduced-motion`.
6. **Specific, human copy.** Real numbers and a real voice. No "passionate developer
   creating modern web experiences," no vague aspirational filler.
7. **No emoji in UI, content, code, or docs.** Use the accent, mono labels, or
   inline SVG instead. Arrows (`→ ↗`) and `×` are typographic glyphs and are fine.

**Dark is the default theme.** The page is dark with no class on `<html>`; light is
opt-in via the `.light-mode` class (set pre-paint by an inline script, toggled by
`main.js`). Do not invert this without updating the inline scripts in every page
and `main.js`.

### Design tokens

All visual constants are CSS custom properties at the top of `assets/css/style.css`
(`:root` = dark, `html.light-mode` = light overrides). Change colors, fonts, radius,
and spacing there and they cascade site-wide and across both themes.

Key tokens: `--bg-color`, `--bg-secondary-color`, `--bg-elevated-color`,
`--text-color`, `--text-muted-color`, `--border-color`, `--accent`, `--accent-hover`,
`--accent-text` (accent as text on the page bg — a deeper lime in light mode for
contrast), `--accent-ink` (text placed on an accent fill), `--font-display`,
`--font-body`, `--font-mono`, `--radius`/`--radius-sm`/`--radius-lg`, `--ease`.

`--primary-color` / `--primary-hover-color` are back-compat aliases for `--accent`
so older rules keep working.

The bulk of the editorial look lives in the **`EDITORIAL-TECHNICAL OVERHAUL`** block
at the end of `style.css`. It is loaded last and intentionally wins the cascade over
the legacy component rules above it.

---

## Architecture

### Shared chrome (`assets/js/components.js`)

The header (nav + search + toggles + mobile menu) and the footer are **injected at
runtime** by `components.js`, which is the single source of truth for the site
chrome. Each page contains only two placeholders — `<div id="site-header"></div>`
and `<div id="site-footer"></div>` — plus a skip link. To add a nav tab or change
the footer, edit `components.js` once instead of every HTML file.

`components.js` is path-aware: pages under `projects/`, `games/`, or `blogs/` get a
`../` link prefix automatically.

### Script load order (do not reorder)

All three are `defer`, so they run in document order before `DOMContentLoaded`:

```
components.js   -> injects header/footer DOM (top-level, runs first)
i18n.js         -> top-level: translates [data-i18n-key] incl. injected nav, wires lang toggle
main.js         -> on DOMContentLoaded: theme, scroll anims, mobile nav, search, filters, modal
```

`components.js` must come first so the chrome exists before the other two query it.
The IDs/classes the scripts depend on (`#theme-toggle`, `#lang-toggle`,
`#site-search`, `#mobile-*`, `.nav-links`, `.mobile-nav-links`, …) are listed in a
comment at the top of `components.js` — keep them if you edit the markup.

### Internationalization (`assets/js/i18n.js`)

`translations.en` / `translations.hu` objects. Elements carry `data-i18n-key`
(and `data-i18n-placeholder`). `setLanguage()` swaps `innerHTML`/placeholders and
persists the choice. When you add visible text, add the key to both languages.

### Pages

- `index.html` — hero (asymmetric), stat strip, nav cards, featured project, skills.
- `about.html` — background, experience timeline, skills, CV download (bilingual).
- `projects.html` — filterable project grid.
- `play.html` — landing for browser games. Cards are scaffolds marked `is-wip`;
  point each card's link at its game page and drop `is-wip` when ready. The first
  live card links to `games/anidle.html`.
- `games/anidle.html` — **Anidle**, an anime character guessing game (Wordle-style
  attribute matching). Self-contained: roster + logic live in `assets/js/anidle.js`
  (a `CHARACTERS` array and `COLUMNS` list — add to those to extend it); styles are
  the `Anidle` block at the end of `style.css`. The player toggles which series are
  in play (Frieren / Naruto / Bleach / JJK), types a name (typeahead matches first
  name, last name, and nicknames via each character's `aliases`), and each guess
  grades series/gender/species/hair/class/affiliation/age (green = match, amber =
  age within ±5 with ↑/↓ direction, grey = miss). No daily answer — `New game`
  picks a random target from the selected pool.
- `achievements.html` — filterable cards with a proof-image modal.
- `code-viewer.html` — VS Code-style viewer driven by `assets/data/code-snippets.json`
  (`code-viewer.js` / `code-viewer.css`).
- `projects/*.html` — per-project detail pages.

`main.js` also powers: theme toggle, scroll animations, mobile nav, project/achievement
filtering, the proof modal, the bilingual CV button, and a client-side fetch-based
search index. The index is built lazily on first search focus so normal page loads
do not fetch every indexed HTML page.

---

## Local development

No build. Serve the folder and open it:

```bash
cd PeterHermannGithub.github.io
python3 -m http.server 8000   # http://localhost:8000
```

Deploy = push to the default branch; GitHub Pages serves it.

### Conventions

- Keep using CSS variables; don't hardcode colors.
- New UI text -> add `data-i18n-key` + entries in both languages in `i18n.js`.
- New nav tab or footer change -> edit `components.js` only.
- New page in a subfolder (like `games/`) -> use `../` asset paths, and make sure
  `components.js`'s `inSubdir` regex matches the folder so the injected header/footer
  links resolve. It currently matches `projects`, `games`, and `blogs`.
- Stick to the design language above (especially: no emoji, no Inter, no blue gradients).

---

## Known follow-ups / could-improve

- Replace the lightweight project-summary visuals with real product screenshots
  when representative images are available.
- Build the Wordle variants behind the `play.html` scaffold (Anidle is live).
- Anidle ships with ~119 characters across 4 series (Frieren 20, Naruto 36,
  Bleach 32, JJK 31) and is English-only (no `data-i18n-key`s on the dynamic game
  UI). Attribute values are normalized clue sets — species (Human/Elf/Dwarf/Demon/
  Shinigami/Quincy/Arrancar/Cursed Corpse/Curse), class, hair, affiliation, and a
  numeric age (some labelled `1000+` etc.). Ages for long-lived/curse characters
  are approximate canonical values. Could add more characters/series and Hungarian
  strings later.
- The `*-test.html` files (`mobile-test`, `theme-test`, `test-website`,
  `test-phase1-improvements`) are scratch pages and can be deleted.
- Some legacy CSS above the overhaul block is now unused (old `.hero`, `.sticky-header`);
  safe to prune later.
- Add a real social-preview image and restore `og:image` / `twitter:image` metadata.
  Broken image metadata is intentionally omitted until that asset exists.
