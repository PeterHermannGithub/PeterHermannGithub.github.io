/*
 * components.js — shared site chrome (header + footer)
 *
 * Loaded with `defer` BEFORE i18n.js and main.js. Defer scripts run in
 * document order after parsing but before DOMContentLoaded, so the header
 * and footer DOM exists by the time i18n.js (top-level) translates it and
 * main.js (DOMContentLoaded) wires up its event listeners.
 *
 * This is the single source of truth for the nav and footer. To change a
 * link or add a tab, edit it here once instead of in every HTML file.
 *
 * IMPORTANT: keep the element IDs/classes that main.js and i18n.js query:
 *   #theme-toggle, #lang-toggle, #site-search, #search-results,
 *   #mobile-menu-toggle, #mobile-nav-overlay, #mobile-nav-menu,
 *   #mobile-nav-close, #mobile-site-search, #mobile-search-results,
 *   #mobile-theme-toggle, #mobile-lang-toggle,
 *   .nav-links, .mobile-nav-links
 */
(function () {
    'use strict';

    // Path-aware base prefix: pages under /projects/ or /games/ climb one level.
    var inSubdir = /\/(projects|games)\//.test(window.location.pathname);
    var base = inSubdir ? '../' : '';

    // Primary navigation. `key` maps to an i18n translation key (falls back to
    // the literal label if the key is missing). Add new tabs here.
    var navItems = [
        { href: 'index.html',        key: 'nav_home',         label: 'Home' },
        { href: 'about.html',        key: 'nav_about',        label: 'About' },
        { href: 'projects.html',     key: 'nav_projects',     label: 'Work' },
        { href: 'play.html',         key: 'nav_play',         label: 'Play' },
        { href: 'blogs.html',        key: 'nav_blogs',        label: 'Blog' },
        { href: 'achievements.html', key: 'nav_achievements', label: 'Achievements' }
    ];

    function navLinksHTML(extraClass) {
        return navItems.map(function (item) {
            return '<li><a href="' + base + item.href + '" data-i18n-key="' + item.key + '">' +
                item.label + '</a></li>';
        }).join('');
    }

    var headerHTML =
        '<header class="site-header">' +
            '<nav class="container site-nav">' +
                '<a href="' + base + 'index.html" class="logo">' +
                    '<span class="logo-mark">PH</span>' +
                    '<span class="logo-text">Peter Hermann</span>' +
                '</a>' +
                '<ul class="nav-links">' + navLinksHTML() + '</ul>' +
                '<div class="nav-controls">' +
                    '<div class="search-container">' +
                        '<input type="text" id="site-search" placeholder="Search..." aria-label="Search site content" data-i18n-placeholder="search_placeholder">' +
                        '<div class="search-results" id="search-results" aria-live="polite"></div>' +
                    '</div>' +
                    '<button id="theme-toggle" aria-label="Toggle theme"></button>' +
                    '<button id="lang-toggle" aria-label="Toggle language">EN</button>' +
                    '<button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle mobile menu">' +
                        '<span class="hamburger-line"></span>' +
                        '<span class="hamburger-line"></span>' +
                        '<span class="hamburger-line"></span>' +
                    '</button>' +
                '</div>' +
            '</nav>' +
        '</header>' +
        '<div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>' +
        '<nav class="mobile-nav-menu" id="mobile-nav-menu">' +
            '<div class="mobile-nav-header">' +
                '<a href="' + base + 'index.html" class="logo"><span class="logo-mark">PH</span></a>' +
                '<button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close mobile menu">&times;</button>' +
            '</div>' +
            '<ul class="mobile-nav-links">' + navLinksHTML() + '</ul>' +
            '<div class="mobile-nav-controls">' +
                '<div class="mobile-search-container">' +
                    '<input type="text" id="mobile-site-search" placeholder="Search..." aria-label="Search site content" data-i18n-placeholder="search_placeholder">' +
                    '<div class="search-results mobile-search-results" id="mobile-search-results" aria-live="polite"></div>' +
                '</div>' +
                '<div>' +
                    '<button id="mobile-theme-toggle" aria-label="Toggle theme"></button>' +
                    '<button id="mobile-lang-toggle" aria-label="Toggle language">EN</button>' +
                '</div>' +
            '</div>' +
        '</nav>';

    var year = new Date().getFullYear();
    var footerHTML =
        '<footer class="site-footer" id="contact">' +
            '<div class="container footer-grid">' +
                '<div class="footer-lead">' +
                    '<h2 data-i18n-key="contact_title">Let’s build something</h2>' +
                    '<p data-i18n-key="contact_text">Open to data science &amp; ML engineering work. Reach out.</p>' +
                    '<a href="mailto:hermannpeter17@gmail.com" class="footer-email">hermannpeter17@gmail.com</a>' +
                '</div>' +
                '<div class="footer-links">' +
                    '<span class="footer-label">Elsewhere</span>' +
                    '<a href="https://github.com/PeterHermannGithub" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">&#8599;</span></a>' +
                    '<a href="https://www.linkedin.com/in/peter-hermann-170hp/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">&#8599;</span></a>' +
                    '<a href="mailto:hermannpeter17@gmail.com">Email <span aria-hidden="true">&#8599;</span></a>' +
                '</div>' +
            '</div>' +
            '<div class="container footer-base">' +
                '<span class="copyright">© ' + year + ' Peter Pal Hermann</span>' +
                '<span class="footer-built">Built by hand — no template, no builder.</span>' +
            '</div>' +
        '</footer>';

    function mount(id, html) {
        var el = document.getElementById(id);
        if (el) {
            el.outerHTML = html;
        }
    }

    // Inject now (top-level during defer execution) so the markup is present
    // before i18n.js / main.js run.
    mount('site-header', headerHTML);
    mount('site-footer', footerHTML);
})();
