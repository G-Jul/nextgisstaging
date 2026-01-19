// JavaScript для главной страницы NextGIS Documentation

document.addEventListener('DOMContentLoaded', function() {
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
                // Добавляем класс для анимации стрелки
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
                // Убираем класс для анимации стрелки
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
                                // Используем requestAnimationFrame для плавного открытия
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
    
    const floatingToc = document.getElementById('floatingToc');
    
    if (floatingToc) {
        // Получаем все ссылки, включая вложенные в подменю
        const tocLinks = Array.from(floatingToc.querySelectorAll('a'));
        let userClickedLink = null;
        let clickTimeout = null;
        
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const clickedLink = this;
                let targetId = clickedLink.getAttribute('href');
                
                // Предотвращаем стандартное поведение только если это не пустая ссылка
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                }
                
                userClickedLink = clickedLink;
                
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                }
                
                // Убираем active со всех ссылок (включая вложенные)
                const allTocLinks = Array.from(floatingToc.querySelectorAll('a'));
                allTocLinks.forEach(l => {
                    l.classList.remove('active');
                });
                
                // Добавляем active к кликнутой ссылке
                clickedLink.classList.add('active');
                
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
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = document.querySelector('.homepage-header')?.offsetHeight || 80;
                        
                        // Собираем все offsetTop до body для точного расчета
                        let targetPosition = 0;
                        let element = targetElement;
                        
                        while (element && element !== document.body) {
                            targetPosition += element.offsetTop;
                            element = element.offsetParent;
                        }
                        
                        targetPosition = Math.max(0, targetPosition - headerHeight - 20);
                        
                        // Пробуем скролл на window и на body
                        const isHomepage = document.body.classList.contains('homepage');
                        
                        if (isHomepage && document.body.scrollHeight > window.innerHeight) {
                            // Если скролл на body (homepage)
                            document.body.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        } else {
                            // Если скролл на window
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                        
                        clickTimeout = setTimeout(() => {
                            userClickedLink = null;
                            clickTimeout = null;
                        }, 1000);
                    } else {
                        // Если элемент не найден, пробуем найти по тексту
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
                            const headerHeight = document.querySelector('.homepage-header')?.offsetHeight || 80;
                            
                            // Используем getBoundingClientRect для более точного расчета
                            const rect = foundSection.getBoundingClientRect();
                            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                            const targetPosition = rect.top + scrollTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: Math.max(0, targetPosition),
                                behavior: 'smooth'
                            });
                        } else {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }
                        
                        clickTimeout = setTimeout(() => {
                            userClickedLink = null;
                            clickTimeout = null;
                        }, 800);
                    }
                } else if (!targetId || targetId === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    clickTimeout = setTimeout(() => {
                        userClickedLink = null;
                        clickTimeout = null;
                    }, 800);
                }
            });
        });

        const sections = document.querySelectorAll('.section, .subsection');
        
        function updateActiveSection() {
            // Если пользователь недавно кликнул, не обновляем
            if (userClickedLink) {
                return;
            }
            
            const headerHeight = document.querySelector('.homepage-header')?.offsetHeight || 80;
            // Получаем позицию скролла с учетом того, что скролл может быть на body
            const isHomepage = document.body.classList.contains('homepage');
            const scrollPosition = isHomepage ? 
                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
            // Уменьшаем отступ, чтобы активная секция определялась точнее
            const viewportTop = scrollPosition + headerHeight + 50;
            
            let activeSection = null;
            let activeSectionTop = -Infinity;
            
            // Сначала проверяем подсекции (subsection), так как они имеют приоритет
            const subsections = document.querySelectorAll('.subsection');
            let foundVisibleSubsection = false;
            let firstSubsectionTop = Infinity;
            let lastSubsectionBottom = -Infinity;
            
            // Находим границы всех подсекций
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
            
            // Проверяем, находится ли пользователь в области подсекций
            // Используем более точные границы с учетом текущей позиции скролла
            const currentViewportTop = scrollPosition + headerHeight + 20;
            const isInSubsectionsArea = subsections.length > 0 && 
                currentViewportTop >= firstSubsectionTop && 
                currentViewportTop <= lastSubsectionBottom;
            const isBelowAllSubsections = subsections.length > 0 && 
                currentViewportTop > lastSubsectionBottom;
            const isBeforeSubsections = subsections.length > 0 && 
                currentViewportTop < firstSubsectionTop; // Пользователь находится до подсекций
            // Проверяем, находится ли пользователь сразу после последней подсекции (в пределах 150px)
            // Используем scrollPosition напрямую для более точного определения
            const isJustAfterSubsections = subsections.length > 0 && 
                scrollPosition > lastSubsectionBottom - headerHeight - 20 && 
                scrollPosition <= lastSubsectionBottom - headerHeight - 20 + 150;
            
            // ВСЕГДА сначала проверяем подсекции, если они есть и пользователь в их области или близко к ним
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
                    
                    // Проверяем, видна ли подсекция в области просмотра
                    // Секция активна только когда она видна в верхней части viewport (с учетом header)
                    const sectionTopVisible = sectionTop <= scrollPosition + headerHeight + 20;
                    const sectionBottomVisible = sectionBottom > scrollPosition + headerHeight + 20;
                    
                    if (sectionTopVisible && sectionBottomVisible) {
                        // Если подсекция видна и находится выше текущей активной
                        if (sectionTop >= activeSectionTop) {
                            activeSection = subsection;
                            activeSectionTop = sectionTop;
                            foundVisibleSubsection = true;
                        }
                    } else if (sectionTop <= scrollPosition + headerHeight + 20 && sectionTop > activeSectionTop && !foundVisibleSubsection) {
                        // Если подсекция уже прошла, но была последней видимой (только если нет видимых подсекций)
                        activeSection = subsection;
                        activeSectionTop = sectionTop;
                    }
                });
            }
            
            // Если не нашли видимую подсекцию или пользователь находится ниже всех подсекций, проверяем основные секции
            // НО проверяем основные секции только если мы НЕ в области подсекций И НЕ только что вышли из них
            // Если мы в области подсекций или только что вышли из них, то не проверяем основные секции вообще
            if (!isInSubsectionsArea && !isJustAfterSubsections && (!foundVisibleSubsection || isBelowAllSubsections || isBeforeSubsections)) {
                sections.forEach(section => {
                    // Пропускаем подсекции, так как мы их уже проверили
                    if (section.classList.contains('subsection')) {
                        return;
                    }
                    
                    // Исключаем родительскую секцию "Подробные юзергиды" если:
                    // 1. Пользователь в области подсекций
                    // 2. ИЛИ найдена видимая подсекция
                    // 3. ИЛИ пользователь только что вышел из области подсекций (в пределах 200px после последней)
                    if (section.id === 'section-guides' && (isInSubsectionsArea || foundVisibleSubsection || isJustAfterSubsections)) {
                        return;
                    }
                    
                    // Исключаем секции, которые находятся до подсекций, если пользователь в области подсекций или только что вышел из них
                    // Это предотвращает активацию "Мне нужно" когда пользователь находится в области подсекций
                    if (isJustAfterSubsections || isInSubsectionsArea) {
                        // Находим позицию секции "Подробные юзергиды" для определения границы
                        const guidesSection = document.getElementById('section-guides');
                        if (guidesSection) {
                            const rect = guidesSection.getBoundingClientRect();
                            const scrollTop = isHomepage ? 
                                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                            const guidesSectionTop = rect.top + scrollTop;
                            
                            // Если текущая секция находится до "Подробные юзергиды", пропускаем ее
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
                    
                    // Проверяем, видна ли секция в области просмотра
                    // Секция активна только когда она видна в верхней части viewport (с учетом header)
                    const sectionTopVisible = sectionTop <= scrollPosition + headerHeight + 20;
                    const sectionBottomVisible = sectionBottom > scrollPosition + headerHeight + 20;
                    
                    if (sectionTopVisible && sectionBottomVisible) {
                        // Если секция видна и находится выше текущей активной
                        if (sectionTop >= activeSectionTop) {
                            activeSection = section;
                            activeSectionTop = sectionTop;
                        }
                    } else if (sectionTop <= scrollPosition + headerHeight + 20 && sectionTop > activeSectionTop) {
                        // Если секция уже прошла, но была последней видимой
                        activeSection = section;
                        activeSectionTop = sectionTop;
                    }
                });
            }
            
            // Если не нашли активную секцию, берем последнюю видимую
            // Но исключаем родительскую секцию подсекций, если пользователь в области подсекций
            // И НЕ проверяем секции, если пользователь в области подсекций или только что вышел из них
            if (!activeSection && !isInSubsectionsArea && !isJustAfterSubsections) {
                sections.forEach(section => {
                    // Пропускаем подсекции
                    if (section.classList.contains('subsection')) {
                        return;
                    }
                    
                    // Исключаем родительскую секцию "Подробные юзергиды" если:
                    // 1. Пользователь в области подсекций
                    // 2. ИЛИ найдена видимая подсекция
                    // 3. ИЛИ пользователь находится между первой и последней подсекцией
                    // 4. ИЛИ пользователь только что вышел из области подсекций (в пределах 300px после последней)
                    if (section.id === 'section-guides' && (isInSubsectionsArea || foundVisibleSubsection || 
                        (subsections.length > 0 && currentViewportTop >= firstSubsectionTop && currentViewportTop <= lastSubsectionBottom) ||
                        isJustAfterSubsections)) {
                        return;
                    }
                    
                    // Исключаем секции, которые находятся до подсекций, если пользователь в области подсекций или только что вышел из них
                    // Это предотвращает активацию "Мне нужно" когда пользователь находится в области подсекций
                    if (isJustAfterSubsections || isInSubsectionsArea) {
                        // Находим позицию секции "Подробные юзергиды" для определения границы
                        const guidesSection = document.getElementById('section-guides');
                        if (guidesSection) {
                            const rect = guidesSection.getBoundingClientRect();
                            const scrollTop = isHomepage ? 
                                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                            const guidesSectionTop = rect.top + scrollTop;
                            
                            // Если текущая секция находится до "Подробные юзергиды", пропускаем ее
                            const currentRect = section.getBoundingClientRect();
                            const currentSectionTop = currentRect.top + scrollTop;
                            if (currentSectionTop < guidesSectionTop) {
                                return;
                            }
                        }
                    }
                    
                    // Исключаем секции, которые находятся до подсекций, если пользователь в области подсекций или только что вышел из них
                    // Это предотвращает активацию "Мне нужно" когда пользователь находится в области подсекций
                    if (isJustAfterSubsections || isInSubsectionsArea) {
                        // Находим позицию секции "Подробные юзергиды" для определения границы
                        const guidesSection = document.getElementById('section-guides');
                        if (guidesSection) {
                            const rect = guidesSection.getBoundingClientRect();
                            const scrollTop = isHomepage ? 
                                (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                                (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                            const guidesSectionTop = rect.top + scrollTop;
                            
                            // Если текущая секция находится до "Подробные юзергиды", пропускаем ее
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
                // Получаем все ссылки, включая вложенные
                const allTocLinks = Array.from(floatingToc.querySelectorAll('a'));
                allTocLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href');
                    // Проверяем точное совпадение или совпадение без #
                    if (linkHref === '#' + sectionId || linkHref === sectionId || 
                        (linkHref && linkHref.replace('#', '') === sectionId)) {
                        link.classList.add('active');
                    }
                });
            } else {
                // Если секция не найдена и мы в начале страницы, активируем первую ссылку
                const isHomepage = document.body.classList.contains('homepage');
                const currentScroll = isHomepage ? 
                    (document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0) :
                    (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
                if (currentScroll < 200) {
                    const allTocLinks = Array.from(floatingToc.querySelectorAll('a'));
                    allTocLinks.forEach(link => link.classList.remove('active'));
                    const firstLink = allTocLinks[0];
                    if (firstLink) {
                        firstLink.classList.add('active');
                    }
                }
            }
        }
        
        let ticking = false;
        const isHomepage = document.body.classList.contains('homepage');
        const scrollElement = isHomepage ? document.body : window;
        
        scrollElement.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Вызываем при загрузке страницы
        setTimeout(() => {
            updateActiveSection();
        }, 100);
        
        updateActiveSection();
    }

    // Бургер-меню для планшетов и мобильных (открывает правое меню - floating TOC)
    
    const burgerToggle = document.getElementById('burgerToggle');
    
    // Создаем overlay для меню (только на планшетах и мобильных)
    function createOverlay() {
        let overlay = document.querySelector('.left-nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'left-nav-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }
    
    if (burgerToggle) {
        // Получаем floatingToc из глобальной области или находим заново
        const floatingToc = document.getElementById('floatingToc');
        
        if (floatingToc) {
            const overlay = createOverlay();
            
            burgerToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = floatingToc.classList.contains('active');
                
                if (isActive) {
                    // Закрываем меню
                    floatingToc.classList.remove('active');
                    overlay.classList.remove('active');
                    burgerToggle.classList.remove('active');
                } else {
                    // Открываем меню
                    floatingToc.classList.add('active');
                    overlay.classList.add('active');
                    burgerToggle.classList.add('active');
                }
            });
            
            // Закрываем меню при клике на overlay
            overlay.addEventListener('click', function() {
                floatingToc.classList.remove('active');
                overlay.classList.remove('active');
                burgerToggle.classList.remove('active');
            });
            
            // Закрываем меню при клике вне его
            document.addEventListener('click', function(e) {
                if (floatingToc && floatingToc.classList.contains('active')) {
                    if (!floatingToc.contains(e.target) && 
                        !burgerToggle.contains(e.target) &&
                        e.target !== overlay) {
                        floatingToc.classList.remove('active');
                        overlay.classList.remove('active');
                        burgerToggle.classList.remove('active');
                    }
                }
            });
        }
    }

    // Адаптивность
    
    function handleResize() {
        const width = window.innerWidth;
        
        if (width <= 1280) {
            if (floatingToc && !floatingToc.classList.contains('active')) {
                floatingToc.style.display = 'none';
            }
        } else {
            if (floatingToc) {
                floatingToc.style.display = 'flex';
                floatingToc.classList.remove('active');
            }
            if (burgerToggle) {
                burgerToggle.style.display = 'none';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Перемещение инпута поиска в левое меню на мобильных
    
    function moveSearchToLeftMenu() {
        const headerSearchContainer = document.querySelector('.homepage-header .search-container');
        const leftNavContent = document.querySelector('.left-nav-content');
        
        if (!headerSearchContainer || !leftNavContent) {
            return;
        }
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Проверяем, не перемещен ли уже инпут
            let mobileSearch = leftNavContent.querySelector('.search-container.mobile-search');
            
            if (!mobileSearch) {
                // Создаем копию инпута поиска для левого меню
                mobileSearch = headerSearchContainer.cloneNode(true);
                mobileSearch.classList.add('mobile-search');
                leftNavContent.insertBefore(mobileSearch, leftNavContent.firstChild);
            }
        } else {
            // Удаляем инпут из левого меню на десктопе
            const mobileSearch = leftNavContent.querySelector('.search-container.mobile-search');
            if (mobileSearch) {
                mobileSearch.remove();
            }
        }
    }
    
    // Вызываем при загрузке и изменении размера окна
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
