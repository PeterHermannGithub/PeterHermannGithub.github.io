# Modern GitHub Pages Portfolio Template

A modern, responsive, and feature-rich personal website template designed for GitHub Pages. It's built with plain HTML, CSS, and JavaScript, requiring no build steps.

##  Core Features

-   **Bilingual Support (EN/HU):**
    -   Auto-detects browser language.
    -   Manual language switcher (EN/HU).
    -   All content is translatable via a central JS file.
-   **Dual-Theme System (Light/Dark):**
    -   Auto-detects system preference (`prefers-color-scheme`).
    -   Manual theme switcher (Sun/Moon icon).
    -   User preferences are saved in `localStorage`.
-   **Fully Responsive:** Mobile-first design that looks great on all devices.
-   **SEO & Accessibility Ready:** Includes meta tags, Open Graph tags, JSON-LD structured data, and semantic HTML.
-   **Interactive & Animated:** Subtle animations on scroll, interactive elements, and a clean, modern aesthetic.

##  How to Use

1.  **Download/Clone:** Clone this repository or download the ZIP file.
2.  **Customize Content:**
    -   **Languages (`assets/js/i18n.js`):** Open this file and edit the `translations` object to change any text on the website. This is the central hub for all content.
    -   **Images:** Replace the placeholder images in `assets/images/` with your own. Update image paths in the HTML files.
    -   **CV:** Place your CV PDF in `assets/cv/` and update the link in `about.html`.
    -   **Projects:** To add a new project, copy the `projects/project-template.html` file, rename it (e.g., `my-new-app.html`), and link to it from the main `projects.html` page.
3.  **Deploy to GitHub Pages:**
    -   Create a new public repository on GitHub named `<your-username>.github.io`.
    -   Push all the files from this template to that repository.
    -   Your website will be live at `https://<your-username>.github.io` within a few minutes.

##  File Structure

├── index.html            # Home Page
├── about.html            # About Me Page
├── achievements.html     # Achievements Page
├── projects.html         # Projects Hub Page
├── projects/
│   └── project-template.html # Template for a single project
├── assets/
│   ├── css/
│   │   └── style.css       # All styles
│   ├── js/
│   │   ├── main.js         # Core logic (theme, animations)
│   │   └── i18n.js         # Internationalization (language) logic
│   ├── images/             # Your photos, project screenshots, etc.
│   ├── icons/              # SVG icons (sun, moon, flags)
│   └── cv/                 # Your downloadable resume
└── README.md