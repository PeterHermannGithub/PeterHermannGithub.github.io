document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THEME SWITCHER ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 011.06-1.06l1.591 1.59a.75.75 0 01-1.06 1.061l-1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.061-1.06l1.59-1.591zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM6.106 17.894a.75.75 0 011.06-1.06l-1.591 1.59a.75.75 0 01-1.06 1.061l1.591-1.59zM3.75 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM6.106 6.106a.75.75 0 01-1.06 1.06l-1.591-1.59a.75.75 0 111.06-1.061l1.591 1.59z"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`;

    const setTheme = (isDark) => {
        document.documentElement.classList.toggle('dark-mode', isDark);
        themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark-mode');
        setTheme(!isDark);
    });

    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

    // --- 2. SCROLL ANIMATIONS ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
    
    // --- 3. MOBILE NAVIGATION ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
    // Mobile theme and language toggles
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const mobileLangToggle = document.getElementById('mobile-lang-toggle');
    
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileNavOverlay.classList.add('active');
        mobileNavMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Sync mobile controls with desktop
        if (mobileThemeToggle) {
            mobileThemeToggle.innerHTML = themeToggle.innerHTML;
        }
        if (mobileLangToggle) {
            mobileLangToggle.textContent = document.getElementById('lang-toggle').textContent;
        }
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        mobileNavMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Mobile menu event listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMobileMenu);
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Mobile theme toggle functionality
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            themeToggle.click();
            mobileThemeToggle.innerHTML = themeToggle.innerHTML;
        });
    }
    
    // Mobile language toggle functionality
    if (mobileLangToggle) {
        mobileLangToggle.addEventListener('click', () => {
            document.getElementById('lang-toggle').click();
            setTimeout(() => {
                mobileLangToggle.textContent = document.getElementById('lang-toggle').textContent;
            }, 50);
        });
    }
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNavMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- 4. ACTIVE NAV LINK HIGHLIGHTING ---
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

});