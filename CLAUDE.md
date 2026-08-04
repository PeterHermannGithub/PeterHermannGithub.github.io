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

All three are `defer`, so they run in document order before `DOMContentLoaded`:

```
components.js   injects header/footer DOM (top level, runs first)
i18n.js         translates [data-i18n-key] incl. injected nav, wires lang toggle
main.js         on DOMContentLoaded: theme, scroll anims, mobile nav, search, filters, modal
```

`components.js` must come first so the chrome exists before the other two query it. The IDs
and classes the scripts depend on (`#theme-toggle`, `#lang-toggle`, `#site-search`,
`#mobile-*`, `.nav-links`, `.mobile-nav-links`, …) are listed in a comment at the top of
`components.js` — keep them if you edit the markup.

### Internationalization (`assets/js/i18n.js`)

`translations.en` / `translations.hu` objects; elements carry `data-i18n-key` (and
`data-i18n-placeholder`). `setLanguage()` swaps `innerHTML`/placeholders and persists the
choice. **When you add visible text, add the key to both languages.**

### Pages

- `index.html` — asymmetric hero, stat strip, nav cards, featured project, skills
- `about.html` — background, experience timeline, skills, bilingual CV download
- `projects.html` — filterable project grid; `projects/*.html` are the detail pages
- `play.html` — browser-games landing. Cards are scaffolds marked `is-wip`; point a card's
  link at its game page and drop `is-wip` when ready
- `games/anidle.html` — **Anidle**, a Wordle-style anime character guessing game.
  Self-contained: roster and logic in `assets/js/anidle.js` (a `CHARACTERS` array and
  `COLUMNS` list — extend those), styles in the `Anidle` block at the end of `style.css`
- `achievements.html` — filterable cards with a proof-image modal
- `code-viewer.html` — VS Code-style viewer driven by `assets/data/code-snippets.json`

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

The one-line version: Space Grotesk + Space Mono, one acid-lime accent (`#c8f751`), sharp
flat surfaces, no emoji anywhere, no gradients, no filler copy.

## Known follow-ups

- Replace lightweight project-summary visuals with real product screenshots.
- Build the Wordle variants behind the `play.html` scaffold (Anidle is live).
- Anidle ships ~119 characters across 4 series (Frieren 20, Naruto 36, Bleach 32, JJK 31)
  and is English-only — the dynamic game UI has no `data-i18n-key`s. Ages for long-lived and
  curse characters are approximate canonical values.
- The `*-test.html` files (`mobile-test`, `theme-test`, `test-website`,
  `test-phase1-improvements`) are scratch pages and can be deleted.
- Some legacy CSS above the overhaul block is unused (old `.hero`, `.sticky-header`).
- Add a real social-preview image and restore `og:image` / `twitter:image`. The broken image
  metadata is intentionally omitted until that asset exists.

## Note

Several projects featured here are archived locally under `_archive/`. That reflects local
development status only — the deployed artifacts still work, so do not remove a project from
the site because its repo is archived.
