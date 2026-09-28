# PeterHermannGithub.github.io

> `README.md` is a generated copy of this file. Edit `CLAUDE.md` only.

Personal portfolio for Peter Pal Hermann (data scientist / ML engineer): a static site in
plain HTML/CSS/JS on GitHub Pages. **No build step, no framework, no bundler** — edit files,
push, done. Custom domain in `CNAME`.

Bilingual (EN/HU), dark/light theme, client-side search, interactive code viewer.

## Commands

```bash
python3 -m http.server 8000   # http://localhost:8000
```

Deploy = push to the default branch; GitHub Pages serves it.

## Architecture

### Shared chrome (`assets/js/components.js`)

The header (nav, search, toggles, mobile menu) and footer are **injected at runtime**.
Each page contains only `<div id="site-header"></div>`, `<div id="site-footer"></div>` and a
skip link. **To add a nav tab or change the footer, edit `components.js` once** rather than
every HTML file. It is path-aware: pages under `projects/`, `games/` or `blogs/` get a `../`
link prefix automatically.

### Script load order — do not reorder

All of them are `defer`, so they run in document order before `DOMContentLoaded`:

```
components.js   injects header/footer DOM (top level, runs first)
i18n-extra.js   sets window.__i18nExtra (page-level strings); must precede i18n.js
i18n.js         merges the extras, translates [data-i18n-key], wires lang toggle
main.js         on DOMContentLoaded: theme, scroll anims, mobile nav, search, filters, modal
fx.js           independent: hero canvas, Budapest clock, sample-round flip, "/" search
```

`components.js` must come first so the chrome exists before the other two query it. The IDs
and classes the scripts depend on (`#theme-toggle`, `#lang-toggle`, `#site-search`,
`#mobile-*`, `.nav-links`, `.mobile-nav-links`, …) are listed in a comment at the top of
`components.js` — keep them if you edit the markup.

### Internationalization (`assets/js/i18n.js`)

`translations.en` / `translations.hu` objects, plus `assets/js/i18n-extra.js` for the
redesign's strings (`rd_*` keys); elements carry `data-i18n-key` (and
`data-i18n-placeholder`). `setLanguage()` swaps `innerHTML`/placeholders and persists the
choice. **When you add visible text, add the key to both languages.**

### Pages

- `index.html` — hero with a live k-NN field (`#nn-canvas`, driven by `fx.js`), a lime
  stat ledger, selected-work rows, timeline, toolbelt, and a sample Anidle round
- `about.html` — sticky fact column, timeline, skill matrix, bilingual CV download
- `projects.html` — filterable list of `.work-row` rows; `projects/*.html` are the detail pages
- `lab.html` — work-in-progress shelf with honest status; private repos are described, not linked
- `play.html` — browser-games landing. Playable tiles are `.game-tile.live`, scaffolds are
  `.wip`; link a tile at its game page and switch the class when ready
- `games/anidle.html` — **Anidle**, a Wordle-style anime character guessing game.
  Self-contained: roster and logic in `assets/js/anidle.js` (a `CHARACTERS` array and
  `COLUMNS` list — extend those), styles in the `Anidle` block at the end of `style.css`
- `achievements.html` — filterable `.ach-card` grid with a proof-image modal
- `blogs.html` + `blogs/*.html` — post list and articles (`.article-body`, reading-progress bar)
- `code-viewer.html` — VS Code-style viewer driven by `assets/data/code-snippets.json`
- `404.html` — uses absolute `/assets/...` paths because it is served from any depth

`main.js` also powers the theme toggle, scroll animations, mobile nav, project/achievement
filtering, the proof modal, the bilingual CV button, and a client-side fetch-based search
index — built lazily on first search focus so normal page loads do not fetch every indexed
page.

## Conventions

- Keep using CSS variables; never hardcode colours.
- New UI text → `data-i18n-key` plus entries in **both** languages.
- New nav tab or footer change → edit `components.js` only.
- New page in a subfolder → use `../` asset paths, and make sure `components.js`'s
  `inSubdir` regex matches the folder so injected header/footer links resolve. It currently
  matches `projects`, `games` and `blogs`.
- **Dark is the default theme.** The page is dark with no class on `<html>`; light is opt-in
  via `.light-mode`, set pre-paint by an inline script and toggled by `main.js`. Do not
  invert this without updating the inline scripts in every page *and* `main.js`.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge), desktop and mobile. Page content
stays readable without JavaScript; the shared chrome, theme switching, search, filtering,
proof modals and games all require it.

## Design language

**Read `.claude/rules/design.md` before changing anything visual.** The site uses a
deliberate editorial-technical look chosen specifically so it does not read as
AI-generated boilerplate, and the rules there are the point — regressing them undoes the
whole design.

The one-line version: giant Space Grotesk display type, Space Mono metadata, a visible
4-column grid, one acid-lime accent that also floods whole bands, sharp flat surfaces, no
emoji anywhere, no colour gradients, no filler copy.

`style.css` is legacy and still loaded first; `site.css` is the current design system and
owns the chrome plus everything under `body.rd`. Pages must not reuse a class that
`style.css` styles (`.hero`, `.fact`, `.principle`, `.timeline`, `.project-card`,
`.achievement-card`) — that is why the rows are `.work-row` / `.ach-card`, and why
`main.js` filters on those.

## Known follow-ups

- Replace lightweight project-summary visuals with real product screenshots.
- Build the Wordle variants behind the `play.html` scaffold (Anidle is live).
- Anidle ships ~119 characters across 4 series (Frieren 20, Naruto 36, Bleach 32, JJK 31)
  and is English-only — the dynamic game UI has no `data-i18n-key`s. Ages for long-lived and
  curse characters are approximate canonical values.
- `style.css` (82 KB) is now mostly dead weight: only Anidle, the code viewer, the search
  dropdown, the proof modal and the mobile drawer still depend on it. Split those out and
  drop the rest.
- `anime-recommender.html` body copy has no HU keys (`project_anime_recommender_about_p1/p2`,
  tagline, meta) and stays English when the language is Hungarian.
- The `Lab` page's status claims come from the workspace guidance; re-check them when a
  project changes state.
- Add a real social-preview image and restore `og:image` / `twitter:image`. The broken image
  metadata is intentionally omitted until that asset exists.

## Note

Several projects featured here are archived locally under `_archive/`. That reflects local
development status only — the deployed artifacts still work, so do not remove a project from
the site because its repo is archived.
