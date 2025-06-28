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
        
        // Sync mobile controls with desktop
        if (mobileThemeToggle && themeToggle) {
            mobileThemeToggle.innerHTML = themeToggle.innerHTML;
            console.log('📱 Mobile theme toggle synced with desktop');
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
    if (mobileThemeToggle && themeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            console.log('📱 Mobile theme toggle clicked!');
            themeToggle.click();
            // Sync the mobile button icon after theme change
            setTimeout(() => {
                mobileThemeToggle.innerHTML = themeToggle.innerHTML;
                console.log('📱 Mobile theme icon updated');
            }, 50);
        });
    } else if (mobileThemeToggle) {
        console.warn('⚠️ Mobile theme toggle exists but desktop toggle missing');
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
                    <button class="pdf-open-btn" onclick="window.open('${fullImagePath}', '_blank'); closeProofModal();">Open PDF Manually</button>
                </div>
            `;
            proofModalBody.appendChild(pdfMessage);
            
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
                            <button class="pdf-open-btn" onclick="window.open('${fallbackPath}', '_blank'); closeProofModal();">Open PDF Manually</button>
                        </div>
                    `;
                    proofModalBody.appendChild(pdfMessage);
                    
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

});