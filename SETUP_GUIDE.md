# PeterHermannGithub.github.io Setup Guide

## Context & Purpose
Complete setup instructions for deploying, customizing, and maintaining the bilingual portfolio website on GitHub Pages with custom domain configuration.

## Prerequisites

### Technical Requirements
- **Git**: Version control for repository management
- **GitHub Account**: For repository hosting and GitHub Pages deployment
- **Text Editor/IDE**: VS Code, Sublime Text, or similar for HTML/CSS/JS editing
- **Web Browser**: Chrome, Firefox, or Safari for testing and development
- **Optional**: Local web server for development (Live Server extension, Python http.server)

### Domain Requirements (Optional)
- **Custom Domain**: If using custom domain instead of github.io subdomain
- **DNS Access**: Ability to configure CNAME records for domain setup
- **SSL Certificate**: Automatic via GitHub Pages for custom domains

### Design Assets
- **Profile Image**: High-quality photo for hero section
- **Project Screenshots**: Images for project showcases
- **Favicon**: 16x16, 32x32, and 192x192 pixel versions
- **Social Preview**: 1200x630 image for Open Graph

## Installation Steps

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/PeterHermannGithub/PeterHermannGithub.github.io.git
cd PeterHermannGithub.github.io

# Or fork the repository and clone your fork
git clone https://github.com/yourusername/yourusername.github.io.git
cd yourusername.github.io
```

### 2. GitHub Pages Configuration
1. **Repository Settings**: Navigate to repository Settings → Pages
2. **Source Configuration**: 
   - Source: Deploy from a branch
   - Branch: main (or master)
   - Folder: / (root)
3. **Custom Domain Setup** (optional):
   - Add your custom domain in the "Custom domain" field
   - Create `CNAME` file in repository root with your domain
   - Configure DNS CNAME record pointing to `yourusername.github.io`

### 3. Local Development Setup
```bash
# Option 1: Python simple server
python -m http.server 8000
# Access at http://localhost:8000

# Option 2: VS Code Live Server
# Install "Live Server" extension
# Right-click index.html → "Open with Live Server"

# Option 3: Node.js serve
npm install -g serve
serve .
# Access at http://localhost:3000
```

## Configuration

### 1. Personal Information Update
**Primary Contact Information** (`index.html`, `about.html`):
```html
<!-- Update throughout all HTML files -->
<title>Your Name - Portfolio</title>
<meta name="description" content="Your professional description">
<meta property="og:title" content="Your Name - Portfolio">

<!-- JSON-LD structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Full Name",
  "url": "https://yourdomain.com/",
  "sameAs": [
    "https://github.com/yourusername",
    "https://www.linkedin.com/in/yourprofile/"
  ],
  "jobTitle": "Your Professional Title"
}
</script>
```

**Contact Links** (footer sections):
```html
<!-- Update social media links -->
<a href="https://github.com/yourusername" target="_blank">GitHub</a>
<a href="https://www.linkedin.com/in/yourprofile/" target="_blank">LinkedIn</a>
<a href="mailto:your.email@domain.com">Email</a>
```

### 2. Translation System Configuration
**Adding New Languages** (`assets/js/i18n.js`):
```javascript
const translations = {
    en: {
        nav_home: "Home",
        nav_about: "About",
        // ... existing English translations
    },
    hu: {
        nav_home: "Kezdőlap",
        nav_about: "Rólam",
        // ... existing Hungarian translations
    },
    // Add new language
    de: {
        nav_home: "Startseite",
        nav_about: "Über mich",
        // ... German translations
    }
};

// Update language toggle to support multiple languages
const languageToggle = document.getElementById('lang-toggle');
languageToggle.addEventListener('click', () => {
    const currentLang = localStorage.getItem('lang') || 'en';
    const languages = ['en', 'hu', 'de'];
    const currentIndex = languages.indexOf(currentLang);
    const newLang = languages[(currentIndex + 1) % languages.length];
    setLanguage(newLang);
});
```

**Adding New Translatable Content**:
```html
<!-- Add data-i18n-key attribute to any element -->
<h2 data-i18n-key="new_section_title">Default English Text</h2>
<p data-i18n-key="new_section_description">Default description text.</p>
```

```javascript
// Add corresponding translations to i18n.js
en: {
    new_section_title: "New Section Title",
    new_section_description: "English description text."
},
hu: {
    new_section_title: "Új Szekció Címe",
    new_section_description: "Magyar leírás szöveg."
}
```

### 3. Theme Customization
**Color Scheme Updates** (`assets/css/style.css`):
```css
:root {
    /* Light Theme - Update these values */
    --bg-color: #f4f7f9;           /* Main background */
    --bg-secondary-color: #ffffff;  /* Card/header background */
    --text-color: #1a202c;         /* Primary text */
    --text-muted-color: #4a5568;   /* Secondary text */
    --primary-color: #3b82f6;      /* Accent color */
    --primary-hover-color: #2563eb; /* Hover states */
    --border-color: #e2e8f0;       /* Borders and dividers */
    
    /* Typography */
    --font-family: 'Inter', sans-serif; /* Change font */
    --container-width: 1100px;          /* Max content width */
    --border-radius: 8px;               /* Rounded corners */
}

