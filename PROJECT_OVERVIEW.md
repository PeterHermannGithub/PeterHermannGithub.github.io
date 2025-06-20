# PeterHermannGithub.github.io - Portfolio Website

## Context & Purpose
PeterHermannGithub.github.io is a professional bilingual portfolio website built with vanilla HTML, CSS, and JavaScript, deployed on GitHub Pages. It showcases Peter Pal Hermann's projects, skills, and achievements as a data scientist and developer.

## Overview
A modern, responsive portfolio website featuring comprehensive internationalization support (English/Hungarian), dark/light theme switching, and optimal SEO implementation. The site provides detailed showcases of projects across web development, mobile applications, data science, and automation domains.

## Architecture Overview

### Core Architecture Pattern
- **Static Site**: Pure HTML/CSS/JavaScript with no build process required
- **Component-Based Structure**: Modular page templates with reusable components
- **Progressive Enhancement**: Graceful degradation with JavaScript enhancements
- **Mobile-First Responsive Design**: Adaptive layouts for all screen sizes

### Key Components

#### Core Pages
- **index.html** (`/index.html:1`) - Landing page with hero section and featured project
- **about.html** (`/about.html:1`) - Professional background, experience, and skills
- **projects.html** (`/projects.html:1`) - Filterable project portfolio with categorization
- **achievements.html** (`/achievements.html:1`) - Athletic, academic, and professional accomplishments

#### Project Detail Pages
- **projects/notify-me.html** - Android notification app documentation
- **projects/audiobook-converter.html** - PDF to audiobook conversion tool
- **projects/anime-analysis.html** - Data science and recommendation system
- **projects/history-automation.html** - YouTube content automation pipeline
- **projects/tab-timer.html** - Chrome extension time tracking
- **projects/performance-comparison.html** - Multi-language optimization showcase
- **projects/project-template.html** - Template for consistent project documentation

#### Internationalization System
- **assets/js/i18n.js** (`/assets/js/i18n.js:1`) - Complete bilingual translation system
- **assets/js/main.js** (`/assets/js/main.js:1`) - Theme switching, animations, and interactions

#### Styling Architecture
- **assets/css/style.css** (`/assets/css/style.css:1`) - Main stylesheet with CSS custom properties
- **assets/css/project-page.css** - Specific styling for project detail pages
- **assets/css/performance-demo.css** - Interactive demo styling

## Technology Stack

### Core Technologies
- **Languages**: HTML5, CSS3, JavaScript ES6+
- **Deployment**: GitHub Pages with custom domain
- **Font**: Inter from Google Fonts
- **Icons**: Custom SVG icon library
- **SEO**: JSON-LD structured data, Open Graph, Twitter Cards

### Modern Web Features
- **CSS Custom Properties**: Dynamic theming with CSS variables
- **Intersection Observer API**: Scroll-based animations
- **Local Storage API**: Theme and language preference persistence
- **Responsive Images**: Optimized loading with proper alt attributes
- **Progressive Web App**: Manifest and service worker ready

### Development Tools
- **Version Control**: Git with GitHub hosting
- **Domain Management**: GitHub Pages with CNAME
- **Performance**: Optimized assets, minimal dependencies
- **SEO Optimization**: Comprehensive meta tags and structured data

## Key Features

### 1. Bilingual Support (EN/HU)
- Complete English and Hungarian translations via `i18n.js`
- Dynamic content switching without page reload
- Language preference persistence in localStorage
- Browser language detection for initial setup
- SEO-optimized with proper lang attributes

```javascript
// Language switching implementation
const setLanguage = (lang) => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
};
```

### 2. Dark/Light Theme System
- Automatic system preference detection
- Manual toggle with persistent preference
- Smooth transitions between themes
- CSS custom properties for efficient theme switching
- Icon updates (sun/moon) for visual feedback

```css
:root {
    --bg-color: #f4f7f9;
    --text-color: #1a202c;
    --primary-color: #3b82f6;
}

html.dark-mode {
    --bg-color: #1a202c;
    --text-color: #edf2f7;
    --primary-color: #60a5fa;
}
```

### 3. Interactive Project Portfolio
- Filterable project grid (All, Web, Mobile, Data Science, Automation)
- Detailed project pages with code examples
- Live demo links and repository access
- Technology stack visualization
- Project templates for consistent documentation

### 4. Professional Profile Sections
- **Experience Timeline**: Morgan Stanley and Fundamenta positions
- **Education**: MSc Computer Science (ongoing), BSc Mathematics
- **Skills Matrix**: Categorized technical competencies
- **Achievement Showcase**: Athletic, academic, and professional milestones
- **Contact Integration**: Social media and email links

### 5. Performance Optimization
- Minimal external dependencies (only Google Fonts)
- Optimized images with WebP support
- Efficient CSS with minimal specificity
- Lazy loading for scroll animations
- Compressed assets and clean code

## User Experience Features

### 1. Responsive Design
- Mobile-first CSS architecture
- Flexible grid systems for all screen sizes
- Touch-friendly interactive elements
- Optimized typography scaling
- Consistent spacing across devices

### 2. Smooth Animations
- Scroll-triggered animations using Intersection Observer
- CSS transitions for state changes
- Typing animation effects for hero section
- Hover states for interactive elements
- Performance-optimized animation timing

### 3. Navigation Experience
- Sticky header with active page indication
- Smooth scrolling to page sections
- Breadcrumb navigation on project pages
- Back-to-top functionality
- Keyboard accessibility support

## SEO and Performance

### 1. Search Engine Optimization
- Comprehensive meta tags for all pages
- Open Graph and Twitter Card integration
- JSON-LD structured data for rich snippets
- Semantic HTML structure with proper headings
- Alt text for all images and icons

### 2. Web Vitals Optimization
- Minimal JavaScript bundle size
- Efficient CSS with custom properties
- Optimized font loading with preconnect
- Compressed images and assets
- Fast rendering with minimal layout shifts

### 3. Accessibility Features
- Semantic HTML structure
- ARIA labels for interactive elements
- Sufficient color contrast ratios
- Keyboard navigation support
- Screen reader friendly content structure

## Integration Points
- **GitHub Pages**: Automatic deployment from repository
- **Google Fonts**: Inter font family integration
- **Social Media**: LinkedIn and GitHub profile links
- **Email**: Direct contact integration
- **CV Download**: PDF resume access

## Content Management

### 1. Project Documentation Template
- Standardized project page structure
- Reusable components for features, challenges, and tech stack
- Code highlighting and example integration
- Consistent navigation and branding

### 2. Translation Management
- Centralized translation object in `i18n.js`
- Key-based content system for easy updates
- Nested translation structure for organization
- Fallback language support (English default)

## Deployment Architecture
- **Source**: GitHub repository with custom domain
- **CDN**: GitHub Pages global distribution
- **DNS**: CNAME configuration for custom domain
- **SSL**: Automatic HTTPS via GitHub Pages
- **Updates**: Git push triggers automatic deployment

## Limitations
- No content management system (manual HTML updates required)
- Static content only (no dynamic server-side functionality)
- Limited to GitHub Pages hosting constraints
- Manual translation updates for new content
- No automated testing or CI/CD pipeline

## Related Files
- Configuration: `CNAME`, `README.md`
- Assets: `assets/images/`, `assets/icons/`
- Documentation: Individual project HTML files
- Styles: `assets/css/*.css` files

## Metadata
- **Last Updated**: 2025-06-19
- **Complexity**: Intermediate
- **Dependencies**: None (vanilla web technologies)
- **Related Projects**: Showcases all other repository projects

## External Resources
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)