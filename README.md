# Modern Bilingual Portfolio Website

A professional, responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Features complete bilingual support (English/Hungarian), dark/light themes, and modern web design patterns.

## 🚀 **Quick Start**

### 1. Clone and Customize
```bash
# Clone the repository
git clone https://github.com/PeterHermannGithub/PeterHermannGithub.github.io.git
cd PeterHermannGithub.github.io

# For your own portfolio, create a new repository named: username.github.io
```

### 2. Local Development
```bash
# No build process required! Use any local server:

# Python
python -m http.server 8000

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Node.js
npx live-server --port=8000
```

### 3. Deploy to GitHub Pages
```bash
# Push to your username.github.io repository
git remote set-url origin https://github.com/yourusername/yourusername.github.io.git
git push origin main

# Your site will be live at: https://yourusername.github.io
```

## ✨ **Key Features**

- **🌍 Bilingual Support**: Complete English/Hungarian translations with automatic language detection
- **🎨 Dual Themes**: Light/dark mode with system preference detection and manual toggle
- **📱 Fully Responsive**: Mobile-first design optimized for all devices with intelligent text optimization and ultra-small screen support
- **🏆 Interactive Achievement Proofs**: Click achievement cards to view verification documents and certificates
- **🚀 SEO Ready**: Comprehensive meta tags, Open Graph, and JSON-LD structured data
- **⚡ Performance Optimized**: Minimal dependencies, efficient CSS, smooth animations
- **🎯 Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

## 📁 **File Structure**

```
├── index.html              # Homepage with hero section and skills
├── about.html              # Professional background and experience
├── projects.html           # Project portfolio with filtering
├── achievements.html       # Academic, professional, and athletic accomplishments with interactive proof system
├── projects/
│   ├── project-template.html    # Template for new project pages
│   ├── anime-recommender.html   # Featured project showcase
│   └── [other-projects].html   # Individual project detail pages
├── assets/
│   ├── css/
│   │   ├── style.css           # Main stylesheet with CSS variables and proof modal styles
│   │   └── project-page.css    # Project detail page styles
│   ├── js/
│   │   ├── main.js            # Core functionality (themes, animations, proof modal system)
│   │   └── i18n.js            # Complete translation system with proof UI translations
│   ├── images/                # Photos, screenshots, graphics
│   │   └── proofs/            # Achievement proof images directory
│   ├── icons/                 # SVG icon library
│   └── cv/                    # Downloadable resume files
└── README.md                  # This file
```

## 🛠️ **Customization Guide**

### Update Personal Information
**Edit these sections across all HTML files:**
- Replace "Peter Pal Hermann" with your name
- Update social media links in footer sections
- Modify job title and professional descriptions
- Replace email address and contact information

### Add New Projects
```bash
# 1. Copy the template
cp projects/project-template.html projects/your-project.html

# 2. Customize your-project.html with:
#    - Project title and description
#    - Technology stack details
#    - Screenshots and demo links
#    - Code examples and features

# 3. Add project card to projects.html in the appropriate category

# 4. Add translations to assets/js/i18n.js for both English and Hungarian
```

### Modify Languages
**Current: English ↔ Hungarian**

To change or add languages, edit `assets/js/i18n.js`:
```javascript
const translations = {
    en: {
        nav_home: "Home",
        // ... all English translations
    },
    your_language: {
        nav_home: "Your Translation",
        // ... all translations in your language
    }
};
```

### Customize Theme Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
    --primary-color: #3b82f6;      /* Your brand color */
    --bg-color: #f4f7f9;           /* Light background */
    --text-color: #1a202c;         /* Text color */
    /* ... other color variables */
}
```

### Add New Skills/Technologies
1. **Update skills grid** in `index.html` and `about.html`
2. **Add SVG icons** to `assets/icons/` (64x64px recommended)
3. **Include translations** for new skills in `i18n.js`

## 🖼️ **Adding Your Images**

Replace placeholder images in `assets/images/`:
- **profile-photo.jpg** (400x400px) - Your professional headshot
- **social-preview.jpg** (1200x630px) - Social media preview image
- **project-[name].png** (1200x800px) - Project screenshots

**Achievement proof images in `assets/images/proofs/`:**
- **degree-certificate-en.jpg & degree-certificate-hu.jpg** (400x600px) - Bilingual university diploma/certificate
- **employee-award.jpg** (400x600px) - Professional awards/recognition
- **rust-performance.png** (800x600px) - Technical performance benchmarks
- **running-certificate.jpg** (400x600px) - Athletic achievement proof

**Bilingual certificate system:**
- Use language suffixes: `-en.jpg` for English, `-hu.jpg` for Hungarian
- Reference base name in HTML: `data-proof-image="degree-certificate"`
- Add bilingual flag: `data-proof-bilingual="true"`
- System automatically displays appropriate version based on user's language preference

**Image optimization tips:**
- Use WebP format when possible with JPEG fallbacks
- Compress images for web (recommended: < 500KB each)
- Include descriptive alt text for accessibility
- Proof images automatically display in modal system when available

## 🌐 **Translation System**

All content is translatable through the centralized system in `assets/js/i18n.js`:

```html
<!-- Add to any HTML element -->
<h2 data-i18n-key="unique_key">Default English Text</h2>
```

```javascript
// Add to translations object
en: {
    unique_key: "English Translation"
},
hu: {
    unique_key: "Magyar Fordítás"
}
```

## 🎨 **Theme System**

The website automatically detects user's system preference (light/dark) and provides a manual toggle. Themes use CSS custom properties for efficient switching:

- **Automatic detection** via `prefers-color-scheme`
- **Manual toggle** with localStorage persistence
- **Smooth transitions** between theme states
- **Icon feedback** (sun/moon) for current theme

## 📈 **SEO Features**

Includes comprehensive SEO optimization:
- **Meta tags** for search engines and social media
- **Open Graph** and **Twitter Cards** for rich previews
- **JSON-LD structured data** for enhanced search results
- **Semantic HTML** with proper heading hierarchy
- **Fast loading** with optimized assets

## 🔧 **Development Notes**

- **No build process** - edit files directly and refresh browser
- **Mobile-first** responsive design with strategic breakpoints (360px, 480px, 768px, 1200px+)
- **Smart mobile optimization**: Dynamic text shortening and ultra-small screen vertical stacking
- **Touch-friendly design**: 48px minimum touch targets with interactive feedback
- **Progressive enhancement** - works without JavaScript
- **Cross-browser compatible** (Chrome, Firefox, Safari, Edge)
- **GitHub Pages ready** - automatic deployment on push

## 📋 **Browser Support**

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive enhancement**: Basic functionality works on older browsers
- **JavaScript optional**: Core content accessible without JS

## 🚀 **Performance**

- **Minimal dependencies**: Only Google Fonts external resource
- **Efficient CSS**: Custom properties and minimal specificity
- **Optimized images**: WebP with fallbacks, proper compression
- **Lazy loading**: Scroll-based animations only when needed
- **Fast deployment**: Static files with CDN via GitHub Pages

## 📞 **Support & Documentation**

For complete technical documentation, implementation details, and troubleshooting guides, see the **CLAUDE.md** file in this repository.

For questions about customization or deployment, check the GitHub Issues section or review the inline code comments throughout the project files.

---

**Note**: This README.md and CLAUDE.md are the only two documentation files for this project. All development information is consolidated into these two sources.