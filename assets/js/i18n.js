const translations = {
    en: {
        // Meta
        meta_title_home: "Peter Pal Hermann - Portfolio",
        meta_description_home: "Welcome to my personal portfolio. Discover my projects, skills, and achievements.",
        // Navigation
        nav_home: "Home",
        nav_about: "About",
        nav_projects: "Projects",
        nav_achievements: "Achievements",
        // Hero Section
        home_greeting: "Hello, I'm Peter Pal Hermann.",
        home_intro: "I'm a passionate developer. Welcome to my digital space.",
        home_contact_btn: "Get in Touch",
        // Nav Cards
        card_about_title: "About Me",
        card_about_desc: "Learn more about my journey, skills, and passions.",
        card_projects_title: "My Projects",
        card_projects_desc: "Explore a selection of my recent work.",
        card_achievements_title: "Personal Bests",
        card_achievements_desc: "Check out my athletic and academic accomplishments.",
        // Skills
        skills_title: "Technologies I Use",
        // Featured Project
        featured_title: "Featured Project",
        featured_project_title: "Awesome Project Name",
        featured_project_desc: "A brief but compelling description of my best project, highlighting the problem it solves and its key features.",
        view_project_btn: "View Project",
        // Footer
        contact_title: "Let's Connect",
        contact_text: "Find me on social media or send me an email.",
    },
    hu: {
        // Meta
        meta_title_home: "Hermann Péter Pál - Portfólió",
        meta_description_home: "Üdvözöllek a személyes portfóliómon. Fedezd fel a projektejeimet, készségeimet és eredményeimet.",
        // Navigation
        nav_home: "Kezdőlap",
        nav_about: "Rólam",
        nav_projects: "Projektek",
        nav_achievements: "Eredmények",
        // Hero Section
        home_greeting: "Szia, a nevem: Hermann Péter Pál.",
        home_intro: "Üdv a digitális térben.",
        home_contact_btn: "Vedd fel a kapcsolatot",
        // Nav Cards
        card_about_title: "Rólam",
        card_about_desc: "Tudj meg többet az utamról, képességeimről és szenvedélyeimről.",
        card_projects_title: "Projektjeim",
        card_projects_desc: "Böngéssz a legutóbbi munkáim között.",
        card_achievements_title: "Személyes csúcsok",
        card_achievements_desc: "Nézd meg a sport- és tanulmányi eredményeimet.",
        // Skills
        skills_title: "Használt technológiák",
        // Featured Project
        featured_title: "Kiemelt Projekt",
        featured_project_title: "Fantasztikus Projekt Név",
        featured_project_desc: "Rövid, de meggyőző leírása a legjobb projektjeimnek, kiemelve a megoldott problémát és a főbb funkciókat.",
        view_project_btn: "Projekt megtekintése",
        // Footer
        contact_title: "Kapcsolat",
        contact_text: "Keress meg a közösségi médiában vagy küldj egy e-mailt.",
    }
};

const setLanguage = (lang) => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    document.getElementById('lang-toggle').textContent = lang.toUpperCase();

    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'META') {
                 element.setAttribute('content', translations[lang][key]);
            } else {
                 element.innerHTML = translations[lang][key];
            }
        }
    });
};

const languageToggle = document.getElementById('lang-toggle');

languageToggle.addEventListener('click', () => {
    const currentLang = localStorage.getItem('lang') || 'en';
    const newLang = currentLang === 'en' ? 'hu' : 'en';
    setLanguage(newLang);
});

// Initial language setup
const initialLang = localStorage.getItem('lang') || (navigator.language.startsWith('hu') ? 'hu' : 'en');
setLanguage(initialLang);