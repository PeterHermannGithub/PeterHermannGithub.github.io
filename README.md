# Peter Pal Hermann — Portfolio

A personal portfolio for a data scientist / ML engineer, built as a static site in
plain HTML, CSS, and JavaScript and deployed on GitHub Pages. No build step, no
framework. It is bilingual (English/Hungarian), has a dark/light theme, a client-side
search, an interactive code viewer, and a Play section for browser games.

The look is deliberately **editorial-technical** — Space Grotesk + Space Mono, an
acid-lime accent, sharp flat surfaces, dark by default. See `CLAUDE.md` for the full
design language and the rules that keep it from drifting back into generic territory.

## Quick start

No build process — serve the folder and open it:

```bash
git clone https://github.com/PeterHermannGithub/PeterHermannGithub.github.io.git
cd PeterHermannGithub.github.io
python3 -m http.server 8000          # then open http://localhost:8000
```

Deploy by pushing to the default branch; GitHub Pages serves it. The custom domain
is in `CNAME`.

## File structure

```
index.html            Homepage: hero, stat strip, nav cards, featured project, skills
about.html            Background, experience, skills, CV download
projects.html         Filterable project grid
play.html             Landing for browser games (Wordle variants — scaffold)
achievements.html     Filterable cards with a proof-image modal
code-viewer.html      VS Code-style code viewer
projects/*.html       Per-project detail pages
assets/
  css/style.css       Design tokens + all styles (editorial overhaul block at the end)
  css/*.css           code-viewer / project-page / performance-demo styles
  js/components.js    Shared header + footer (single source of truth, injected at runtime)
  js/i18n.js          EN/HU translation system
  js/main.js          Theme, animations, mobile nav, filtering, proof modal, search
  js/code-viewer.js   Code viewer logic
  data/, icons/, images/, cv/
```

## Working on it

- **Colors / fonts / spacing:** edit the CSS variables at the top of
  `assets/css/style.css`. They cascade across the whole site and both themes.
- **Nav tabs / footer:** edit `assets/js/components.js` once — the chrome is injected
  into `#site-header` / `#site-footer` placeholders on every page.
- **Text:** add a `data-i18n-key` to the element and an entry in both languages in
  `assets/js/i18n.js`.
- **A new project page:** copy `projects/project-template.html`, add a card to
  `projects.html`, add translations.

Keep to the design language in `CLAUDE.md`: no emoji in the UI, no Inter, no
blue/purple gradients. Dark is the default; light is the `.light-mode` opt-in.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile.
Core content is readable without JavaScript; the chrome, theme, search, and games
need it.

---

This README and `CLAUDE.md` are the only two documentation files for the project.
