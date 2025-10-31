document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THEME SWITCHER ---
    console.log('🌗 Theme System: Initializing...');
    
    const themeToggle = document.getElementById('theme-toggle');
    console.log('🔍 Theme Toggle Button:', themeToggle ? 'Found ✅' : 'Missing ❌');
    
    if (!themeToggle) {
        console.error('❌ Theme toggle button not found! Theme system will not work.');
        return; // Exit early if theme toggle doesn't exist
    }
    
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill="currentColor" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 011.06-1.06l1.591 1.59a.75.75 0 01-1.06 1.061l-1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.061-1.06l1.59-1.591zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM6.106 17.894a.75.75 0 011.06-1.06l-1.591 1.59a.75.75 0 01-1.06 1.061l1.591-1.59zM3.75 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM6.106 6.106a.75.75 0 01-1.06 1.06l-1.591-1.59a.75.75 0 111.06-1.061l1.591 1.59z"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill="currentColor" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`;

    const setTheme = (isDark) => {
        console.log(`🎨 Setting theme: ${isDark ? 'Dark' : 'Light'}`);
        
        // Apply/remove dark-mode class
        document.documentElement.classList.toggle('dark-mode', isDark);
        console.log('📋 Dark mode class applied:', document.documentElement.classList.contains('dark-mode'));
        
        // Update button icon
        if (themeToggle) {
            themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
            console.log('🔆 Button icon updated:', isDark ? 'Sun (for dark mode)' : 'Moon (for light mode)');
        }
        
        // Save to localStorage with error handling
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            console.log('💾 Theme saved to localStorage:', localStorage.getItem('theme'));
        } catch (error) {
            console.error('❌ Failed to save theme to localStorage:', error);
        }
        
        // Log computed background color to verify CSS is working
        const computedStyle = window.getComputedStyle(document.body);
        const bgColor = computedStyle.backgroundColor;
        console.log('🎨 Body background color:', bgColor);
    };

    // Add click event listener with debugging
    themeToggle.addEventListener('click', () => {
        console.log('🖱️ Theme toggle clicked!');
        const currentlyDark = document.documentElement.classList.contains('dark-mode');
        console.log('📊 Current state: Currently dark?', currentlyDark);
        setTheme(!currentlyDark);
    });

    // Initial theme setup with enhanced debugging
    console.log('🔧 Setting up initial theme...');
    
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
        console.log('💾 Saved theme from localStorage:', savedTheme);
    } catch (error) {
        console.error('❌ Failed to read from localStorage:', error);
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('🖥️ System prefers dark mode:', prefersDark);
    
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    console.log('🎯 Final decision: Use dark mode?', shouldUseDark);
    
    setTheme(shouldUseDark);
    console.log('✅ Theme system initialization complete!');

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
    console.log('📱 Mobile theme toggle:', mobileThemeToggle ? 'Found ✅' : 'Missing ❌');
    
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileNavOverlay.classList.add('active');
        mobileNavMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // ✅ FIX: Enhanced mobile controls synchronization
        if (mobileThemeToggle && themeToggle) {
            mobileThemeToggle.innerHTML = themeToggle.innerHTML;
            console.log('📱 Mobile theme toggle synced with desktop:', mobileThemeToggle.innerHTML);
        }
        // ✅ FIX: Language sync handled by i18n.js - no manual sync needed
        if (mobileLangToggle) {
            const langToggle = document.getElementById('lang-toggle');
            if (langToggle) {
                mobileLangToggle.textContent = langToggle.textContent;
                console.log('📱 Mobile lang toggle synced:', mobileLangToggle.textContent);
            }
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
    
    // ✅ FIX: Enhanced mobile theme toggle functionality
    if (mobileThemeToggle && themeToggle) {
        mobileThemeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Mobile theme toggle clicked!');
            console.log('📱 Current desktop toggle state:', document.documentElement.classList.contains('dark-mode'));
            
            // Trigger desktop theme toggle
            themeToggle.click();
            
            // Sync the mobile button icon after theme change
            setTimeout(() => {
                mobileThemeToggle.innerHTML = themeToggle.innerHTML;
                console.log('📱 Mobile theme icon updated to:', mobileThemeToggle.innerHTML);
                console.log('📱 New theme state:', document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
            }, 100);
        });
        
        // Initial sync when mobile menu is available
        if (themeToggle.innerHTML) {
            mobileThemeToggle.innerHTML = themeToggle.innerHTML;
            console.log('📱 Initial mobile theme sync completed');
        }
    } else {
        if (mobileThemeToggle) {
            console.warn('⚠️ Mobile theme toggle exists but desktop toggle missing');
        }
        if (!mobileThemeToggle) {
            console.log('ℹ️ Mobile theme toggle not found on this page');
        }
    }
    
    // ✅ FIX: Mobile language toggle is handled by i18n.js - removed conflicting event listener
    // Language toggle functionality is managed in i18n.js to avoid conflicts
    
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
        
        // ✅ MEDIUM-TERM: Responsive text optimization for filter buttons
        optimizeFilterButtonText();
    });
    
    // ✅ MEDIUM-TERM: Mobile text optimization for achievement filter buttons
    const optimizeFilterButtonText = () => {
        // Only apply on achievements page
        if (!window.location.pathname.includes('achievements')) return;
        
        const filterButtons = document.querySelectorAll('.achievement-filters .filter-btn');
        const isMobile = window.innerWidth <= 480;
        
        filterButtons.forEach(button => {
            const key = button.dataset.i18nKey;
            if (!key) return;
            
            // Get current language
            const currentLang = document.documentElement.lang || 'en';
            
            // Use mobile-optimized translations for problematic buttons
            let optimizedKey = key;
            if (isMobile) {
                switch (key) {
                    case 'filter_all_achievements':
                        optimizedKey = 'filter_all_achievements_mobile';
                        break;
                    case 'filter_professional':
                        optimizedKey = 'filter_professional_mobile';
                        break;
                    case 'filter_academic':
                        optimizedKey = 'filter_academic_mobile';
                        break;
                }
            }
            
            // Update button text if translation exists
            if (window.translations && 
                window.translations[currentLang] && 
                window.translations[currentLang][optimizedKey]) {
                button.textContent = window.translations[currentLang][optimizedKey];
            }
        });
    };
    
    // ✅ Initialize mobile text optimization on page load
    optimizeFilterButtonText();

    // --- 4. ACTIVE NAV LINK HIGHLIGHTING ---
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // --- 5. PROJECT AND ACHIEVEMENT FILTERING ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const achievementCards = document.querySelectorAll('.achievement-card');

    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                // Re-trigger scroll animation if element comes into view
                if (card.classList.contains('animate-on-scroll') && !card.classList.contains('is-visible')) {
                    observer.observe(card);
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    }

    function filterAchievements(category) {
        achievementCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                // Re-trigger scroll animation if element comes into view
                if (card.classList.contains('animate-on-scroll') && !card.classList.contains('is-visible')) {
                    observer.observe(card);
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    }

    function setActiveFilter(activeButton) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('🔽 Filter button clicked:', button.getAttribute('data-filter'));
            const category = button.getAttribute('data-filter');
            // Determine if we're on projects or achievements page
            if (projectCards.length > 0) {
                filterProjects(category);
            }
            if (achievementCards.length > 0) {
                filterAchievements(category);
            }
            setActiveFilter(button);
        });

        // Add mobile touch feedback for filter buttons
        button.addEventListener('touchstart', (e) => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', (e) => {
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });

    // Initialize with "all" filter active
    if (filterButtons.length > 0) {
        if (projectCards.length > 0) {
            filterProjects('all');
        }
        if (achievementCards.length > 0) {
            filterAchievements('all');
        }
    }

    // ============================================
    // Achievement Proof Modal System
    // ============================================

    const proofModal = document.getElementById('proof-modal');
    const proofModalOverlay = document.querySelector('.proof-modal-overlay');
    const proofModalClose = document.querySelector('.proof-modal-close');
    const proofModalImage = document.getElementById('proof-modal-image');
    const proofModalFallback = document.querySelector('.proof-modal-fallback');
    const proofModalBody = document.querySelector('.proof-modal-body');
    const clickableAchievementCards  = document.querySelectorAll('.achievement-card[data-proof-image]');

    function openProofModal(imagePath, achievementTitle, isBilingual = false) {
        if (!proofModal) return;

        // Detect current language
        const currentLang = localStorage.getItem('lang') || 'en';
        
        // For bilingual certificates, select appropriate version
        let finalImagePath = imagePath;
        if (isBilingual) {
            // Remove any existing extension and add language-specific version
            const baseName = imagePath.replace(/\.(jpg|jpeg|png|pdf)$/i, '');
            const extension = imagePath.match(/\.(jpg|jpeg|png|pdf)$/i)?.[1] || 'jpg';
            finalImagePath = `${baseName}-${currentLang}.${extension}`;
        }

        // Set modal title with language awareness
        const modalTitle = document.getElementById('proof-modal-title');
        if (modalTitle && achievementTitle) {
            const proofText = currentLang === 'hu' ? 'Bizonyíték' : 'Proof';
            modalTitle.textContent = `${achievementTitle} - ${proofText}`;
        }

        // Show modal
        proofModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Add loading state
        proofModalBody.classList.add('loading');
        proofModalImage.style.display = 'none';
        proofModalFallback.classList.remove('active');

        // Check if it's a PDF file and handle differently
        const fullImagePath = `assets/images/proofs/${finalImagePath}`;
        const isPDF = finalImagePath.toLowerCase().endsWith('.pdf');
        
        if (isPDF) {
            // For PDFs, show a loading message and then open in new tab
            proofModalBody.classList.add('loading');
            proofModalImage.style.display = 'none';
            
            // Add PDF loading message
            const pdfMessage = document.createElement('div');
            pdfMessage.className = 'pdf-loading-message';
            pdfMessage.innerHTML = `
                <div class="pdf-loading-content">
                    <div class="pdf-loading-icon">📄</div>
                    <h4>Opening PDF Document</h4>
                    <p>The document will open in a new tab...</p>
                    <button class="pdf-open-btn">Open PDF Manually</button>
                </div>
            `;
            proofModalBody.appendChild(pdfMessage);
            
            // Add event listener to the manual open button
            const manualOpenBtn = pdfMessage.querySelector('.pdf-open-btn');
            if (manualOpenBtn) {
                manualOpenBtn.addEventListener('click', () => {
                    window.open(fullImagePath, '_blank');
                    closeProofModal();
                });
            }
            
            // Automatically try to open PDF after a short delay
            setTimeout(() => {
                const pdfWindow = window.open(fullImagePath, '_blank');
                
                // Check if PDF opened successfully
                setTimeout(() => {
                    if (!pdfWindow || pdfWindow.closed) {
                        // PDF failed to open, show manual option
                        const messageEl = pdfMessage.querySelector('p');
                        if (messageEl) {
                            messageEl.textContent = 'Please click the button below to open the PDF document:';
                        }
                    } else {
                        // PDF opened successfully, close modal
                        closeProofModal();
                    }
                }, 500);
            }, 800);
            
            return;
        }
        
        // Try to load the proof image
        const testImage = new Image();

        testImage.onload = function() {
            // Image loaded successfully
            proofModalImage.src = fullImagePath;
            proofModalImage.alt = `Proof of ${achievementTitle}`;
            proofModalImage.style.display = 'block';
            proofModalBody.classList.remove('loading');
        };

        testImage.onerror = function() {
            // If bilingual image fails, try fallback to English version
            if (isBilingual && currentLang === 'hu') {
                const baseName = imagePath.replace(/\.(jpg|jpeg|png|pdf)$/i, '');
                const extension = imagePath.match(/\.(jpg|jpeg|png|pdf)$/i)?.[1] || 'jpg';
                const fallbackPath = `assets/images/proofs/${baseName}-en.${extension}`;
                
                // Check if fallback is PDF
                if (extension.toLowerCase() === 'pdf') {
                    // Use improved PDF handling for fallback too
                    const pdfMessage = document.createElement('div');
                    pdfMessage.className = 'pdf-loading-message';
                    pdfMessage.innerHTML = `
                        <div class="pdf-loading-content">
                            <div class="pdf-loading-icon">📄</div>
                            <h4>Opening PDF Document (English Version)</h4>
                            <p>The document will open in a new tab...</p>
                            <button class="pdf-open-btn">Open PDF Manually</button>
                        </div>
                    `;
                    proofModalBody.appendChild(pdfMessage);
                    
                    // Add event listener to the fallback manual open button
                    const fallbackManualOpenBtn = pdfMessage.querySelector('.pdf-open-btn');
                    if (fallbackManualOpenBtn) {
                        fallbackManualOpenBtn.addEventListener('click', () => {
                            window.open(fallbackPath, '_blank');
                            closeProofModal();
                        });
                    }
                    
                    setTimeout(() => {
                        const pdfWindow = window.open(fallbackPath, '_blank');
                        setTimeout(() => {
                            if (!pdfWindow || pdfWindow.closed) {
                                const messageEl = pdfMessage.querySelector('p');
                                if (messageEl) {
                                    messageEl.textContent = 'Please click the button below to open the PDF document:';
                                }
                            } else {
                                closeProofModal();
                            }
                        }, 500);
                    }, 800);
                    return;
                }
                
                const fallbackImage = new Image();
                
                fallbackImage.onload = function() {
                    proofModalImage.src = fallbackPath;
                    proofModalImage.alt = `Proof of ${achievementTitle}`;
                    proofModalImage.style.display = 'block';
                    proofModalBody.classList.remove('loading');
                };
                
                fallbackImage.onerror = function() {
                    // Final fallback to placeholder
                    proofModalImage.style.display = 'none';
                    proofModalFallback.classList.add('active');
                    proofModalBody.classList.remove('loading');
                };
                
                fallbackImage.src = fallbackPath;
            } else {
                // Image failed to load, show fallback
                proofModalImage.style.display = 'none';
                proofModalFallback.classList.add('active');
                proofModalBody.classList.remove('loading');
            }
        };

        testImage.src = fullImagePath;
    }

    function closeProofModal() {
        if (!proofModal) return;

        proofModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset modal state
        setTimeout(() => {
            proofModalImage.src = '';
            proofModalFallback.classList.remove('active');
            proofModalBody.classList.remove('loading');
            
            // Clean up any PDF loading messages
            const pdfMessages = proofModalBody.querySelectorAll('.pdf-loading-message');
            pdfMessages.forEach(msg => msg.remove());
        }, 300); // Wait for modal animation
    }

    // Add click event listeners to achievement cards
    clickableAchievementCards .forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on links or buttons within the card
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }

            const proofImage = card.getAttribute('data-proof-image');
            const isBilingual = card.getAttribute('data-proof-bilingual') === 'true';
            const titleElement = card.querySelector('h3');
            const achievementTitle = titleElement ? titleElement.textContent : 'Achievement';

            if (proofImage) {
                console.log('📱 Achievement card clicked:', achievementTitle);
                openProofModal(proofImage, achievementTitle, isBilingual);
            }
        });

        // Enhanced mobile touch feedback
        card.addEventListener('touchstart', (e) => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', (e) => {
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });

        // Add visual feedback for clickable cards
        card.style.cursor = 'pointer';
    });

    // Close modal when clicking overlay
    if (proofModalOverlay) {
        proofModalOverlay.addEventListener('click', closeProofModal);
    }

    // Close modal when clicking close button
    if (proofModalClose) {
        proofModalClose.addEventListener('click', closeProofModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && proofModal && proofModal.classList.contains('active')) {
            closeProofModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const proofModalContent = document.querySelector('.proof-modal-content');
    if (proofModalContent) {
        proofModalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Handle image load errors gracefully
    if (proofModalImage) {
        proofModalImage.addEventListener('error', () => {
            proofModalImage.style.display = 'none';
            proofModalFallback.classList.add('active');
            proofModalBody.classList.remove('loading');
        });
    }

    // ============================================
    // CV Download Bilingual System
    // ============================================

    function updateCVButton() {
        const cvButton = document.getElementById('cv-download-btn');
        if (!cvButton || cvButton.getAttribute('data-cv-bilingual') !== 'true') {
            return;
        }

        // Get current language
        const currentLang = localStorage.getItem('lang') || 'en';
        
        // Get the base href path
        const baseHref = cvButton.getAttribute('href');
        
        // Create language-specific path
        // Convert "assets/cv/filename.pdf" to "assets/cv/filename_en.pdf" or "assets/cv/filename_hu.pdf"
        const baseName = baseHref.replace(/\.pdf$/i, '');
        const languageSpecificHref = `${baseName}_${currentLang}.pdf`;
        
        // Update the button href
        cvButton.setAttribute('href', languageSpecificHref);
        
        console.log(`📄 CV button updated for language: ${currentLang}`);
        console.log(`📄 New CV path: ${languageSpecificHref}`);
    }

    // Initialize CV button on page load
    updateCVButton();
    
    // Make updateCVButton available globally for i18n.js to call
    window.updateCVButton = updateCVButton;

    // --- SEARCH FUNCTIONALITY ---
    console.log('🔍 Search System: Initializing...');
    
    // ✅ FIX: Search elements with mobile search results support
    const searchInput = document.getElementById('site-search');
    const mobileSearchInput = document.getElementById('mobile-site-search');
    const searchResults = document.getElementById('search-results');
    const mobileSearchResults = document.getElementById('mobile-search-results');
    
    console.log('🔍 Search Elements:', {
        desktop: searchInput ? 'Found ✅' : 'Missing ❌',
        mobile: mobileSearchInput ? 'Found ✅' : 'Missing ❌',
        desktopResults: searchResults ? 'Found ✅' : 'Missing ❌',
        mobileResults: mobileSearchResults ? 'Found ✅' : 'Missing ❌'
    });

    // Search index and configuration
    let searchIndex = [];
    let isIndexBuilding = false;
    let searchTimeout = null;
    let currentHighlightIndex = -1;

    // Smart keyword mappings with i18n support
    function getKeywordMappings() {
        const currentLang = localStorage.getItem('lang') || 'en';
        const t = window.translations?.[currentLang] || window.translations?.en || {};
        
        return {
            'cv': { page: 'about.html', section: '', description: t.search_keyword_cv || 'Download CV' },
            'curriculum': { page: 'about.html', section: '', description: t.search_keyword_cv || 'Download CV' },
            'resume': { page: 'about.html', section: '', description: t.search_keyword_cv || 'Download CV' },
            'önéletrajz': { page: 'about.html', section: '', description: t.search_keyword_cv || 'Önéletrajz letöltése' },
            'projects': { page: 'projects.html', section: '', description: t.search_keyword_projects || 'View all projects' },
            'projektek': { page: 'projects.html', section: '', description: t.search_keyword_projects || 'Összes projekt megtekintése' },
            'portfolio': { page: 'projects.html', section: '', description: t.search_keyword_portfolio || 'View portfolio projects' },
            'portfólió': { page: 'projects.html', section: '', description: t.search_keyword_portfolio || 'Portfólió projektek megtekintése' },
            'achievements': { page: 'achievements.html', section: '', description: t.search_keyword_achievements || 'View achievements' },
            'eredmények': { page: 'achievements.html', section: '', description: t.search_keyword_achievements || 'Eredmények megtekintése' },
            'about': { page: 'about.html', section: '', description: t.search_keyword_about || 'About me' },
            'rólam': { page: 'about.html', section: '', description: t.search_keyword_about || 'Rólam' },
            'skills': { page: 'about.html', section: '', description: t.search_keyword_skills || 'Technical skills' },
            'készségek': { page: 'about.html', section: '', description: t.search_keyword_skills || 'Technikai készségek' },
            'experience': { page: 'about.html', section: '', description: t.search_keyword_experience || 'Work experience' },
            'tapasztalat': { page: 'about.html', section: '', description: t.search_keyword_experience || 'Munkatapasztalat' },
            'education': { page: 'about.html', section: '', description: t.search_keyword_education || 'Educational background' },
            'tanulmányok': { page: 'about.html', section: '', description: t.search_keyword_education || 'Tanulmányi háttér' },
            'anime': { page: 'projects/anime-recommender.html', section: '', description: t.search_keyword_anime || 'Anime Recommendation Engine' },
            'rust': { page: 'projects/anime-recommender.html', section: '', description: t.search_keyword_rust || 'Rust optimization engine' },
            'android': { page: 'projects/notify-me.html', section: '', description: t.search_keyword_android || 'Android notification app' },
            'chrome': { page: 'projects/tab-timer.html', section: '', description: t.search_keyword_chrome || 'Chrome extension' },
            'home': { page: 'index.html', section: '', description: t.search_keyword_home || 'Homepage' },
            'kezdőlap': { page: 'index.html', section: '', description: t.search_keyword_home || 'Kezdőlap' },
            'blogs': { page: 'blogs.html', section: '', description: 'View all blog articles' },
            'blogok': { page: 'blogs.html', section: '', description: 'Összes blog cikk megtekintése' },
            'articles': { page: 'blogs.html', section: '', description: 'Blog articles and insights' },
            'cikkek': { page: 'blogs.html', section: '', description: 'Blog cikkek és betekintések' }
        };
    }

    // Build search index from all pages
    async function buildSearchIndex() {
        if (isIndexBuilding) return;
        isIndexBuilding = true;
        
        console.log('🏗️ Building search index...');
        
        const pages = [
            { url: 'index.html', title: 'Home' },
            { url: 'about.html', title: 'About' },
            { url: 'projects.html', title: 'Projects' },
            { url: 'achievements.html', title: 'Achievements' },
            { url: 'blogs.html', title: 'Blogs' },
            { url: 'code-viewer.html', title: 'Code Viewer' },
            { url: 'projects/anime-recommender.html', title: 'Anime Recommender' },
            { url: 'projects/notify-me.html', title: 'Notify Me App' },
            { url: 'projects/tab-timer.html', title: 'Tab Timer Extension' },
            { url: 'projects/audiobook-converter.html', title: 'Audiobook Converter' },
            { url: 'projects/history-automation.html', title: 'History Automation' },
            { url: 'blogs/building-recommendation-engine-rust.html', title: 'Building a Production-Scale Recommendation Engine with Rust' }
        ];

        try {
            for (const page of pages) {
                try {
                    const response = await fetch(page.url);
                    if (response.ok) {
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Extract searchable content
                        const content = extractSearchableContent(doc);
                        
                        // Add to search index
                        searchIndex.push({
                            url: page.url,
                            title: page.title,
                            content: content,
                            searchText: (page.title + ' ' + content).toLowerCase()
                        });
                        
                        console.log(`📄 Indexed: ${page.title} (${content.length} chars)`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to index ${page.url}:`, error);
                }
            }
            
            console.log(`✅ Search index built: ${searchIndex.length} pages indexed`);
            isIndexBuilding = false;
            
        } catch (error) {
            console.error('❌ Error building search index:', error);
            isIndexBuilding = false;
        }
    }

    // Extract searchable text content from page
    function extractSearchableContent(doc) {
        // Remove script and style elements
        const scripts = doc.querySelectorAll('script, style, nav, header, footer');
        scripts.forEach(el => el.remove());
        
        // Get main content
        const main = doc.querySelector('main') || doc.body;
        
        // Extract text content and clean it up
        let content = main.textContent || main.innerText || '';
        
        // Clean up whitespace and special characters
        content = content
            .replace(/\s+/g, ' ')  // Multiple spaces to single space
            .replace(/\n+/g, ' ')  // Newlines to spaces
            .trim();
            
        return content;
    }

    // Perform search and return results
    function performSearch(query) {
        if (!query || query.length < 2) return [];
        
        const queryLower = query.toLowerCase();
        const results = [];
        const keywordMappings = getKeywordMappings();
        const currentLang = localStorage.getItem('lang') || 'en';
        const t = window.translations?.[currentLang] || window.translations?.en || {};
        
        // Check keyword mappings first
        if (keywordMappings[queryLower]) {
            const mapping = keywordMappings[queryLower];
            results.push({
                type: 'keyword',
                title: mapping.description,
                page: mapping.page.replace('.html', '').replace('projects/', '').replace('index', currentLang === 'hu' ? 'Kezdőlap' : 'Home'),
                url: mapping.page,
                snippet: `${t.search_quick_access || 'Quick access'} ${mapping.description.toLowerCase()}`,
                relevance: 100
            });
        }
        
        // Search through indexed content
        searchIndex.forEach(item => {
            const titleMatch = item.title.toLowerCase().includes(queryLower);
            const contentMatch = item.searchText.includes(queryLower);
            
            if (titleMatch || contentMatch) {
                const snippet = createSnippet(item.content, query);
                const relevance = calculateRelevance(item, queryLower, titleMatch, contentMatch);
                
                results.push({
                    type: 'content',
                    title: item.title,
                    page: item.title,
                    url: item.url,
                    snippet: snippet,
                    relevance: relevance
                });
            }
        });
        
        // Sort by relevance
        return results.sort((a, b) => b.relevance - a.relevance).slice(0, 8);
    }

    // Create snippet with highlighted search terms
    function createSnippet(content, query, maxLength = 150) {
        const queryLower = query.toLowerCase();
        const contentLower = content.toLowerCase();
        const index = contentLower.indexOf(queryLower);
        
        if (index === -1) {
            return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
        }
        
        const start = Math.max(0, index - 60);
        const end = Math.min(content.length, start + maxLength);
        
        let snippet = content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        // Highlight search term
        const regex = new RegExp(`(${query})`, 'gi');
        snippet = snippet.replace(regex, '<span class="search-highlight">$1</span>');
        
        return snippet;
    }

    // Calculate search relevance score
    function calculateRelevance(item, query, titleMatch, contentMatch) {
        let score = 0;
        
        if (titleMatch) score += 50;
        if (contentMatch) score += 20;
        
        // Boost score for exact matches
        if (item.title.toLowerCase() === query) score += 30;
        
        // Boost score for matches at the beginning
        if (item.title.toLowerCase().startsWith(query)) score += 20;
        
        return score;
    }

    // ✅ FIX: Enhanced search results display with proper desktop/mobile detection
    function displaySearchResults(results, query) {
        const currentLang = localStorage.getItem('lang') || 'en';
        const t = window.translations?.[currentLang] || window.translations?.en || {};
        
        // Determine which search results container to use
        // Priority: 1) Check which search input was used, 2) Check mobile sidebar state, 3) Check screen size
        const isMobileSidebarActive = mobileNavMenu && mobileNavMenu.classList.contains('active');
        const isMobileScreen = window.innerWidth <= 768;
        
        // ✅ FIX: More intelligent container selection
        let shouldUseMobileResults = false;
        
        // If mobile sidebar is active on desktop, use mobile results for mobile search input
        if (isMobileSidebarActive && !isMobileScreen) {
            // Desktop with mobile sidebar open - check which input has focus or was used
            const mobileInputActive = document.activeElement === mobileSearchInput || 
                                    (mobileSearchInput && mobileSearchInput.value.length > 0 && 
                                     searchInput && searchInput.value.length === 0);
            shouldUseMobileResults = mobileInputActive;
        } else if (isMobileScreen) {
            // Mobile screen - always use mobile results
            shouldUseMobileResults = true;
        }
        // Desktop without mobile sidebar - use desktop results (shouldUseMobileResults = false)
        
        const activeResultsContainer = shouldUseMobileResults ? mobileSearchResults : searchResults;
        const fallbackContainer = shouldUseMobileResults ? searchResults : mobileSearchResults;
        
        if (!activeResultsContainer && !fallbackContainer) return;
        
        const targetContainer = activeResultsContainer || fallbackContainer;
        
        if (results.length === 0) {
            const noResultsHTML = `
                <div class="search-no-results">
                    ${t.search_no_results || 'No results found'} "${query}"
                </div>
            `;
            targetContainer.innerHTML = noResultsHTML;
            targetContainer.classList.add('show');
            return;
        }
        
        const resultsHTML = results.map((result, index) => `
            <div class="search-result-item" data-url="${result.url}" data-index="${index}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-page">${result.page}</div>
                <div class="search-result-snippet">${result.snippet}</div>
            </div>
        `).join('');
        
        targetContainer.innerHTML = resultsHTML;
        targetContainer.classList.add('show');
        currentHighlightIndex = -1;
        
        // Add click listeners to results
        targetContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                navigateToResult(url);
            });
        });
    }

    // ✅ FIX: Hide search results from both containers
    function hideSearchResults() {
        if (searchResults) {
            searchResults.classList.remove('show');
        }
        if (mobileSearchResults) {
            mobileSearchResults.classList.remove('show');
        }
        currentHighlightIndex = -1;
    }

    // Navigate to search result
    function navigateToResult(url) {
        hideSearchResults();
        
        // Clear search inputs
        if (searchInput) searchInput.value = '';
        if (mobileSearchInput) mobileSearchInput.value = '';
        
        // Navigate to URL
        if (url === window.location.pathname.split('/').pop() || 
           (url === 'index.html' && window.location.pathname.endsWith('/'))) {
            // Same page, just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Different page, navigate
            window.location.href = url;
        }
    }

    // ✅ FIX: Enhanced keyboard navigation with proper container detection
    function handleSearchKeyboard(e) {
        // Use same logic as displaySearchResults for consistency
        const isMobileSidebarActive = mobileNavMenu && mobileNavMenu.classList.contains('active');
        const isMobileScreen = window.innerWidth <= 768;
        
        let shouldUseMobileResults = false;
        
        if (isMobileSidebarActive && !isMobileScreen) {
            // Desktop with mobile sidebar open - check which input has focus
            const mobileInputActive = document.activeElement === mobileSearchInput || 
                                    (mobileSearchInput && mobileSearchInput.value.length > 0 && 
                                     searchInput && searchInput.value.length === 0);
            shouldUseMobileResults = mobileInputActive;
        } else if (isMobileScreen) {
            shouldUseMobileResults = true;
        }
        
        const activeContainer = shouldUseMobileResults ? mobileSearchResults : searchResults;
        const items = activeContainer?.querySelectorAll('.search-result-item');
        if (!items || items.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentHighlightIndex = Math.min(currentHighlightIndex + 1, items.length - 1);
                updateHighlight(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentHighlightIndex = Math.max(currentHighlightIndex - 1, -1);
                updateHighlight(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentHighlightIndex >= 0 && items[currentHighlightIndex]) {
                    const url = items[currentHighlightIndex].dataset.url;
                    navigateToResult(url);
                }
                break;
            case 'Escape':
                hideSearchResults();
                if (searchInput) searchInput.blur();
                if (mobileSearchInput) mobileSearchInput.blur();
                break;
        }
    }

    // Update result highlighting
    function updateHighlight(items) {
        items.forEach((item, index) => {
            item.classList.toggle('highlighted', index === currentHighlightIndex);
        });
    }

    // ✅ FIX: Enhanced setup search input handlers with debugging
    function setupSearchInput(input) {
        if (!input) {
            console.log('⚠️ setupSearchInput called with null/undefined input');
            return;
        }
        
        console.log(`🔍 Setting up search input: ${input.id} (${input.type})`);
        console.log(`🔍 Input element exists: ${!!input}`);
        console.log(`🔍 Input parent: ${input.parentElement?.className || 'none'}`);
        
        // Search on input
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    const results = performSearch(query);
                    displaySearchResults(results, query);
                } else {
                    hideSearchResults();
                }
            }, 300);
        });
        
        // Keyboard navigation
        input.addEventListener('keydown', handleSearchKeyboard);
        
        // Hide results when input loses focus (with delay)
        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (!searchResults?.matches(':hover')) {
                    hideSearchResults();
                }
            }, 150);
        });
        
        // Show results when input gains focus (if has value)
        input.addEventListener('focus', () => {
            const query = input.value.trim();
            if (query.length >= 2) {
                const results = performSearch(query);
                displaySearchResults(results, query);
            }
        });
    }

    // Initialize search system
    function initializeSearch() {
        console.log('🚀 Initializing search system...');
        
        // Setup search inputs
        setupSearchInput(searchInput);
        setupSearchInput(mobileSearchInput);
        
        // ✅ FIX: Enhanced sync between mobile and desktop search with conflict prevention
        if (searchInput && mobileSearchInput) {
            console.log('🔗 Setting up search input synchronization');
            
            let syncInProgress = false;
            
            searchInput.addEventListener('input', (e) => {
                if (syncInProgress) return;
                syncInProgress = true;
                mobileSearchInput.value = e.target.value;
                console.log('🔗 Desktop → Mobile sync:', e.target.value);
                setTimeout(() => { syncInProgress = false; }, 10);
            });
            
            mobileSearchInput.addEventListener('input', (e) => {
                if (syncInProgress) return;
                syncInProgress = true;
                searchInput.value = e.target.value;
                console.log('🔗 Mobile → Desktop sync:', e.target.value);
                setTimeout(() => { syncInProgress = false; }, 10);
            });
        } else {
            console.log('⚠️ Search input sync not available:', {
                desktop: !!searchInput,
                mobile: !!mobileSearchInput
            });
        }
        
        // Build search index
        buildSearchIndex();
        
        // ✅ FIX: Hide results when clicking outside (supports both containers)
        document.addEventListener('click', (e) => {
            const isSearchRelated = e.target.closest('.search-container') || 
                                  e.target.closest('.search-results') ||
                                  e.target.closest('.mobile-search-container') ||
                                  e.target.closest('.mobile-search-results');
            
            if (!isSearchRelated) {
                hideSearchResults();
            }
        });
        
        // ✅ FIX: Enhanced global keyboard shortcuts with proper focus detection
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                
                // Use same logic as other functions for consistency
                const isMobileSidebarActive = mobileNavMenu && mobileNavMenu.classList.contains('active');
                const isMobileScreen = window.innerWidth <= 768;
                
                let shouldUseMobileSearch = false;
                
                if (isMobileSidebarActive && !isMobileScreen) {
                    // Desktop with mobile sidebar open - focus mobile search
                    shouldUseMobileSearch = true;
                } else if (isMobileScreen) {
                    // Mobile screen - use mobile search
                    shouldUseMobileSearch = true;
                }
                // Desktop without sidebar - use desktop search (shouldUseMobileSearch = false)
                
                const activeSearch = shouldUseMobileSearch ? mobileSearchInput : searchInput;
                if (activeSearch) {
                    activeSearch.focus();
                    activeSearch.select();
                    console.log('🔍 Focused search input:', shouldUseMobileSearch ? 'mobile' : 'desktop');
                }
            }
        });
        
        console.log('✅ Search system initialized!');
        console.log('💡 Tip: Press Ctrl+K to focus search');
    }

    // Initialize search if elements exist
    if (searchInput || mobileSearchInput) {
        initializeSearch();
    } else {
        console.log('ℹ️ Search elements not found on this page');
    }

});