html.dark-mode {
    /* Dark Theme - Update these values */
    --bg-color: #1a202c;
    --bg-secondary-color: #2d3748;
    --text-color: #edf2f7;
    --text-muted-color: #a0aec0;
    --primary-color: #60a5fa;
    --primary-hover-color: #3b82f6;
    --border-color: #4a5568;
}
```

**Typography Updates**:
```html
<!-- Update Google Fonts link in all HTML files -->
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```

```css
/* Update CSS font family */
:root {
    --font-family: 'YourFont', sans-serif;
}
```

### 4. Project Portfolio Configuration
**Adding New Projects** (`projects.html`):
```html
<!-- Add new project card to the projects grid -->
<div class="project-card" data-category="web">
    <img src="assets/images/project-name.png" alt="Project Name Screenshot">
    <div class="project-info">
        <h3 data-i18n-key="project_name_title">Project Name</h3>
        <p data-i18n-key="project_name_desc">Project description.</p>
        <div class="tech-stack">
            <span>Technology 1</span>
            <span>Technology 2</span>
        </div>
        <div class="project-links">
            <a href="projects/project-name.html" data-i18n-key="view_details_btn">View Details</a>
            <a href="https://github.com/username/repo" target="_blank" data-i18n-key="view_code_btn">View Code</a>
        </div>
    </div>
</div>
```

**Creating Project Detail Pages**:
```bash
# Copy project template
cp projects/project-template.html projects/your-project.html

# Customize the template with your project details
# Update title, meta tags, content sections, and code examples
```

## Verification

### 1. Local Testing Checklist
```bash
# Test all major functionality locally
# ✓ All pages load without errors
# ✓ Navigation works between pages  
# ✓ Theme toggle switches correctly
# ✓ Language toggle works for all content
# ✓ Project filter buttons function properly
# ✓ Contact links open correctly
# ✓ Images load and display properly
# ✓ Responsive design works on mobile
```

### 2. GitHub Pages Deployment Test
```bash
# Push changes to repository
git add .
git commit -m "Initial setup and customization"
git push origin main

# Wait 1-2 minutes for deployment
# Visit yourusername.github.io to verify deployment
```

### 3. SEO and Performance Verification
**Meta Tags Validation**:
- Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) for Open Graph
- Use [Twitter Card Validator](https://cards-dev.twitter.com/validator) for Twitter Cards
- Verify structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)

**Performance Testing**:
- Test with [Google PageSpeed Insights](https://pagespeed.web.dev/)
- Verify mobile responsiveness with browser dev tools
- Check accessibility with [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)

### 4. Cross-Browser Testing
Test functionality in multiple browsers:
- **Chrome**: Primary development browser
- **Firefox**: Alternative rendering engine
- **Safari**: WebKit compatibility (if available)
- **Mobile browsers**: iOS Safari, Chrome mobile

## Troubleshooting

### Common Deployment Issues

#### GitHub Pages Not Updating
```bash
# Check GitHub Pages status
# Go to repository Settings → Pages
# Verify source branch is correct
# Check for any error messages

# Force refresh deployment
git commit --allow-empty -m "Trigger GitHub Pages rebuild"
git push origin main
```

#### Custom Domain Issues
```bash
# Verify CNAME file exists in repository root
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add CNAME for custom domain"
git push origin main

# Check DNS configuration
# CNAME record should point to: yourusername.github.io
# Wait 24-48 hours for DNS propagation
```

#### Font Loading Issues
```html
<!-- Ensure proper font loading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

#### Theme Not Persisting
```javascript
// Check localStorage functionality
// Add debug logging to main.js
console.log('Theme loaded:', localStorage.getItem('theme'));
console.log('Language loaded:', localStorage.getItem('lang'));
```

### Image Optimization Issues
```bash
# Optimize images for web
# Recommended: Use online tools like TinyPNG, Squoosh, or ImageOptim
# Ensure images are:
# - Under 500KB each
# - Proper dimensions (max 1200px width for hero images)
# - WebP format when possible with fallbacks
```

## Maintenance and Updates

### Regular Maintenance Tasks
1. **Content Updates**: Update projects, achievements, and experience
2. **Translation Updates**: Keep all languages synchronized
3. **Dependency Updates**: Update Google Fonts or any external resources
4. **Performance Monitoring**: Regular PageSpeed and accessibility audits
5. **Link Validation**: Ensure all external links remain active

### Adding New Features
```javascript
// Example: Adding a new scroll animation
const newAnimatedElements = document.querySelectorAll('.new-animate-class');
newAnimatedElements.forEach(el => observer.observe(el));
```

### Backup Strategy
```bash
# Regular repository backup
git clone --mirror https://github.com/yourusername/yourusername.github.io.git backup/
# Store backup in separate location or cloud service
```

## Development Workflow

### Recommended Development Process
1. **Feature Branch**: Create feature branches for major updates
2. **Local Testing**: Test all changes locally before pushing
3. **Gradual Deployment**: Deploy small changes frequently
4. **Performance Testing**: Monitor site performance after updates
5. **Content Validation**: Ensure translations and content accuracy

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-project-page

# Make changes and test locally
# Commit changes
git add .
git commit -m "Add new project page with translations"

# Push and deploy
git checkout main
git merge feature/new-project-page
git push origin main
```

## Metadata
- **Last Updated**: 2025-06-19
- **Complexity**: Beginner-Intermediate
- **Dependencies**: Git, GitHub Account, Text Editor
- **Deployment**: GitHub Pages with optional custom domain