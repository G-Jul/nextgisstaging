
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Homepage] DOMContentLoaded event fired');
    // Левое навигационное меню
    
    const leftNav = document.getElementById('leftNav');
    const navToggle = document.getElementById('navToggle');
    const leftNavClose = document.getElementById('leftNavClose');
    const logoLink = document.querySelector('.logo-link');
    const dropdownArrow = document.querySelector('.dropdown-arrow');

    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (leftNav) {
                const isActive = leftNav.classList.contains('active');
                
                if (isActive) {
                    leftNav.classList.remove('active');
                    logoLink.classList.remove('active');
                    document.body.classList.remove('left-nav-open');
                } else {
                    leftNav.classList.add('active');
                    logoLink.classList.add('active');
                    document.body.classList.add('left-nav-open');
                }
            }
        });
    }

    if (dropdownArrow) {
        dropdownArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (leftNav) {
                const isActive = leftNav.classList.contains('active');
                
                if (isActive) {
                    leftNav.classList.remove('active');
                    if (logoLink) {
                        logoLink.classList.remove('active');
                    }
                    document.body.classList.remove('left-nav-open');
                } else {
                    leftNav.classList.add('active');
                    if (logoLink) {
                        logoLink.classList.add('active');
                    }
                    document.body.classList.add('left-nav-open');
                }
            }
        });
    }

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            if (leftNav) {
                leftNav.classList.toggle('active');
                if (logoLink) {
                    logoLink.classList.toggle('active');
                }
                document.body.classList.toggle('left-nav-open');
            }
        });
    }

    if (leftNavClose) {
        leftNavClose.addEventListener('click', function() {
            if (leftNav) {
                leftNav.classList.remove('active');
                if (logoLink) {
                    logoLink.classList.remove('active');
                }
                document.body.classList.remove('left-nav-open');
            }
        });
    }

    // Закрываем левое меню при клике вне его (только на десктопе)
    document.addEventListener('click', function(e) {
        if (leftNav && leftNav.classList.contains('active')) {
            // Закрываем при клике вне меню
            if (!leftNav.contains(e.target) && 
                (!navToggle || !navToggle.contains(e.target)) && 
                (!logoLink || !logoLink.contains(e.target)) &&
                (!dropdownArrow || !dropdownArrow.contains(e.target))) {
                leftNav.classList.remove('active');
                if (logoLink) {
                    logoLink.classList.remove('active');
                }
                document.body.classList.remove('left-nav-open');
            }
        }
    });

    // Раскрывающееся левое меню
    
    function initCollapsibleMenu() {
        if (!leftNav) {
            return;
        }
        
        function getStaticPath() {
            const scripts = document.querySelectorAll('script[src*="_static"]');
            if (scripts.length > 0) {
                const src = scripts[0].getAttribute('src');
                const match = src.match(/(.*?)_static/);
                if (match) return match[1] + '_static';
            }
            const links = document.querySelectorAll('link[href*="_static"]');
            if (links.length > 0) {
                const href = links[0].getAttribute('href');
                const match = href.match(/(.*?)_static/);
                if (match) return match[1] + '_static';
            }
            return '_static';
        }
        
        const staticPath = getStaticPath();
        
        function processMenuItems(container) {
            const items = container.querySelectorAll('[class*="toctree-l"]');
            
            items.forEach(item => {
                const link = item.querySelector('a');
                const submenu = item.querySelector('ul');
                
                if (!link) return;
                
                if (link.dataset.menuProcessed === 'true') {
                    return;
                }
                link.dataset.menuProcessed = 'true';
                
                const finalLink = link;
                
                if (submenu && submenu.children.length > 0) {
                    let arrowIcon = finalLink.querySelector('.nav-arrow-icon');
                    if (!arrowIcon) {
                        arrowIcon = document.createElement('img');
                        arrowIcon.src = staticPath + '/icons/arrow_down_for_nav.svg';
                        arrowIcon.className = 'nav-arrow-icon';
                        arrowIcon.alt = '';
                        arrowIcon.style.cursor = 'pointer';
                        finalLink.appendChild(arrowIcon);
                    }
                    
                    if (!arrowIcon.dataset.clickHandlerAdded) {
                        arrowIcon.dataset.clickHandlerAdded = 'true';
                        
                        arrowIcon.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            const isExpanded = item.classList.contains('expanded');
                            if (isExpanded) {
                                item.classList.remove('expanded');
                            } else {
                                requestAnimationFrame(() => {
                                    item.classList.add('expanded');
                                });
                            }
                            return false;
                        }, true);
                    }
                    
                    finalLink.addEventListener('click', function(e) {
                        const target = e.target;
                        const isExpanded = item.classList.contains('expanded');
                        
                        if (target.classList.contains('nav-arrow-icon') || 
                            target.closest('.nav-arrow-icon')) {
                            return;
                        }
                        
                        if (!isExpanded) {
                            e.preventDefault();
                            e.stopPropagation();
                            // Используем requestAnimationFrame для плавного открытия
                            requestAnimationFrame(() => {
                                item.classList.add('expanded');
                            });
                        }
                    });
                    
                    if (item.classList.contains('current')) {
                        item.classList.add('expanded');
                    }
                } else {
                    finalLink.addEventListener('click', function(e) {
                        const parent = item.parentElement;
                        if (parent) {
                            parent.querySelectorAll('[class*="toctree-l"]').forEach(sibling => {
                                sibling.classList.remove('current');
                            });
                        }
                        item.classList.add('current');
                    });
                }
            });
        }
        
        processMenuItems(leftNav);
    }
    
    setTimeout(initCollapsibleMenu, 100);

    // Раскрывающиеся элементы FAQ
    
    function initFAQ() {
        if (!document.body) {
            return;
        }
        
        const faqHeaders = document.querySelectorAll('.faq-category-header');
        
        if (faqHeaders.length === 0) {
            setTimeout(initFAQ, 100);
            return;
        }
        
        faqHeaders.forEach(header => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('faq-category-content')) {
                header.classList.remove('active');
                content.classList.remove('active');
            }
        });
        
        faqHeaders.forEach((header, index) => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('faq-category-content')) {
                header.classList.remove('active');
                content.classList.remove('active');
                content.style.maxHeight = '0';
            }
            
            header.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const content = this.nextElementSibling;
                
                if (!content || !content.classList.contains('faq-category-content')) {
                    return;
                }
                
                const isActive = this.classList.contains('active');
                this.classList.toggle('active');
                content.classList.toggle('active');
                
                if (!isActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        });
    }
    
    function startFAQ() {
        if (!document.body) {
            setTimeout(startFAQ, 50);
            return;
        }
        initFAQ();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startFAQ);
    } else {
        startFAQ();
    }
    
    setTimeout(function() {
        if (document.body) {
            initFAQ();
        }
    }, 500);
    
    setTimeout(function() {
        if (document.body) {
            initFAQ();
        }
    }, 1000);

    // Плавающее меню содержания (десктоп)
    
    function initRightMenu() {
        console.log('[Homepage Right Menu] initRightMenu called');
        const floatingTocPage = document.getElementById('floatingTocPage');
        console.log('[Homepage Right Menu] floatingTocPage found:', !!floatingTocPage);
        
        if (!floatingTocPage) {
            console.log('[Homepage Right Menu] floatingTocPage not found, retrying in 100ms');
            setTimeout(initRightMenu, 100);
            return;
        }
        
        console.log('[Homepage Right Menu] Initializing right menu handlers');
        const tocLinks = Array.from(floatingTocPage.querySelectorAll('a'));
        console.log('[Homepage Right Menu] Found TOC links:', tocLinks.length);
        let userClickedLink = null;
        let clickTimeout = null;
        
        tocLinks.forEach((link, index) => {
            console.log('[Homepage Right Menu] Setting up click handler for link #' + index + ':', link.getAttribute('href'));
            link.addEventListener('click', function(e) {
                console.log('[Homepage Right Menu] Link clicked:', this.getAttribute('href'));
                console.log('[Homepage Right Menu] Event default prevented:', e.defaultPrevented);
                const clickedLink = this;
                let targetId = clickedLink.getAttribute('href');
                console.log('[Homepage Right Menu] Target ID from href:', targetId);
                
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                    console.log('[Homepage Right Menu] preventDefault() called');
                }
                
                userClickedLink = clickedLink;
                
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                }
                
                const allTocLinks = Array.from(floatingTocPage.querySelectorAll('a'));
                allTocLinks.forEach(l => {
                    l.classList.remove('active');
                });
                
                clickedLink.classList.add('active');
                
                // Сбрасываем флаг через короткое время, чтобы обновление при скролле работало
                setTimeout(() => {
                    userClickedLink = null;
                }, 500);
                
                if (!targetId || targetId === '#') {
                    const linkText = clickedLink.textContent.trim();
                    const sections = document.querySelectorAll('.section, .subsection');
                    sections.forEach(section => {
                        const sectionId = section.getAttribute('id');
                        const sectionTitle = section.querySelector('h1, h2, h3')?.textContent.trim();
                        if (sectionTitle === linkText || sectionId && linkText.includes(sectionId.replace('#', ''))) {
                            targetId = '#' + sectionId;
                        }
                    });
                }
                
                if (targetId && targetId.startsWith('#')) {
                    console.log('[Homepage Right Menu] Looking for target element:', targetId);
                    const targetElement = document.querySelector(targetId);
                    console.log('[Homepage Right Menu] Target element found:', !!targetElement);
                    if (targetElement) {
                        const headerHeight = document.querySelector('.custom-header')?.offsetHeight || 65;
                        console.log('[Homepage Right Menu] Header height:', headerHeight);
                        
                        // Используем getBoundingClientRect для более точного расчета
                        const rect = targetElement.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
                        const calculatedPosition = rect.top + scrollTop - headerHeight - 20;
                        console.log('[Homepage Right Menu] Element rect.top:', rect.top);
                        console.log('[Homepage Right Menu] Current scrollTop:', scrollTop);
                        console.log('[Homepage Right Menu] Calculated position:', calculatedPosition);
                        
                        // Всегда используем window.scrollTo для главной страницы
                        const finalPosition = Math.max(0, calculatedPosition);
                        console.log('[Homepage Right Menu] Final scroll position:', finalPosition);
                        window.scrollTo({
                            top: finalPosition,
                            behavior: 'smooth'
                        });
                        console.log('[Homepage Right Menu] window.scrollTo called with position:', finalPosition);
                        
                        clickTimeout = setTimeout(() => {
                            userClickedLink = null;
                            clickTimeout = null;
                        }, 400);
                    } else {
                        const linkText = clickedLink.textContent.trim();
                        const sections = document.querySelectorAll('.section, .subsection');
                        let foundSection = null;
                        
                        sections.forEach(section => {
                            const sectionId = section.getAttribute('id');
                            const sectionTitle = section.querySelector('h1, h2, h3')?.textContent.trim();
                            if (sectionTitle === linkText || (sectionId && linkText.includes(sectionId))) {
                                foundSection = section;
                            }
                        });
                        
                        if (foundSection) {
                            const headerHeight = document.querySelector('.custom-header')?.offsetHeight || 64;
                            console.log('[Homepage Right Menu] Found section by text, header height:', headerHeight);
                            
                            const rect = foundSection.getBoundingClientRect();
                            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                            const targetPosition = rect.top + scrollTop - headerHeight - 20;
                            console.log('[Homepage Right Menu] Calculated target position (by text):', targetPosition);
                            
                            window.scrollTo({
                                top: Math.max(0, targetPosition),
                                behavior: 'smooth'
                            });
                            console.log('[Homepage Right Menu] window.scrollTo called (by text)');
                        } else {
                            console.log('[Homepage Right Menu] Section not found by text, scrolling to top');
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }
                        
                        clickTimeout = setTimeout(() => {
                            userClickedLink = null;
                            clickTimeout = null;
                        }, 400);
                    }
                } else if (!targetId || targetId === '#') {
                    console.log('[Homepage Right Menu] No target ID, scrolling to top');
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    clickTimeout = setTimeout(() => {
                        userClickedLink = null;
                        clickTimeout = null;
                    }, 800);
                } else {
                    console.log('[Homepage Right Menu] Target ID is not a hash:', targetId);
                }
            });
        });

        const sections = document.querySelectorAll('.section, .subsection');
        
        function updateActiveSection() {
            console.log('[Homepage TOC] updateActiveSection called, userClickedLink:', !!userClickedLink);
            
            if (userClickedLink) {
                console.log('[Homepage TOC] SKIP: userClickedLink is set');
                return;
            }
            
            const headerHeight = document.querySelector('.custom-header')?.offsetHeight || document.querySelector('.homepage-header')?.offsetHeight || 80;
            const isHomepage = document.body.classList.contains('homepage');
            const scrollPosition = isHomepage ? 
                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
            const viewportTop = scrollPosition + headerHeight + 50;
            
            console.log('[Homepage TOC] Update:', { scroll: Math.round(scrollPosition), header: headerHeight });
            
            let activeSection = null;
            let activeSectionTop = -Infinity;
            
            const subsections = document.querySelectorAll('.subsection');
            let foundVisibleSubsection = false;
            let firstSubsectionTop = Infinity;
            let lastSubsectionBottom = -Infinity;
            
            if (subsections.length > 0) {
                subsections.forEach(subsection => {
                    // Используем getBoundingClientRect для более точного расчета
                    const rect = subsection.getBoundingClientRect();
                    const scrollTop = isHomepage ? 
                        (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                    const sectionTop = rect.top + scrollTop;
                    const sectionHeight = subsection.offsetHeight;
                    const sectionBottom = sectionTop + sectionHeight;
                    if (sectionTop < firstSubsectionTop) {
                        firstSubsectionTop = sectionTop;
                    }
                    if (sectionBottom > lastSubsectionBottom) {
                        lastSubsectionBottom = sectionBottom;
                    }
                });
            }
            
            const currentViewportTop = scrollPosition + headerHeight + 20;
            const isInSubsectionsArea = subsections.length > 0 && 
                currentViewportTop >= firstSubsectionTop && 
                currentViewportTop <= lastSubsectionBottom;
            const isBelowAllSubsections = subsections.length > 0 && 
                currentViewportTop > lastSubsectionBottom;
            const isBeforeSubsections = subsections.length > 0 && 
                currentViewportTop < firstSubsectionTop; // Пользователь находится до подсекций
            const isJustAfterSubsections = subsections.length > 0 && 
                scrollPosition > lastSubsectionBottom - headerHeight - 20 && 
                scrollPosition <= lastSubsectionBottom - headerHeight - 20 + 150;
            
            if (subsections.length > 0 && !isBeforeSubsections && !isBelowAllSubsections) {
                subsections.forEach(subsection => {
                    // Используем getBoundingClientRect для более точного расчета
                    const rect = subsection.getBoundingClientRect();
                    const scrollTop = isHomepage ? 
                        (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                    const sectionTop = rect.top + scrollTop;
                    const sectionHeight = subsection.offsetHeight;
                    const sectionBottom = sectionTop + sectionHeight;
                    
                    // Секция активна только когда она видна в верхней части viewport (с учетом header)
                    const sectionTopVisible = sectionTop <= scrollPosition + headerHeight + 20;
                    const sectionBottomVisible = sectionBottom > scrollPosition + headerHeight + 20;
                    
                    if (sectionTopVisible && sectionBottomVisible) {
                        if (sectionTop >= activeSectionTop) {
                            activeSection = subsection;
                            activeSectionTop = sectionTop;
                            foundVisibleSubsection = true;
                        }
                    } else if (sectionTop <= scrollPosition + headerHeight + 20 && sectionTop > activeSectionTop && !foundVisibleSubsection) {
                        activeSection = subsection;
                        activeSectionTop = sectionTop;
                    }
                });
            }
            
            if (!isInSubsectionsArea && !isJustAfterSubsections && (!foundVisibleSubsection || isBelowAllSubsections || isBeforeSubsections)) {
                sections.forEach(section => {
                    if (section.classList.contains('subsection')) {
                        return;
                    }
                    
                    // 1. Пользователь в области подсекций
                    // 2. ИЛИ найдена видимая подсекция
                    // 3. ИЛИ пользователь только что вышел из области подсекций (в пределах 200px после последней)
                    if (section.id === 'section-guides' && (isInSubsectionsArea || foundVisibleSubsection || isJustAfterSubsections)) {
                        return;
                    }
                    
                    if (isJustAfterSubsections || isInSubsectionsArea) {
                        // Находим позицию секции "Подробные юзергиды" для определения границы
                        const guidesSection = document.getElementById('section-guides');
                        if (guidesSection) {
                            const rect = guidesSection.getBoundingClientRect();
                            const scrollTop = isHomepage ? 
                                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                            const guidesSectionTop = rect.top + scrollTop;
                            
                            const currentRect = section.getBoundingClientRect();
                            const currentSectionTop = currentRect.top + scrollTop;
                            if (currentSectionTop < guidesSectionTop) {
                                return;
                            }
                        }
                    }
                    
                    // Используем getBoundingClientRect для более точного расчета
                    const rect = section.getBoundingClientRect();
                    const scrollTop = isHomepage ? 
                        (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                    const sectionTop = rect.top + scrollTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionBottom = sectionTop + sectionHeight;
                    
                    // Секция активна только когда она видна в верхней части viewport (с учетом header)
                    const sectionTopVisible = sectionTop <= scrollPosition + headerHeight + 20;
                    const sectionBottomVisible = sectionBottom > scrollPosition + headerHeight + 20;
                    
                    if (sectionTopVisible && sectionBottomVisible) {
                        if (sectionTop >= activeSectionTop) {
                            activeSection = section;
                            activeSectionTop = sectionTop;
                        }
                    } else if (sectionTop <= scrollPosition + headerHeight + 20 && sectionTop > activeSectionTop) {
                        activeSection = section;
                        activeSectionTop = sectionTop;
                    }
                });
            }
            
            if (!activeSection && !isInSubsectionsArea && !isJustAfterSubsections) {
                sections.forEach(section => {
                    if (section.classList.contains('subsection')) {
                        return;
                    }
                    
                    // 1. Пользователь в области подсекций
                    // 2. ИЛИ найдена видимая подсекция
                    // 3. ИЛИ пользователь находится между первой и последней подсекцией
                    // 4. ИЛИ пользователь только что вышел из области подсекций (в пределах 300px после последней)
                    if (section.id === 'section-guides' && (isInSubsectionsArea || foundVisibleSubsection || 
                        (subsections.length > 0 && currentViewportTop >= firstSubsectionTop && currentViewportTop <= lastSubsectionBottom) ||
                        isJustAfterSubsections)) {
                        return;
                    }
                    
                    if (isJustAfterSubsections || isInSubsectionsArea) {
                        // Находим позицию секции "Подробные юзергиды" для определения границы
                        const guidesSection = document.getElementById('section-guides');
                        if (guidesSection) {
                            const rect = guidesSection.getBoundingClientRect();
                            const scrollTop = isHomepage ? 
                                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                            const guidesSectionTop = rect.top + scrollTop;
                            
                            const currentRect = section.getBoundingClientRect();
                            const currentSectionTop = currentRect.top + scrollTop;
                            if (currentSectionTop < guidesSectionTop) {
                                return;
                            }
                        }
                    }
                    
                    if (isJustAfterSubsections || isInSubsectionsArea) {
                        // Находим позицию секции "Подробные юзергиды" для определения границы
                        const guidesSection = document.getElementById('section-guides');
                        if (guidesSection) {
                            const rect = guidesSection.getBoundingClientRect();
                            const scrollTop = isHomepage ? 
                                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                            const guidesSectionTop = rect.top + scrollTop;
                            
                            const currentRect = section.getBoundingClientRect();
                            const currentSectionTop = currentRect.top + scrollTop;
                            if (currentSectionTop < guidesSectionTop) {
                                return;
                            }
                        }
                    }
                    
                    // Используем getBoundingClientRect для более точного расчета
                    const rect = section.getBoundingClientRect();
                    const scrollTop = isHomepage ? 
                        (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                    const sectionTop = rect.top + scrollTop;
                    
                    // Секция активна только когда она видна в верхней части viewport (с учетом header)
                    if (sectionTop <= scrollPosition + headerHeight + 20 && sectionTop > activeSectionTop) {
                        activeSection = section;
                        activeSectionTop = sectionTop;
                    }
                });
            }
            
            if (activeSection) {
                const sectionId = activeSection.getAttribute('id');
                const allTocLinks = Array.from(floatingTocPage.querySelectorAll('a'));
                let foundMatch = false;
                allTocLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href') || '';
                    if (linkHref === '#' + sectionId || linkHref === sectionId || 
                        (linkHref && linkHref.replace('#', '') === sectionId)) {
                        link.classList.add('active');
                        foundMatch = true;
                        console.log('[Homepage TOC] ✓ Active:', sectionId, link.textContent.trim().substring(0, 40));
                    }
                });
                if (!foundMatch) {
                    console.log('[Homepage TOC] ✗ No match for section:', sectionId);
                }
            } else {
                const isHomepage = document.body.classList.contains('homepage');
                const currentScroll = isHomepage ? 
                    (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                    (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                const allTocLinks = Array.from(floatingTocPage.querySelectorAll('a'));
                allTocLinks.forEach(link => link.classList.remove('active'));
                
                if (currentScroll < 200) {
                    const firstLink = allTocLinks[0];
                    if (firstLink) {
                        firstLink.classList.add('active');
                        console.log('[Homepage TOC] ✓ First link (top):', firstLink.textContent.trim().substring(0, 40));
                    }
                } else {
                    console.log('[Homepage TOC] ✗ No active section, scroll:', Math.round(currentScroll));
                }
            }
        }
        
        let ticking = false;
        const isHomepage = document.body.classList.contains('homepage');
        
        // Для главной страницы слушаем скролл и на window, и на document.body
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll);
        if (isHomepage) {
            document.body.addEventListener('scroll', handleScroll);
            document.documentElement.addEventListener('scroll', handleScroll);
        }
        
        setTimeout(() => {
            updateActiveSection();
        }, 100);
        
        updateActiveSection();
    }
    
    // Инициализируем правое меню
    initRightMenu();

    function initBurgerMenu() {
        console.log('[Homepage Burger Menu] initBurgerMenu called');
        const burgerToggle = document.getElementById('burgerToggle');
        console.log('[Homepage Burger Menu] burgerToggle found:', !!burgerToggle);
        
        if (!burgerToggle) {
            console.log('[Homepage Burger Menu] burgerToggle not found, retrying in 100ms');
            setTimeout(initBurgerMenu, 100);
            return;
        }
        
        function createOverlay() {
            let overlay = document.querySelector('.left-nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'left-nav-overlay';
                document.body.appendChild(overlay);
                console.log('[Homepage Burger Menu] Created overlay');
            }
            return overlay;
        }
        
        // Получаем floatingTocPage из глобальной области или находим заново
        const floatingTocPage = document.getElementById('floatingTocPage');
        console.log('[Homepage Burger Menu] floatingTocPage found:', !!floatingTocPage);
        
        if (floatingTocPage) {
            const overlay = createOverlay();
            console.log('[Homepage Burger Menu] Setting up burger toggle click handler');
            
            burgerToggle.addEventListener('click', function(e) {
                console.log('[Homepage Burger Menu] Burger toggle clicked');
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = floatingTocPage.classList.contains('active');
                console.log('[Homepage Burger Menu] Menu is active:', isActive);
                
                if (isActive) {
                    console.log('[Homepage Burger Menu] Closing menu');
                    floatingTocPage.classList.remove('active');
                    overlay.classList.remove('active');
                    burgerToggle.classList.remove('active');
                } else {
                    console.log('[Homepage Burger Menu] Opening menu');
                    floatingTocPage.classList.add('active');
                    overlay.classList.add('active');
                    burgerToggle.classList.add('active');
                }
            });
            
            overlay.addEventListener('click', function() {
                console.log('[Homepage Burger Menu] Overlay clicked, closing menu');
                floatingTocPage.classList.remove('active');
                overlay.classList.remove('active');
                burgerToggle.classList.remove('active');
            });
            
            document.addEventListener('click', function(e) {
                if (floatingTocPage && floatingTocPage.classList.contains('active')) {
                    if (!floatingTocPage.contains(e.target) && 
                        !burgerToggle.contains(e.target) &&
                        e.target !== overlay) {
                        console.log('[Homepage Burger Menu] Click outside menu, closing');
                        floatingTocPage.classList.remove('active');
                        overlay.classList.remove('active');
                        burgerToggle.classList.remove('active');
                    }
                }
            });
        } else {
            console.log('[Homepage Burger Menu] floatingTocPage not found, cannot initialize burger menu');
        }
    }
    
    // Инициализируем бургер-меню
    initBurgerMenu();

    function handleResize() {
        const width = window.innerWidth;
        console.log('[Homepage Right Menu] handleResize called, width:', width);
        
        const floatingTocPage = document.getElementById('floatingTocPage');
        const burgerToggle = document.getElementById('burgerToggle');
        console.log('[Homepage Right Menu] floatingTocPage found:', !!floatingTocPage);
        console.log('[Homepage Right Menu] burgerToggle found:', !!burgerToggle);
        
        if (width <= 1280) {
            if (floatingTocPage && !floatingTocPage.classList.contains('active')) {
                console.log('[Homepage Right Menu] Hiding menu (width <= 1280)');
                floatingTocPage.style.display = 'none';
            }
        } else {
            if (floatingTocPage) {
                console.log('[Homepage Right Menu] Showing menu (width > 1280)');
                floatingTocPage.style.display = 'flex';
                floatingTocPage.classList.remove('active');
            }
            if (burgerToggle) {
                console.log('[Homepage Right Menu] Hiding burger toggle (width > 1280)');
                burgerToggle.style.display = 'none';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    console.log('[Homepage Right Menu] Calling handleResize on load');
    handleResize();

    function moveSearchToLeftMenu() {
        const headerSearchContainer = document.querySelector('.custom-header .search-container');
        const leftNavContent = document.querySelector('.left-nav-content');
        
        if (!headerSearchContainer || !leftNavContent) {
            return;
        }
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            let mobileSearch = leftNavContent.querySelector('.search-container.mobile-search');
            
            if (!mobileSearch) {
                mobileSearch = headerSearchContainer.cloneNode(true);
                mobileSearch.classList.add('mobile-search');
                leftNavContent.insertBefore(mobileSearch, leftNavContent.firstChild);
            }
        } else {
            const mobileSearch = leftNavContent.querySelector('.search-container.mobile-search');
            if (mobileSearch) {
                mobileSearch.remove();
            }
        }
    }
    
    function initMobileSearch() {
        moveSearchToLeftMenu();
        window.addEventListener('resize', moveSearchToLeftMenu);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileSearch);
    } else {
        initMobileSearch();
    }
});
