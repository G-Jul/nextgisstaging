(function() {
    'use strict';
    
    


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
    
    function addCustomHeader() {
        const oldHeader = document.querySelector('.custom-header');
        if (oldHeader) {
            oldHeader.remove();
        }
        
        if (!document.body) {
            return;
        }
        
        const body = document.body;
        const staticPath = getStaticPath();
        const indexPath = staticPath.replace('_static', 'index.html');
        
        const customHeader = document.createElement('div');
        customHeader.className = 'custom-header';
        customHeader.innerHTML = `
        <div class="header-container">
            <div class="header-left">
                <a class="logo-link-main" href="${indexPath}">
                    <img src="${staticPath}/images/logo.svg" alt="NextGIS" class="logo">
                    <span>NextGIS</span>
                </a>
                <a href="#" class="logo-link" id="logoLink">
                    <span class="logo-text">Документация</span>
                    <span class="dropdown-arrow" id="dropdownArrow"><img src="${staticPath}/icons/arrow_down_for_nav.svg" alt=""></span>
                </a>
            </div>
            <div class="header-right">
                <div class="search-container">
                    <img src="${staticPath}/icons/search-icon.svg" alt="Поиск" class="search-icon">
                    <input type="search" placeholder="Поиск по документации..." class="search-input">
                </div>
                <button class="btn-login">Войти</button>
            </div>
        </div>
        `;
        
        if (body.firstChild) {
            body.insertBefore(customHeader, body.firstChild);
        } else {
            body.appendChild(customHeader);
        }
    }
    
    function addLeftNav() {
        const oldNav = document.getElementById('leftNav');
        if (oldNav && oldNav.parentElement) {
            oldNav.parentElement.remove();
        }
        
        if (!document.body) {
            return;
        }
        
        const wyMenu = document.querySelector('.wy-menu');
        if (!wyMenu) {
            setTimeout(addLeftNav, 200);
            return;
        }
        
        const body = document.body;
        const leftNavWrapper = document.createElement('div');
        leftNavWrapper.className = 'left-nav-wrapper';
        
        const leftNav = document.createElement('nav');
        leftNav.className = 'left-nav';
        leftNav.id = 'leftNav';
        leftNav.innerHTML = `
            <div class="left-nav-header">
            </div>
            <div class="left-nav-content"></div>
        `;
        
        const leftNavContent = leftNav.querySelector('.left-nav-content');
        const menuClone = wyMenu.cloneNode(true);
        menuClone.classList.remove('wy-menu', 'wy-menu-vertical');
        menuClone.classList.add('toctree-wrapper');
        
        leftNavContent.appendChild(menuClone);
        leftNavWrapper.appendChild(leftNav);
        body.appendChild(leftNavWrapper);
    }
    
    function initNavigation() {
        const leftNav = document.getElementById('leftNav');
        const navToggle = document.querySelector('.nav-toggle');
        const leftNavClose = document.getElementById('leftNavClose');
        const logoLink = document.querySelector('.logo-link');
        const dropdownArrow = document.getElementById('dropdownArrow');

        if (logoLink) {
            logoLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (leftNav) {
                    const isActive = leftNav.classList.contains('active');
                    leftNav.classList.toggle('active');
                    document.body.classList.toggle('left-nav-open', !isActive);
                }
            });
        }

        if (dropdownArrow) {
            dropdownArrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (leftNav) {
                    const isActive = leftNav.classList.contains('active');
                    leftNav.classList.toggle('active');
                    document.body.classList.toggle('left-nav-open', !isActive);
                }
            });
        }

        if (navToggle) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (leftNav) {
                    const isActive = leftNav.classList.contains('active');
                    leftNav.classList.toggle('active');
                    document.body.classList.toggle('left-nav-open', !isActive);
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (leftNav && leftNav.classList.contains('active')) {
                if (!leftNav.contains(e.target) && 
                    (!navToggle || !navToggle.contains(e.target)) && 
                    (!logoLink || !logoLink.contains(e.target)) &&
                    (!dropdownArrow || !dropdownArrow.contains(e.target))) {
                    leftNav.classList.remove('active');
                    document.body.classList.remove('left-nav-open');
                }
            }
        });
    }
    
    function initCollapsibleMenu() {
        const leftNav = document.getElementById('leftNav');
        if (!leftNav) {
            return;
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
                        arrowIcon = document.createElement('div');
                        arrowIcon.className = 'nav-arrow-icon';
                        arrowIcon.style.cursor = 'pointer';
                        
                        const arrowImg = document.createElement('img');
                        arrowImg.src = staticPath + '/icons/arrow_down_for_nav.svg';
                        arrowImg.className = 'nav-arrow-icon-img';
                        arrowImg.alt = '';
                        
                        arrowIcon.appendChild(arrowImg);
                        finalLink.appendChild(arrowIcon);
                    }
                    
                    if (!arrowIcon.dataset.clickHandlerAdded) {
                        arrowIcon.dataset.clickHandlerAdded = 'true';
                        
                        arrowIcon.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            
                            const leftNav = document.getElementById('leftNav');
                            if (leftNav) {
                                leftNav.dataset.userClicked = 'true';
                                setTimeout(() => {
                                    if (leftNav) {
                                        leftNav.dataset.userClicked = 'false';
                                    }
                                }, 2000);
                            }
                            
                            // Переключаем состояние независимо от класса current
                            const isExpanded = item.classList.contains('expanded');
                            if (isExpanded) {
                                item.classList.remove('expanded');
                                // Если элемент был current и мы его сворачиваем, убираем current
                                if (item.classList.contains('current')) {
                                    item.classList.remove('current');
                                }
                            } else {
                                item.classList.add('expanded');
                            }
                            return false;
                        }, true);
                        
                        arrowIcon.addEventListener('mousedown', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }, true);
                    }
                    
                    const expandButton = finalLink.querySelector('.toctree-expand');
                    if (expandButton) {
                        expandButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            
                            const leftNav = document.getElementById('leftNav');
                            if (leftNav) {
                                leftNav.dataset.userClicked = 'true';
                                setTimeout(() => {
                                    if (leftNav) {
                                        leftNav.dataset.userClicked = 'false';
                                    }
                                }, 2000);
                            }
                            
                            const isExpanded = item.classList.contains('expanded');
                            if (isExpanded) {
                                item.classList.remove('expanded');
                                // Если элемент был current и мы его сворачиваем, убираем current
                                if (item.classList.contains('current')) {
                                    item.classList.remove('current');
                                }
                            } else {
                                item.classList.add('expanded');
                            }
                            return false;
                        }, true);
                    }
                    
                    finalLink.addEventListener('click', function(e) {
                        const target = e.target;
                        const isExpanded = item.classList.contains('expanded');
                        const linkText = finalLink.textContent.trim().substring(0, 50);
                        const href = finalLink.getAttribute('href');
                        
                        console.log('[Left Menu Current] Link clicked (with submenu):', linkText, 'href:', href, 'isExpanded:', isExpanded);
                        
                        if (target === arrowIcon || 
                            target.classList.contains('nav-arrow-icon') || 
                            target.classList.contains('nav-arrow-icon-img') ||
                            target.classList.contains('toctree-expand') ||
                            target.closest('.nav-arrow-icon') ||
                            target.closest('.toctree-expand')) {
                            console.log('[Left Menu Current] Click on arrow icon, ignoring');
                            return;
                        }
                        
                        if (!isExpanded) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('[Left Menu Current] Expanding item:', linkText);
                            item.classList.add('expanded');
                            
                            if (href && !href.startsWith('#')) {
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    console.log('[Left Menu Current] Removing current from all items (expanding, non-hash)');
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                console.log('[Left Menu Current] Adding current to item (expanding, non-hash):', linkText);
                                item.classList.add('current');
                                
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    console.log('[Left Menu Current] Set userClicked to true (expanding, non-hash)');
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                            console.log('[Left Menu Current] Set userClicked to false (expanding, non-hash)');
                                        }
                                    }, 2000);
                                }
                            }
                        } else {
                            if (href && href.startsWith('#')) {
                                e.preventDefault();
                                const targetElement = document.querySelector(href);
                                if (targetElement) {
                                    // Прокрутка к элементу - элемент должен быть на 80px от верха экрана
                                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                                    const offsetPosition = elementPosition - 80;
                                    
                                    window.scrollTo({
                                        top: Math.max(0, offsetPosition),
                                        behavior: 'smooth'
                                    });
                                    
                                    // Обновляем правый TOC после завершения прокрутки
                                    requestAnimationFrame(() => {
                                        setTimeout(() => {
                                            if (window.updateActiveHeading) {
                                                console.log('[Left Menu Current] Calling updateActiveHeading after scroll (expanded, hash)');
                                                window.updateActiveHeading();
                                            }
                                        }, 200);
                                    });
                                }
                                
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    console.log('[Left Menu Current] Removing current from all items (expanded, hash)');
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                console.log('[Left Menu Current] Adding current to item (expanded, hash):', linkText);
                                item.classList.add('current');
                                
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    console.log('[Left Menu Current] Set userClicked to true (expanded, hash)');
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                            console.log('[Left Menu Current] Set userClicked to false (expanded, hash)');
                                            // Обновляем правый TOC после сброса флага
                                            if (window.updateActiveHeading) {
                                                console.log('[Left Menu Current] Calling updateActiveHeading after userClicked reset (expanded, hash)');
                                                requestAnimationFrame(() => {
                                                    window.updateActiveHeading();
                                                });
                                            }
                                        }
                                    }, 400);
                                }
                            } else if (href && !href.startsWith('#')) {
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    console.log('[Left Menu Current] Removing current from all items (expanded, non-hash)');
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                console.log('[Left Menu Current] Adding current to item (expanded, non-hash):', linkText);
                                item.classList.add('current');
                                
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    console.log('[Left Menu Current] Set userClicked to true (expanded, non-hash)');
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                            console.log('[Left Menu Current] Set userClicked to false (expanded, non-hash)');
                                        }
                                    }, 2000);
                                }
                            }
                        }
                    }, false);
                    
                    if (item.classList.contains('current')) {
                        item.classList.add('expanded');
                    }
                } else {
                    finalLink.addEventListener('click', function(e) {
                        const href = finalLink.getAttribute('href');
                        const linkText = finalLink.textContent.trim().substring(0, 50);
                        console.log('[Left Menu Current] Link clicked (no submenu):', linkText, 'href:', href);
                        
                        if (href && href.startsWith('#')) {
                            e.preventDefault();
                            const targetElement = document.querySelector(href);
                            if (targetElement) {
                                // Прокрутка к элементу - элемент должен быть на 80px от верха экрана
                                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                                const offsetPosition = elementPosition - 80;
                                
                                window.scrollTo({
                                    top: Math.max(0, offsetPosition),
                                    behavior: 'smooth'
                                });
                                
                                // Обновляем правый TOC после завершения прокрутки
                                setTimeout(() => {
                                    if (window.updateActiveHeading) {
                                        console.log('[Left Menu Current] Calling updateActiveHeading after scroll (no submenu)');
                                        requestAnimationFrame(() => {
                                            setTimeout(() => {
                                                window.updateActiveHeading();
                                            }, 200);
                                        });
                                    }
                                }, 200);
                            } else {
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }
                        } else if (href && href.includes('#')) {
                            const [pagePath, anchor] = href.split('#');
                            if (anchor) {
                                sessionStorage.setItem('scrollToAnchor', '#' + anchor);
                            }
                        }
                        
                        const leftNav = document.getElementById('leftNav');
                        if (leftNav) {
                            console.log('[Left Menu Current] Removing current from all items before adding to:', linkText);
                            leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                menuItem.classList.remove('current');
                            });
                            console.log('[Left Menu Current] Adding current to item:', linkText);
                            item.classList.add('current');
                            
                            if (leftNav) {
                                leftNav.dataset.userClicked = 'true';
                                console.log('[Left Menu Current] Set userClicked to true for:', linkText);
                                setTimeout(() => {
                                    if (leftNav) {
                                        leftNav.dataset.userClicked = 'false';
                                        console.log('[Left Menu Current] Set userClicked to false for:', linkText);
                                        // Обновляем правый TOC после сброса флага
                                        if (window.updateActiveHeading) {
                                            console.log('[Left Menu Current] Calling updateActiveHeading after userClicked reset (no submenu)');
                                            requestAnimationFrame(() => {
                                                window.updateActiveHeading();
                                            });
                                        }
                                    }
                                }, 400);
                            }
                        }
                    });
                }
            });
        }
        
        processMenuItems(leftNav);
        
        function removeCurrentFromParents() {
            console.log('[Left Menu Current] removeCurrentFromParents called');
            const leftNav = document.getElementById('leftNav');
            if (!leftNav) {
                console.log('[Left Menu Current] leftNav not found');
                return;
            }
            
            const currentItems = leftNav.querySelectorAll('[class*="toctree-l"].current');
            console.log('[Left Menu Current] Found current items:', currentItems.length);
            
            currentItems.forEach((currentItem, index) => {
                const link = currentItem.querySelector('a');
                const linkText = link ? link.textContent.trim().substring(0, 50) : 'no link';
                console.log('[Left Menu Current] Processing current item #' + index + ':', linkText);
                
                const classList = Array.from(currentItem.classList);
                const levelClass = classList.find(cls => cls.startsWith('toctree-l'));
                if (!levelClass) {
                    console.log('[Left Menu Current] No level class found for item #' + index);
                    return;
                }
                
                const currentLevel = parseInt(levelClass.replace('toctree-l', ''));
                console.log('[Left Menu Current] Item #' + index + ' level:', currentLevel);
                
                if (currentLevel > 1) {
                    let parent = currentItem.parentElement;
                    let parentDepth = 0;
                    while (parent && parent !== leftNav && parentDepth < 10) {
                        const parentItem = parent.closest('[class*="toctree-l"]');
                        if (parentItem && parentItem !== currentItem) {
                            const parentLink = parentItem.querySelector('a');
                            const parentLinkText = parentLink ? parentLink.textContent.trim().substring(0, 50) : 'no link';
                            
                            // Проверяем, есть ли у родителя ЛЮБОЙ потомок с классом current
                            // (включая текущий элемент и любые другие текущие элементы)
                            const allCurrentItems = leftNav.querySelectorAll('[class*="toctree-l"].current');
                            let hasCurrentDescendant = false;
                            
                            for (let i = 0; i < allCurrentItems.length; i++) {
                                const currentDescendant = allCurrentItems[i];
                                // Проверяем, является ли этот current элемент потомком parentItem
                                if (parentItem.contains(currentDescendant) && currentDescendant !== parentItem) {
                                    hasCurrentDescendant = true;
                                    break;
                                }
                            }
                            
                            if (!hasCurrentDescendant) {
                                console.log('[Left Menu Current] Removing current from parent:', parentLinkText);
                                parentItem.classList.remove('current');
                            } else {
                                console.log('[Left Menu Current] Keeping current on parent (has current descendant):', parentLinkText);
                            }
                            if (!parentItem.classList.contains('expanded')) {
                                parentItem.classList.add('expanded');
                            }
                        }
                        parent = parent.parentElement;
                        parentDepth++;
                    }
                } else {
                    console.log('[Left Menu Current] Item #' + index + ' is level 1, no parent to process');
                }
            });
        }
        
        setTimeout(function() {
            console.log('[Left Menu Current] Calling removeCurrentFromParents (100ms)');
            removeCurrentFromParents();
        }, 100);
        setTimeout(function() {
            console.log('[Left Menu Current] Calling removeCurrentFromParents (500ms)');
            removeCurrentFromParents();
        }, 500);
        setTimeout(function() {
            console.log('[Left Menu Current] Calling removeCurrentFromParents (1000ms)');
            removeCurrentFromParents();
        }, 1000);
        
        function updateCurrentFromScroll() {
            const leftNav = document.getElementById('leftNav');
            if (!leftNav) return;
            
            if (leftNav.dataset.userClicked === 'true') {
                return;
            }
            
            const headings = document.querySelectorAll('.document h1[id], .document h2[id], .document h3[id], .document h4[id], .rst-content h1[id], .rst-content h2[id], .rst-content h3[id], .rst-content h4[id]');
            
            if (headings.length === 0) return;
            
            const headerHeight = document.querySelector('.custom-header')?.offsetHeight || 64;
            const scrollPosition = window.pageYOffset + headerHeight + 100;
            
            let activeHeading = null;
            let activeHeadingTop = 0;
            
            headings.forEach(heading => {
                const headingTop = heading.offsetTop;
                const headingHeight = heading.offsetHeight;
                
                if (scrollPosition >= headingTop && scrollPosition < headingTop + headingHeight) {
                    if (headingTop >= activeHeadingTop) {
                        activeHeading = heading;
                        activeHeadingTop = headingTop;
                    }
                }
            });
            
            if (!activeHeading) {
                headings.forEach(heading => {
                    const headingTop = heading.offsetTop;
                    if (headingTop <= scrollPosition && headingTop >= activeHeadingTop) {
                        activeHeading = heading;
                        activeHeadingTop = headingTop;
                    }
                });
            }
            
            if (activeHeading) {
                const headingId = activeHeading.id;
                const headingText = activeHeading.textContent.trim();
                const headingTextShort = headingText.substring(0, 50);
                console.log('[Left Menu Current] updateCurrentFromScroll: active heading found:', headingTextShort, 'id:', headingId);
                
                if (headingId || headingText) {
                    console.log('[Left Menu Current] updateCurrentFromScroll: removing current from all items');
                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                        menuItem.classList.remove('current');
                    });
                    
                    let menuLink = null;
                    let foundBy = '';
                    
                    // ПРИОРИТЕТ 1: По ID заголовка
                    if (headingId) {
                        menuLink = leftNav.querySelector(`a[href="#${headingId}"], a[href*="#${headingId}"]`);
                        if (menuLink) {
                            foundBy = 'heading ID';
                        }
                    }
                    
                    // ПРИОРИТЕТ 2: По тексту заголовка (если не нашли по ID)
                    if (!menuLink && headingText) {
                        const allMenuLinks = leftNav.querySelectorAll('a[href^="#"]');
                        for (let link of allMenuLinks) {
                            const linkText = link.textContent.trim();
                            // Сравниваем тексты (убираем лишние пробелы и приводим к нижнему регистру для сравнения)
                            const normalizedHeadingText = headingText.toLowerCase().replace(/\s+/g, ' ').trim();
                            const normalizedLinkText = linkText.toLowerCase().replace(/\s+/g, ' ').trim();
                            
                            if (normalizedHeadingText === normalizedLinkText || 
                                normalizedHeadingText.includes(normalizedLinkText) ||
                                normalizedLinkText.includes(normalizedHeadingText)) {
                                menuLink = link;
                                foundBy = 'heading text';
                                break;
                            }
                        }
                    }
                    
                    if (menuLink) {
                        const menuItem = menuLink.closest('[class*="toctree-l"]');
                        const linkText = menuLink.textContent.trim().substring(0, 50);
                        console.log('[Left Menu Current] updateCurrentFromScroll: found menu link by', foundBy + ':', linkText);
                        if (menuItem) {
                            console.log('[Left Menu Current] updateCurrentFromScroll: adding current to menu item:', linkText);
                            menuItem.classList.add('current');
                            let parent = menuItem.parentElement;
                            while (parent && parent !== leftNav) {
                                const parentItem = parent.closest('[class*="toctree-l"]');
                                if (parentItem) {
                                    parentItem.classList.add('expanded');
                                }
                                parent = parent.parentElement;
                            }
                        } else {
                            console.log('[Left Menu Current] updateCurrentFromScroll: menu item not found for link');
                        }
                    } else {
                        console.log('[Left Menu Current] updateCurrentFromScroll: menu link not found for heading id:', headingId, 'text:', headingTextShort);
                    }
                } else {
                    console.log('[Left Menu Current] updateCurrentFromScroll: heading has no id or text');
                }
            } else {
                console.log('[Left Menu Current] updateCurrentFromScroll: no active heading found');
            }
            
            console.log('[Left Menu Current] updateCurrentFromScroll: calling removeCurrentFromParents');
            removeCurrentFromParents();
        }
        
        let scrollTimeout = null;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(function() {
                console.log('[Left Menu Current] Scroll event triggered updateCurrentFromScroll');
                updateCurrentFromScroll();
            }, 100);
        });
        
        setTimeout(function() {
            console.log('[Left Menu Current] Initial updateCurrentFromScroll call (500ms)');
            updateCurrentFromScroll();
        }, 500);
    }
    
    function initFloatingToc() {
        // Не инициализируем для главной страницы - там своя логика в homepage.js
        if (document.body && document.body.classList.contains('homepage')) {
            return;
        }
        
        const floatingTocPage = document.getElementById('floatingTocPage');
        
        if (floatingTocPage) {
            let userClickedLink = null;
            let clickTimeout = null;
            
            if (floatingTocPage._tocClickHandler) {
                floatingTocPage.removeEventListener('click', floatingTocPage._tocClickHandler, true);
                floatingTocPage.removeEventListener('click', floatingTocPage._tocClickHandler, false);
            }
            
            floatingTocPage._tocClickHandler = function(e) {
                const clickedLink = e.target.closest('a');
                if (!clickedLink || !floatingTocPage.contains(clickedLink)) {
                    return;
                }
                
                const targetHref = clickedLink.getAttribute('href');
                
                if (window._rightMenuLinkClickFlag) {
                    window._rightMenuLinkClickFlag();
                }
                
                if (window._setPreventMenuClose) {
                    window._setPreventMenuClose(true);
                }
                
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const isAnchorLink = targetHref && (targetHref.startsWith('#') || targetHref.includes('#'));
                
                if (isAnchorLink) {
                    e.preventDefault();
                    
                    userClickedLink = clickedLink;
                    
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                    }
                    
                    const allTocLinks = Array.from(floatingTocPage.querySelectorAll('a'));
                    allTocLinks.forEach(l => l.classList.remove('active'));
                    
                    clickedLink.classList.add('active');
                    
                    clickedLink.dataset.userSelected = 'true';
                    clickedLink.dataset.selectionTime = Date.now().toString();
                    
                    allTocLinks.forEach(l => {
                        if (l !== clickedLink) {
                            l.dataset.userSelected = 'false';
                        }
                    });
                    
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                    }
                    clickTimeout = setTimeout(() => {
                        userClickedLink = null;
                        if (clickedLink) {
                            clickedLink.dataset.userSelected = 'false';
                        }
                    }, 3000);
                    
                    let targetId = null;
                    
                    if (!targetHref || targetHref === '#' || targetHref.trim() === '#' || targetHref.trim() === '') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        if (clickTimeout) {
                            clearTimeout(clickTimeout);
                        }
                        if (clickedLink) {
                            clickedLink.dataset.userSelected = 'false';
                        }
                        clickTimeout = setTimeout(() => {
                            userClickedLink = null;
                        }, 3000);
                        return;
                    }
                    
                    if (targetHref && targetHref.startsWith('#')) {
                        targetId = targetHref;
                    } else if (targetHref && targetHref.includes('#')) {
                        targetId = '#' + targetHref.split('#')[1];
                    }
                    
                    if (targetId) {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            const header = document.querySelector('.custom-header');
                            const headerHeight = header ? header.offsetHeight : 64;
                            const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const scrollPosition = elementTop - headerHeight - 10;
                            
                            window.scrollTo({
                                top: Math.max(0, scrollPosition),
                                behavior: 'smooth'
                            });
                            
                            if (clickTimeout) {
                                clearTimeout(clickTimeout);
                            }
                            clickTimeout = setTimeout(() => {
                                userClickedLink = null;
                                if (clickedLink) {
                                    clickedLink.dataset.userSelected = 'false';
                                }
                                if (window._setPreventMenuClose) {
                                    window._setPreventMenuClose(false);
                                }
                            }, 3000);
                        } else {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                            if (clickTimeout) {
                                clearTimeout(clickTimeout);
                            }
                            if (clickedLink) {
                                clickedLink.dataset.userSelected = 'false';
                            }
                            clickTimeout = setTimeout(() => {
                                userClickedLink = null;
                            }, 3000);
                        }
                    } else {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        if (clickTimeout) {
                            clearTimeout(clickTimeout);
                        }
                        if (clickedLink) {
                            clickedLink.dataset.userSelected = 'false';
                        }
                        clickTimeout = setTimeout(() => {
                            userClickedLink = null;
                        }, 3000);
                    }
                }
            };
            
            floatingTocPage.addEventListener('click', floatingTocPage._tocClickHandler, true);
            
            floatingTocPage.addEventListener('mousedown', function(e) {
                const clickedLink = e.target.closest('a');
                if (clickedLink && floatingTocPage.contains(clickedLink)) {
                    if (window._setPreventMenuClose) {
                        window._setPreventMenuClose(true);
                    }
                }
            }, true);

            const tocLinks = Array.from(floatingTocPage.querySelectorAll('a'));

            let headings = document.querySelectorAll('.document h1[id], .document h2[id], .document h3[id], .document h4[id], .document h5[id], .document h6[id], .rst-content h1[id], .rst-content h2[id], .rst-content h3[id], .rst-content h4[id], .rst-content h5[id], .rst-content h6[id]');
            
            if (headings.length === 0) {
                headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
            }
            
            if (headings.length === 0) {
                headings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6, .rst-content h1, .rst-content h2, .rst-content h3, .rst-content h4, .rst-content h5, .rst-content h6');
                headings = Array.from(headings).filter(h => h.id);
            }
            
            if (headings.length === 0) {
                const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headings = Array.from(allHeadings).filter(h => h.id);
            }
            
            // Функция для нормализации текста (удаление спецсимволов, нормализация пробелов)
            function normalizeText(text) {
                if (!text) return '';
                return text
                    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Удаляем невидимые символы
                    .replace(/[\u00AD]/g, '') // Удаляем мягкие переносы
                    .replace(/[\u2028\u2029]/g, ' ') // Заменяем разделители строк на пробелы
                    .replace(/\s+/g, ' ') // Нормализуем множественные пробелы
                    .trim();
            }
            
            function updateActiveHeading() {
                if (userClickedLink) {
                    return;
                }
                
                const leftNav = document.getElementById('leftNav');
                if (leftNav && leftNav.dataset.userClicked === 'true') {
                    requestAnimationFrame(() => {
                        setTimeout(function() {
                            if (leftNav && leftNav.dataset.userClicked === 'false') {
                                updateActiveHeading();
                            } else if (leftNav && leftNav.dataset.userClicked === 'true') {
                                requestAnimationFrame(() => {
                                    setTimeout(function() {
                                        if (leftNav && leftNav.dataset.userClicked === 'false') {
                                            updateActiveHeading();
                                        }
                                    }, 200);
                                });
                            }
                        }, 200);
                    });
                    return;
                }
                
                const activeLink = floatingTocPage.querySelector('a.active');
                if (activeLink && activeLink.dataset.userSelected === 'true') {
                    const selectionTime = parseInt(activeLink.dataset.selectionTime || '0');
                    const currentTime = Date.now();
                    if (currentTime - selectionTime < 3000) {
                        return;
                    } else {
                        activeLink.dataset.userSelected = 'false';
                    }
                }
                
                if (tocLinks.length === 0) {
                    return;
                }
                
                const headerHeight = document.querySelector('.custom-header')?.offsetHeight || 64;
                const scrollPosition = window.pageYOffset || window.scrollY;
                const viewportTop = scrollPosition + headerHeight + 100;
                const viewportTopRect = headerHeight + 100;
                
                let activeHeading = null;
                let activeHeadingTop = -Infinity;
                let activeHeadingDistance = Infinity;
                
                const allHeadings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6, .rst-content h1, .rst-content h2, .rst-content h3, .rst-content h4, .rst-content h5, .rst-content h6');
                const currentHeadings = Array.from(allHeadings).filter(h => {
                    return !h.closest('.custom-footer') && !h.closest('footer') && h.offsetParent !== null;
                });
                
                // Если скролл в самом верху, всегда используем первый заголовок
                if (scrollPosition < 200 && currentHeadings.length > 0) {
                    activeHeading = currentHeadings[0];
                    const rect = activeHeading.getBoundingClientRect();
                    activeHeadingTop = rect.top + scrollPosition;
                } else {
                    // Используем getBoundingClientRect для более точного определения позиции
                    currentHeadings.forEach((heading, index) => {
                        const rect = heading.getBoundingClientRect();
                        const headingTop = rect.top + scrollPosition;
                        const headingTopViewport = rect.top;
                        const headingBottomViewport = rect.bottom;
                        const headingId = heading.id || heading.getAttribute('id') || '';
                        const headingText = heading.textContent.trim();
                        
                        // Проверяем, находится ли заголовок в области видимости (с учетом отступа для header)
                        if (headingTopViewport <= viewportTopRect && headingBottomViewport >= headerHeight) {
                            // Заголовок виден в viewport
                            const distance = Math.abs(headingTopViewport - viewportTopRect);
                            if (distance < activeHeadingDistance) {
                                activeHeading = heading;
                                activeHeadingTop = headingTop;
                                activeHeadingDistance = distance;
                            }
                        } else if (headingTop <= viewportTop && headingTop > activeHeadingTop) {
                            // Заголовок находится выше viewport, но ближе к нужной позиции
                            activeHeading = heading;
                            activeHeadingTop = headingTop;
                            activeHeadingDistance = viewportTop - headingTop;
                        }
                    });
                    
                    // Если не нашли заголовок в viewport, ищем ближайший заголовок выше
                    if (!activeHeading) {
                        currentHeadings.forEach(heading => {
                            const rect = heading.getBoundingClientRect();
                            const headingTop = rect.top + scrollPosition;
                            const headingTopViewport = rect.top;
                            
                            if (headingTop <= viewportTop && headingTop > activeHeadingTop) {
                                const distance = viewportTop - headingTop;
                                if (distance < activeHeadingDistance) {
                                    activeHeading = heading;
                                    activeHeadingTop = headingTop;
                                    activeHeadingDistance = distance;
                                }
                            }
                        });
                    }
                    
                    // Если все еще не нашли, используем первый заголовок
                    if (!activeHeading && scrollPosition < 250 && currentHeadings.length > 0) {
                        activeHeading = currentHeadings[0];
                        const rect = activeHeading.getBoundingClientRect();
                        activeHeadingTop = rect.top + scrollPosition;
                    }
                }
                
                if (activeHeading) {
                    let headingId = activeHeading.getAttribute('id') || activeHeading.id;
                    
                    if (!headingId) {
                        const idElement = activeHeading.querySelector('[id]');
                        if (idElement) {
                            headingId = idElement.getAttribute('id') || idElement.id;
                        }
                    }
                    
                    if (!headingId) {
                        const parentWithId = activeHeading.closest('[id]');
                        if (parentWithId && parentWithId !== activeHeading) {
                            headingId = parentWithId.getAttribute('id') || parentWithId.id;
                        }
                    }
                    
                    const headingText = activeHeading.textContent.trim();
                    const headingIndex = currentHeadings.indexOf(activeHeading);
                    
                    tocLinks.forEach(l => l.classList.remove('active'));
                    
                    let foundLink = false;
                    let matchedLinkIndex = -1;
                    
                    // Специальная логика: если скролл вверху и активный заголовок - первый, активируем первую ссылку
                    if (scrollPosition < 200 && headingIndex === 0 && tocLinks.length > 0) {
                        const firstLink = tocLinks[0];
                        if (firstLink) {
                            firstLink.classList.add('active');
                            foundLink = true;
                            matchedLinkIndex = 0;
                            console.log('[Right TOC] ✓ First link (top scroll):', firstLink.textContent.trim().substring(0, 40));
                        }
                    }
                    
                    const currentHash = window.location.hash ? window.location.hash.substring(1) : null;
                    
                    console.log('[Right TOC] Active:', {
                        heading: headingText.substring(0, 50),
                        id: headingId || '(no id)',
                        scroll: Math.round(scrollPosition),
                        linksCount: tocLinks.length
                    });
                    
                    // ПРИОРИТЕТ 1: По ID заголовка
                    if (headingId) {
                        tocLinks.forEach((link, linkIndex) => {
                            if (foundLink) return;
                            
                            const linkHref = link.getAttribute('href') || '';
                            if (linkHref === null || linkHref === undefined) return;
                            
                            let anchorId = null;
                            if (linkHref.startsWith('#')) {
                                anchorId = linkHref.substring(1).trim();
                            } else if (linkHref.includes('#')) {
                                anchorId = linkHref.split('#').pop().trim();
                            }
                            
                            let matches = (anchorId === headingId || linkHref === '#' + headingId || linkHref === headingId);
                            
                            // Если не совпало, проверяем наличие якоря - но ТОЛЬКО если якорь является самим заголовком или находится непосредственно в нем
                            // УБИРАЕМ проверку targetElement.contains(activeHeading), так как она слишком широкая и дает ложные совпадения
                            if (!matches && anchorId) {
                                const targetElement = document.getElementById(anchorId);
                                if (targetElement) {
                                    // Якорь должен быть самим заголовком или находиться непосредственно в заголовке
                                    const isSame = targetElement === activeHeading;
                                    const isInHeading = activeHeading.contains(targetElement);
                                    
                                    if (isSame || isInHeading) {
                                        matches = true;
                                        console.log('[Right TOC] ID match details:', {
                                            headingId: headingId,
                                            anchorId: anchorId,
                                            linkIndex: linkIndex,
                                            isSame: isSame,
                                            isInHeading: isInHeading
                                        });
                                    }
                                }
                            }
                            
                            if (matches) {
                                link.classList.add('active');
                                foundLink = true;
                                matchedLinkIndex = linkIndex;
                                console.log('[Right TOC] ✓ Matched by ID:', linkIndex, link.textContent.trim().substring(0, 40));
                            }
                        });
                    }
                    
                    // ПРИОРИТЕТ 2: По тексту заголовка
                    if (!foundLink && headingText) {
                        const normalizedHeadingText = normalizeText(headingText);
                        
                        tocLinks.forEach((link, linkIndex) => {
                            if (foundLink) return;
                            
                            const linkHref = link.getAttribute('href') || '';
                            const linkText = link.textContent.trim();
                            const normalizedLinkText = normalizeText(linkText);
                            
                            const textMatch = normalizedLinkText === normalizedHeadingText;
                            const textMatchCaseInsensitive = normalizedLinkText.toLowerCase() === normalizedHeadingText.toLowerCase();
                            const textContains = normalizedLinkText.includes(normalizedHeadingText) || normalizedHeadingText.includes(normalizedLinkText);
                            
                            const minLength = Math.min(normalizedLinkText.length, normalizedHeadingText.length);
                            const compareLength = Math.min(50, minLength);
                            const textStartsWith = compareLength >= 20 && (
                                normalizedLinkText.substring(0, compareLength) === normalizedHeadingText.substring(0, compareLength) ||
                                normalizedLinkText.toLowerCase().substring(0, compareLength) === normalizedHeadingText.toLowerCase().substring(0, compareLength)
                            );
                            
                            const headingStartsWithLink = normalizedLinkText.length > 10 && normalizedHeadingText.toLowerCase().startsWith(normalizedLinkText.toLowerCase());
                            const linkStartsWithHeading = normalizedHeadingText.length > 10 && normalizedLinkText.toLowerCase().startsWith(normalizedHeadingText.toLowerCase());
                            
                            const significantTextMatch = minLength >= 15 && (
                                normalizedLinkText.substring(0, Math.min(40, normalizedLinkText.length)) === normalizedHeadingText.substring(0, Math.min(40, normalizedHeadingText.length)) ||
                                normalizedLinkText.toLowerCase().substring(0, Math.min(40, normalizedLinkText.length)) === normalizedHeadingText.toLowerCase().substring(0, Math.min(40, normalizedHeadingText.length))
                            );
                            
                            // Специальная проверка для первой ссылки при скролле вверху
                            const isFirstHeadingLink = (linkHref === '#' || !linkHref || linkHref.trim() === '') && headingIndex === 0 && linkIndex === 0;
                            
                            const isEmptyHrefMatch = (linkHref === '#' || !linkHref || linkHref.trim() === '') && (
                                normalizedLinkText === normalizedHeadingText || 
                                normalizedLinkText.includes(normalizedHeadingText) || 
                                normalizedHeadingText.includes(normalizedLinkText) ||
                                normalizedLinkText.toLowerCase() === normalizedHeadingText.toLowerCase()
                            );
                            
                            let anchorNearHeading = false;
                            if (linkHref && linkHref.startsWith('#')) {
                                const anchorId = linkHref.substring(1).trim();
                                if (anchorId) {
                                    const anchorElement = document.getElementById(anchorId);
                                    if (anchorElement) {
                                        if (anchorElement === activeHeading || activeHeading.contains(anchorElement)) {
                                            anchorNearHeading = true;
                                        } else {
                                            const headingRect = activeHeading.getBoundingClientRect();
                                            const anchorRect = anchorElement.getBoundingClientRect();
                                            const distance = Math.abs(headingRect.top - anchorRect.top);
                                            if (distance < 30 && Math.abs(headingRect.left - anchorRect.left) < 50) {
                                                anchorNearHeading = true;
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if (textMatch || textMatchCaseInsensitive || textContains || textStartsWith || headingStartsWithLink || linkStartsWithHeading || significantTextMatch || anchorNearHeading || isFirstHeadingLink || isEmptyHrefMatch) {
                                link.classList.add('active');
                                foundLink = true;
                                matchedLinkIndex = linkIndex;
                                console.log('[Right TOC] ✓ Matched by text:', linkIndex, linkText.substring(0, 40));
                            }
                        });
                    }
                    
                    // ПРИОРИТЕТ 3: По позиции заголовка в списке
                    if (!foundLink && activeHeading) {
                        const headingIndex = currentHeadings.indexOf(activeHeading);
                        
                        if (headingIndex >= 0 && headingIndex < tocLinks.length) {
                            const linkByIndex = tocLinks[headingIndex];
                            if (linkByIndex) {
                                const linkHref = linkByIndex.getAttribute('href') || '';
                                if (linkHref && linkHref !== '#') {
                                    linkByIndex.classList.add('active');
                                    foundLink = true;
                                    matchedLinkIndex = headingIndex;
                                    console.log('[Right TOC] ✓ Matched by position:', headingIndex);
                                }
                            }
                        }
                        
                        if (!foundLink && headingIndex >= 0) {
                            let closestLinkIndex = -1;
                            let minDistance = Infinity;
                            
                            tocLinks.forEach((link, linkIndex) => {
                                const linkHref = link.getAttribute('href') || '';
                                if (linkHref === null || linkHref === undefined) return;
                                
                                const distance = Math.abs(headingIndex - linkIndex);
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    closestLinkIndex = linkIndex;
                                }
                            });
                            
                            if (closestLinkIndex >= 0 && minDistance <= 5) {
                                const closestLink = tocLinks[closestLinkIndex];
                                const closestLinkHref = closestLink.getAttribute('href') || '';
                                if (closestLinkHref && closestLinkHref !== '#') {
                                    closestLink.classList.add('active');
                                    foundLink = true;
                                    matchedLinkIndex = closestLinkIndex;
                                    console.log('[Right TOC] ✓ Matched by closest position:', closestLinkIndex, 'dist:', minDistance);
                                }
                            }
                        }
                    }
                    
                    // ПРИОРИТЕТ 4: По хэшу в URL (fallback)
                    if (!foundLink && currentHash) {
                        tocLinks.forEach((link, linkIndex) => {
                            if (foundLink) return;
                            
                            const linkHref = link.getAttribute('href') || '';
                            if (!linkHref) return;
                            
                            let anchorId = null;
                            if (linkHref.startsWith('#')) {
                                anchorId = linkHref.substring(1).trim();
                            } else if (linkHref.includes('#')) {
                                anchorId = linkHref.split('#').pop().trim();
                            }
                            
                            if (anchorId && anchorId === currentHash) {
                                link.classList.add('active');
                                foundLink = true;
                                matchedLinkIndex = linkIndex;
                                console.log('[Right TOC] ✓ Matched by hash (fallback):', linkIndex);
                            }
                        });
                    }
                    
                    if (!foundLink) {
                        console.log('[Right TOC] ✗ No match found');
                    }
                } else {
                    // Если нет активного заголовка, но скролл вверху - активируем первую ссылку
                    if (scrollPosition < 200 && tocLinks.length > 0) {
                        tocLinks.forEach(l => l.classList.remove('active'));
                        const firstLink = tocLinks[0];
                        if (firstLink) {
                            firstLink.classList.add('active');
                            console.log('[Right TOC] ✓ Activated first link (top of page)');
                        }
                    }
                    
                    const currentHash = window.location.hash ? window.location.hash.substring(1) : null;
                    if (currentHash) {
                        let foundByHash = false;
                        tocLinks.forEach((link, linkIndex) => {
                            if (foundByHash) return;
                            
                            const linkHref = link.getAttribute('href');
                            if (!linkHref) return;
                            
                            let anchorId = null;
                            if (linkHref.startsWith('#')) {
                                anchorId = linkHref.substring(1).trim();
                            } else if (linkHref.includes('#')) {
                                anchorId = linkHref.split('#').pop().trim();
                            }
                            
                            if (anchorId && anchorId === currentHash) {
                                link.classList.add('active');
                                foundByHash = true;
                                console.log('[Right TOC] ✓ Link found by hash (no heading):', {
                                    index: linkIndex,
                                    text: link.textContent.trim().substring(0, 60),
                                    href: linkHref
                                });
                            }
                        });
                        
                        if (!foundByHash) {
                            console.log('[Right TOC] ✗ No link found by hash either');
                        }
                    }
                }
                
            }
            
            let ticking = false;
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        updateActiveHeading();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            
            // Делаем функцию доступной глобально для вызова из других мест
            window.updateActiveHeading = updateActiveHeading;
            
            // Обновляем при загрузке страницы
            setTimeout(() => {
                updateActiveHeading();
            }, 100);
            
            setTimeout(() => {
                updateActiveHeading();
            }, 500);
            setTimeout(() => {
                updateActiveHeading();
            }, 1000);
            
            // Обновляем при изменении хэша
            window.addEventListener('hashchange', function() {
                setTimeout(function() {
                    updateActiveHeading();
                }, 300);
            });
        }
    }

    // Адаптивность: скрытие плавающего меню на планшете
    
    function handleResize() {
        // Не применяем эту логику к главной странице - там своя логика в homepage.js
        if (document.body && document.body.classList.contains('homepage')) {
            return;
        }
        
        const width = window.innerWidth;
        const floatingTocPage = document.getElementById('floatingTocPage');
        
        if (width <= 1024) {
            if (floatingTocPage) {
                floatingTocPage.style.display = 'none';
            }
        } else {
            if (floatingTocPage) {
                floatingTocPage.style.display = 'flex';
            }
        }
    }
    
    // ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
    
    function init() {
        if (!document.body) {
            setTimeout(init, 50);
            return;
        }
        
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        // Добавляем элементы сразу
        addCustomHeader();
        
        // Левое меню добавляем с небольшой задержкой, чтобы дождаться загрузки .wy-menu
        setTimeout(function() {
            addLeftNav();
            
            setTimeout(function() {
                initNavigation();
                initCollapsibleMenu();
                initFloatingToc();
                handleResize();
                
                const scrollToAnchor = sessionStorage.getItem('scrollToAnchor');
                if (scrollToAnchor) {
                    sessionStorage.removeItem('scrollToAnchor');
                    setTimeout(function() {
                        const targetElement = document.querySelector(scrollToAnchor);
                        if (targetElement) {
                            // Прокрутка к элементу - элемент должен быть на 80px от верха экрана
                            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - 80;
                            
                            window.scrollTo({
                                top: Math.max(0, offsetPosition),
                                behavior: 'smooth'
                            });
                        }
                    }, 500);
                }

                if (window.location.hash) {
                    setTimeout(function() {
                        const targetElement = document.querySelector(window.location.hash);
                        if (targetElement) {
                            // Прокрутка к элементу - элемент должен быть на 80px от верха экрана
                            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - 80;
                            
                            window.scrollTo({
                                top: Math.max(0, offsetPosition),
                                behavior: 'smooth'
                            });
                        }
                    }, 500);
                }
                
    // Равномерное распределение столбцов в таблицах
    function equalizeTableColumns() {
        const tables = document.querySelectorAll('.document table');
        tables.forEach(table => {
            if (table.dataset.columnsEqualized) return;
            
            const firstRow = table.querySelector('thead tr') || 
                           table.querySelector('tbody tr') || 
                           table.querySelector('tr');
            
            if (!firstRow) return;
            
            const cells = firstRow.querySelectorAll('th, td');
            const columnCount = cells.length;
            
            if (columnCount === 0) return;
            
            const columnWidth = (100 / columnCount).toFixed(4) + '%';
            
            const allCells = table.querySelectorAll('th, td');
            allCells.forEach(cell => {
                cell.style.width = columnWidth;
                cell.style.minWidth = '0';
                cell.style.maxWidth = columnWidth;
                cell.style.boxSizing = 'border-box';
            });
            
            let colgroup = table.querySelector('colgroup');
            if (!colgroup) {
                colgroup = document.createElement('colgroup');
                for (let i = 0; i < columnCount; i++) {
                    const col = document.createElement('col');
                    col.style.width = columnWidth;
                    colgroup.appendChild(col);
                }
                table.insertBefore(colgroup, table.firstChild);
            } else {
                const cols = colgroup.querySelectorAll('col');
                cols.forEach(col => {
                    col.style.width = columnWidth;
                });
            }
            
            // Помечаем таблицу как обработанную
            table.dataset.columnsEqualized = 'true';
        });
    }
    
    function initTableColumns() {
        equalizeTableColumns();
        setTimeout(equalizeTableColumns, 50);
        setTimeout(equalizeTableColumns, 200);
        setTimeout(equalizeTableColumns, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableColumns);
    } else {
        initTableColumns();
    }
    
    window.addEventListener('resize', function() {
        // Сбрасываем флаги при изменении размера
        document.querySelectorAll('.document table').forEach(table => {
            delete table.dataset.columnsEqualized;
        });
        equalizeTableColumns();
    });

    // ============================================
    // ============================================
    
    function wrapTablesForMobile() {
        const tables = document.querySelectorAll('.document table');
        tables.forEach(table => {
            if (table.parentElement.classList.contains('table-wrapper')) {
                return;
            }
            
            if (table.closest('.table-wrapper')) {
                return;
            }
            
            // Создаем обертку
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            
            table.parentNode.insertBefore(wrapper, table);
            
            // Перемещаем таблицу в обертку
            wrapper.appendChild(table);
        });
    }
    
    function initTableWrappers() {
        wrapTablesForMobile();
        setTimeout(wrapTablesForMobile, 50);
        setTimeout(wrapTablesForMobile, 200);
        setTimeout(wrapTablesForMobile, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableWrappers);
    } else {
        initTableWrappers();
    }
    
    window.addEventListener('resize', wrapTablesForMobile);

    // ============================================
    // Перемещение инпута поиска в левое меню на мобильных
    // ============================================
    
    function moveSearchToLeftMenu() {
        const headerSearchContainer = document.querySelector('.custom-header .search-container');
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
}, 100);
        }, 100);
    }
    
    // Запускаем инициализацию
    function startInit() {
        if (!document.body) {
            setTimeout(startInit, 50);
            return;
        }
        init();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInit);
    } else {
        startInit();
    }
    
    setTimeout(function() {
        if (!document.body) return;
        if (document.body.classList.contains('homepage')) return;
        
        if (!document.querySelector('.custom-header')) {
            addCustomHeader();
        }
        if (!document.getElementById('leftNav')) {
            addLeftNav();
            setTimeout(function() {
                initNavigation();
                initCollapsibleMenu();
            }, 100);
        } else {
            initCollapsibleMenu();
        }
    }, 500);
    
    window.addEventListener('resize', handleResize);

    // Бургер-меню для внутренних страниц
    function forceAddBurger() {
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        const headerRight = document.querySelector('.custom-header .header-right');
        if (!headerRight) {
            return;
        }
        
        let burgerToggle = document.getElementById('burgerToggle');
        
        if (!burgerToggle) {
            burgerToggle = document.createElement('button');
            burgerToggle.className = 'burger-menu-toggle';
            burgerToggle.id = 'burgerToggle';
            burgerToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            
            const btnLogin = headerRight.querySelector('.btn-login');
            if (btnLogin) {
                headerRight.insertBefore(burgerToggle, btnLogin.nextSibling);
            } else {
                headerRight.appendChild(burgerToggle);
            }
        }
        
        if (window.innerWidth <= 1280) {
            burgerToggle.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                flex-direction: column !important;
                gap: 5px !important;
                width: 32px !important;
                height: 32px !important;
                justify-content: center !important;
                align-items: center !important;
                background: none !important;
                border: none !important;
                cursor: pointer !important;
                padding: 0.5rem !important;
                z-index: 1001 !important;
                position: relative !important;
            `;
            
            const spans = burgerToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 24px !important;
                    height: 2px !important;
                    background: var(--text-dark) !important;
                `;
            });
        } else {
            burgerToggle.style.display = 'none';
        }
        
        return burgerToggle;
    }
    
    function initBurgerMenu() {
        // Проверяем, что это не главная страница
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        const burgerToggle = forceAddBurger();
        
        if (!burgerToggle) {
            return;
        }
        
        const floatingTocPage = document.getElementById('floatingTocPage');
        const logoLink = document.querySelector('.custom-header .logo-link');
        const leftNav = document.getElementById('leftNav');
        
        function updateBurgerVisibility() {
            if (burgerToggle) {
                if (window.innerWidth <= 1280) {
                    burgerToggle.style.cssText = `
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                        flex-direction: column !important;
                        gap: 5px !important;
                        width: 32px !important;
                        height: 32px !important;
                        justify-content: center !important;
                        align-items: center !important;
                        background: none !important;
                        border: none !important;
                        cursor: pointer !important;
                        padding: 0.5rem !important;
                        z-index: 1001 !important;
                        position: relative !important;
                    `;
                } else {
                    burgerToggle.style.display = 'none';
                }
            }
        }
        
        updateBurgerVisibility();
        
        window.addEventListener('resize', updateBurgerVisibility);

        function createOverlay() {
            let overlay = document.querySelector('.left-nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'left-nav-overlay';
                document.body.appendChild(overlay);
            }
            return overlay;
        }

        if (burgerToggle && floatingTocPage) {
            const overlay = createOverlay();
            
            let preventMenuClose = false;
            
            function initRightMenuHandlers() {
                initFloatingToc();
            }
            
            burgerToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const isActive = floatingTocPage.classList.contains('active');
                if (isActive) {
                    floatingTocPage.classList.remove('active');
                    overlay.classList.remove('active');
                    burgerToggle.classList.remove('active');
                    preventMenuClose = false;
                } else {
                    floatingTocPage.classList.add('active');
                    overlay.classList.add('active');
                    burgerToggle.classList.add('active');
                    preventMenuClose = false;
                    setTimeout(initRightMenuHandlers, 50);
                }
            });

            overlay.addEventListener('click', function(e) {
                const clickedLink = e.target.closest('a');
                const isClickOnLinkInMenu = clickedLink && floatingTocPage.contains(clickedLink);
                const isClickInsideMenu = floatingTocPage.contains(e.target);
                
                if (isClickInsideMenu || isClickOnLinkInMenu) {
                    e.stopPropagation();
                    return;
                }
                
                if (preventMenuClose) {
                    return;
                }
                
                floatingTocPage.classList.remove('active');
                overlay.classList.remove('active');
                burgerToggle.classList.remove('active');
            });

            document.addEventListener('click', function(e) {
                const clickedLink = e.target.closest('a');
                const isClickOnLinkInMenu = clickedLink && floatingTocPage.contains(clickedLink);
                
                if (isClickOnLinkInMenu) {
                    preventMenuClose = true;
                    setTimeout(function() {
                        preventMenuClose = false;
                    }, 500);
                    return;
                }
                
                if (preventMenuClose) {
                    return;
                }
                
                setTimeout(function() {
                    if (preventMenuClose) {
                        preventMenuClose = false;
                        return;
                    }
                    
                    if (floatingTocPage && floatingTocPage.classList.contains('active')) {
                        const isClickInsideMenu = floatingTocPage.contains(e.target);
                        const isClickOnBurger = burgerToggle.contains(e.target);
                        const isClickOnOverlay = e.target === overlay;
                        const clickedLink2 = e.target.closest('a');
                        const isClickOnLink = clickedLink2 && floatingTocPage.contains(clickedLink2);
                        const isClickOnLinkParent = e.target.closest('li') && floatingTocPage.contains(e.target.closest('li'));
                        
                        if (!isClickInsideMenu && !isClickOnBurger && !isClickOnOverlay && !isClickOnLink && !isClickOnLinkParent) {
                            floatingTocPage.classList.remove('active');
                            overlay.classList.remove('active');
                            burgerToggle.classList.remove('active');
                        }
                    }
                }, 100);
            }, true);
            
            window._setPreventMenuClose = function(value) {
                preventMenuClose = value;
            };
        }

        if (logoLink && leftNav) {
            logoLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (leftNav) {
                    const isActive = leftNav.classList.contains('active');
                    const isMobileOrTablet = window.innerWidth <= 1280;
                    
                    if (isActive) {
                        leftNav.classList.remove('active');
                        logoLink.classList.remove('active');
                        document.body.classList.remove('left-nav-open');
                        if (isMobileOrTablet) {
                            const overlay = document.querySelector('.left-nav-overlay');
                            if (overlay) {
                                overlay.classList.remove('active');
                            }
                        }
                    } else {
                        leftNav.classList.add('active');
                        logoLink.classList.add('active');
                        document.body.classList.add('left-nav-open');
                        if (isMobileOrTablet) {
                            const overlay = createOverlay();
                            overlay.addEventListener('click', function() {
                                leftNav.classList.remove('active');
                                logoLink.classList.remove('active');
                                document.body.classList.remove('left-nav-open');
                                overlay.classList.remove('active');
                            });
                            overlay.classList.add('active');
                        }
                    }
                }
            });
        }

        // Обеспечение видимости бургер-меню
        function ensureBurgerVisible() {
            forceAddBurger();
            if (window.innerWidth > 1280) {
                const burger = document.getElementById('burgerToggle');
                if (burger) {
                    burger.style.display = 'none';
                }
            }
        }
        
        ensureBurgerVisible();
        setTimeout(ensureBurgerVisible, 100);
        setTimeout(ensureBurgerVisible, 300);
        setTimeout(ensureBurgerVisible, 500);
        setTimeout(ensureBurgerVisible, 1000);
        window.addEventListener('resize', ensureBurgerVisible);
    }

    function initBurgerMenuWrapper() {
        // Проверяем, что это не главная страница
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        initBurgerMenu();
        
        setTimeout(function() {
            forceAddBurger();
        }, 100);
        
        setTimeout(function() {
            forceAddBurger();
        }, 300);
        
        setTimeout(function() {
            forceAddBurger();
        }, 500);
        
        setTimeout(function() {
            forceAddBurger();
        }, 1000);
        
        window.addEventListener('resize', function() {
            setTimeout(forceAddBurger, 50);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBurgerMenuWrapper);
    } else {
        initBurgerMenuWrapper();
    }
    
    setTimeout(initBurgerMenuWrapper, 500);
    setTimeout(initBurgerMenuWrapper, 1000);
    

    
    function forceDocumentStyles() {
        const documents = document.querySelectorAll('.document');
        documents.forEach(function(doc) {
            doc.style.maxWidth = '100%';
            doc.style.margin = '0';
            doc.style.marginLeft = '0';
            doc.style.marginRight = '0';
            doc.style.width = '100%';
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            forceDocumentStyles();
            setTimeout(forceDocumentStyles, 100);
            setTimeout(forceDocumentStyles, 500);
        });
    } else {
        forceDocumentStyles();
        setTimeout(forceDocumentStyles, 100);
        setTimeout(forceDocumentStyles, 500);
    }
    
    window.addEventListener('load', function() {
        forceDocumentStyles();
        setTimeout(forceDocumentStyles, 100);
    });
    
    let lastUrl = location.href;
    new MutationObserver(function() {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(forceDocumentStyles, 100);
            setTimeout(forceDocumentStyles, 500);
        }
    }).observe(document, { subtree: true, childList: true });
    
    // Делаем заголовки кликабельными
    function makeHeadingsClickable() {
        // Сначала ищем заголовки с id, потом без id
        let headings = document.querySelectorAll('.document h1[id], .document h2[id], .document h3[id], .document h4[id], .document h5[id], .document h6[id]');
        
        // Если нет заголовков с id, ищем все заголовки
        if (headings.length === 0) {
            headings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6');
        }
        
        headings.forEach(function(heading) {
            if (heading.dataset.clickableAdded) return;
            heading.dataset.clickableAdded = 'true';
            
            // Убеждаемся, что у заголовка есть id
            // Проверяем, есть ли валидный id (не пустая строка)
            let currentId = heading.getAttribute('id');
            if (!currentId || currentId.trim() === '') {
                // Если id пустой или отсутствует, генерируем новый
                const text = heading.textContent.trim();
                if (text) {
                    // Генерируем id из текста
                    let generatedId = text.toLowerCase()
                        .replace(/[^\w\s-]/g, '') // Удаляем спецсимволы
                        .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
                        .replace(/-+/g, '-') // Убираем множественные дефисы
                        .replace(/^-|-$/g, ''); // Убираем дефисы в начале и конце
                    
                    // Если id все еще пустой, используем индекс заголовка для стабильности
                    if (!generatedId || generatedId.length === 0) {
                        const allHeadings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6');
                        let headingIndex = 0;
                        for (let i = 0; i < allHeadings.length; i++) {
                            if (allHeadings[i] === heading) {
                                headingIndex = i;
                                break;
                            }
                        }
                        generatedId = 'heading-' + headingIndex;
                    }
                    
                    // Устанавливаем id через setAttribute, чтобы перезаписать пустой атрибут
                    heading.setAttribute('id', generatedId);
                    currentId = generatedId;
                } else {
                    // Если текста нет, используем индекс заголовка для стабильности
                    const allHeadings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6');
                    let headingIndex = 0;
                    for (let i = 0; i < allHeadings.length; i++) {
                        if (allHeadings[i] === heading) {
                            headingIndex = i;
                            break;
                        }
                    }
                    currentId = 'heading-' + headingIndex;
                    heading.setAttribute('id', currentId);
                }
            } else {
                // Используем существующий id
                currentId = currentId.trim();
            }
            
            // Проверяем, что id не пустой
            if (!currentId || currentId.trim() === '') {
                return;
            }
        });
    }
    
    // Обработчик кликов на заголовках через делегирование событий
    function setupHeadingClickHandlers() {
        // Удаляем старые обработчики, если они есть
        if (window._headingClickHandler) {
            document.removeEventListener('click', window._headingClickHandler, true);
        }
        
        // Обработчик обычного клика
        window._headingClickHandler = function(e) {
            // Проверяем, что клик был на заголовке
            let heading = e.target;
            let foundHeading = null;
            
            // Проверяем сам элемент
            if (heading && heading.tagName && /^H[1-6]$/.test(heading.tagName) && heading.closest('.document')) {
                foundHeading = heading;
            } else {
                // Ищем в родителях
                let current = heading;
                let depth = 0;
                while (current && current !== document.body && depth < 10) {
                    if (current.tagName && /^H[1-6]$/.test(current.tagName) && current.closest('.document')) {
                        foundHeading = current;
                        break;
                    }
                    current = current.parentElement;
                    depth++;
                }
            }
            
            if (!foundHeading || !foundHeading.closest('.document')) {
                return;
            }
            
            heading = foundHeading;
            
            // Пропускаем клики на дочерние элементы (например, ссылки)
            if (e.target !== heading && e.target.closest('a')) {
                return;
            }
            
            const id = heading.id;
            if (!id || id.trim() === '') {
                return;
            }
            
            // Обработка Ctrl/Cmd + клик
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const url = new URL(window.location);
                url.hash = id;
                const linkUrl = url.href;
                navigator.clipboard.writeText(linkUrl).then(function() {
                    // Ссылка скопирована
                }).catch(function(err) {
                    console.error('Failed to copy link:', err);
                    // Fallback для старых браузеров
                    const textArea = document.createElement('textarea');
                    textArea.value = linkUrl;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                    } catch (err2) {
                        console.error('Fallback copy failed:', err2);
                    }
                    document.body.removeChild(textArea);
                });
                return false;
            }
            
            // Обычный клик - прокрутка к заголовку
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const url = new URL(window.location);
            url.hash = id;
            window.history.pushState({}, '', url);
            
            // Прокрутка с учетом header - заголовок должен быть на 80px от верха экрана
            const scrollToHeading = function() {
                // Пересчитываем позицию, так как DOM мог измениться
                const rect = heading.getBoundingClientRect();
                const elementPosition = rect.top + window.pageYOffset;
                const offsetPosition = elementPosition - 80;
                
                window.scrollTo({
                    top: Math.max(0, offsetPosition),
                    behavior: 'smooth'
                });
            };
            
            // Небольшая задержка для обновления DOM
            setTimeout(function() {
                scrollToHeading();
            }, 10);
            
            return false;
        };
        
        // Обработчик правого клика
        window._headingContextMenuHandler = function(e) {
            // Проверяем, что клик был на заголовке
            let heading = e.target;
            let foundHeading = null;
            
            // Проверяем сам элемент
            if (heading && heading.tagName && /^H[1-6]$/.test(heading.tagName) && heading.closest('.document')) {
                foundHeading = heading;
            } else {
                // Ищем в родителях
                let current = heading;
                let depth = 0;
                while (current && current !== document.body && depth < 10) {
                    if (current.tagName && /^H[1-6]$/.test(current.tagName) && current.closest('.document')) {
                        foundHeading = current;
                        break;
                    }
                    current = current.parentElement;
                    depth++;
                }
            }
            
            if (!foundHeading || !foundHeading.closest('.document')) {
                return;
            }
            
            heading = foundHeading;
            
            const id = heading.id;
            if (!id || id.trim() === '') {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const url = new URL(window.location);
            url.hash = id;
            const linkUrl = url.href;
            
            navigator.clipboard.writeText(linkUrl).then(function() {
                // Ссылка скопирована
            }).catch(function(err) {
                console.error('Failed to copy link:', err);
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = linkUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err2) {
                    console.error('Fallback copy failed:', err2);
                }
                document.body.removeChild(textArea);
            });
            return false;
        };
        
        // Добавляем обработчики на уровне документа с capture phase
        document.addEventListener('click', window._headingClickHandler, true);
    }
    
    // Делаем подписи к картинкам кликабельными
    function makeCaptionsClickable() {
        const captions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
        
        captions.forEach(function(caption, index) {
            if (caption.dataset.clickableAdded) return;
            caption.dataset.clickableAdded = 'true';
            
            const captionText = caption.textContent.trim();
            
            // Ищем связанное изображение
            const figure = caption.closest('figure');
            const img = figure ? figure.querySelector('img') : caption.previousElementSibling;
            
            if (img) {
                // Создаем id для изображения (если его нет) и для подписи
                if (!img.id || img.id.trim() === '') {
                    const text = captionText;
                    if (text) {
                        let generatedId = 'image-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                        if (!generatedId || generatedId === 'image-') {
                            // Если id пустой, используем индекс
                            generatedId = 'image-' + index;
                        }
                        img.id = generatedId;
                    } else {
                        img.id = 'image-' + index;
                    }
                }
                
                if (!caption.id || caption.id.trim() === '') {
                    const text = captionText;
                    if (text) {
                        let generatedId = 'caption-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                        if (!generatedId || generatedId === 'caption-') {
                            // Если id пустой, используем индекс
                            generatedId = 'caption-' + index;
                        }
                        caption.id = generatedId;
                    } else {
                        caption.id = 'caption-' + index;
                    }
                }
                
                // При клике на подпись прокручиваем к началу изображения
                caption.addEventListener('click', function(e) {
                    // Обработка правого клика или Ctrl/Cmd + клик
                    if (e.button === 2 || e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        // При копировании ссылки используем id изображения, чтобы при переходе прокручивало к изображению
                        let imgId = img.id;
                        
                        // Если id пустой, генерируем его
                        if (!imgId || imgId.trim() === '') {
                            const text = caption.textContent.trim();
                            if (text) {
                                imgId = 'image-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                if (!imgId || imgId === 'image-') {
                                    const allCaptions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
                                    let captionIndex = 0;
                                    for (let i = 0; i < allCaptions.length; i++) {
                                        if (allCaptions[i] === caption) {
                                            captionIndex = i;
                                            break;
                                        }
                                    }
                                    imgId = 'image-' + captionIndex;
                                }
                            } else {
                                const allCaptions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
                                let captionIndex = 0;
                                for (let i = 0; i < allCaptions.length; i++) {
                                    if (allCaptions[i] === caption) {
                                        captionIndex = i;
                                        break;
                                    }
                                }
                                imgId = 'image-' + captionIndex;
                            }
                            img.id = imgId;
                        }
                        
                        if (imgId && imgId.trim() !== '') {
                            const url = new URL(window.location);
                            url.hash = imgId;
                            navigator.clipboard.writeText(url.href).then(function() {
                                // Ссылка скопирована
                            }).catch(function(err) {
                                console.error('Failed to copy link:', err);
                            });
                        }
                        return false;
                    }
                    
                    // Обычный клик - прокрутка к началу изображения
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Всегда используем id изображения для ссылки, чтобы при переходе по ссылке прокручивало к изображению
                    let imgId = img.id;
                    
                    // Если id пустой, генерируем его
                    if (!imgId || imgId.trim() === '') {
                        const text = caption.textContent.trim();
                        if (text) {
                            imgId = 'image-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                            if (!imgId || imgId === 'image-') {
                                const allCaptions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
                                let captionIndex = 0;
                                for (let i = 0; i < allCaptions.length; i++) {
                                    if (allCaptions[i] === caption) {
                                        captionIndex = i;
                                        break;
                                    }
                                }
                                imgId = 'image-' + captionIndex;
                            }
                        } else {
                            const allCaptions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
                            let captionIndex = 0;
                            for (let i = 0; i < allCaptions.length; i++) {
                                if (allCaptions[i] === caption) {
                                    captionIndex = i;
                                    break;
                                }
                            }
                            imgId = 'image-' + captionIndex;
                        }
                        img.id = imgId;
                    }
                    
                    if (!imgId || imgId.trim() === '') {
                        return false;
                    }
                    
                    const url = new URL(window.location);
                    url.hash = imgId;
                    window.history.pushState({}, '', url);
                    
                    // Прокрутка к началу изображения - изображение должно быть на 80px от верха экрана
                    const scrollToImage = function() {
                        const rect = img.getBoundingClientRect();
                        const elementPosition = rect.top + window.pageYOffset;
                        const offsetPosition = elementPosition - 80;
                        
                        window.scrollTo({
                            top: Math.max(0, offsetPosition),
                            behavior: 'smooth'
                        });
                    };
                    
                    setTimeout(function() {
                        scrollToImage();
                    }, 10);
                    
                    return false;
                }, true);
                
                // Обработка правого клика
                caption.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    // При копировании ссылки используем id изображения, чтобы при переходе прокручивало к изображению
                    let imgId = img.id;
                    
                    // Если id пустой, генерируем его
                    if (!imgId || imgId.trim() === '') {
                        const text = caption.textContent.trim();
                        if (text) {
                            imgId = 'image-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                            if (!imgId || imgId === 'image-') {
                                const allCaptions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
                                let captionIndex = 0;
                                for (let i = 0; i < allCaptions.length; i++) {
                                    if (allCaptions[i] === caption) {
                                        captionIndex = i;
                                        break;
                                    }
                                }
                                imgId = 'image-' + captionIndex;
                            }
                        } else {
                            const allCaptions = document.querySelectorAll('.document figcaption, .document .caption, .document p.caption');
                            let captionIndex = 0;
                            for (let i = 0; i < allCaptions.length; i++) {
                                if (allCaptions[i] === caption) {
                                    captionIndex = i;
                                    break;
                                }
                            }
                            imgId = 'image-' + captionIndex;
                        }
                        img.id = imgId;
                    }
                    
                    if (imgId && imgId.trim() !== '') {
                        const url = new URL(window.location);
                        url.hash = imgId;
                        navigator.clipboard.writeText(url.href).then(function() {
                            // Ссылка скопирована
                        }).catch(function(err) {
                            console.error('Failed to copy link:', err);
                        });
                    }
                    return false;
                }, true);
            }
        });
    }
    
    // Обработка хэша при загрузке страницы
    let hashProcessed = null;
    let hashProcessing = false;
    let hashScrollTimeout = null;
    
    function handleHashOnLoad() {
        // Проверяем, есть ли хэш в URL
        if (!window.location.hash || window.location.hash === '') {
            return;
        }
        
        const hash = window.location.hash.substring(1);
        if (!hash || hash === '') {
            return;
        }
        
        // Предотвращаем множественные вызовы
        if (hashProcessing) {
            return;
        }
        
        // Если хэш уже был обработан для этого URL, не обрабатываем снова
        const currentHash = window.location.hash;
        if (hashProcessed === currentHash) {
            return;
        }
        
        // Отменяем предыдущий таймаут, если он есть
        if (hashScrollTimeout) {
            clearTimeout(hashScrollTimeout);
            hashScrollTimeout = null;
        }
        
        hashProcessing = true;
        hashProcessed = currentHash;
        
        // Сначала убеждаемся, что заголовки получили свои id
        makeHeadingsClickable();
        makeCaptionsClickable();
        
        // Функция для прокрутки к элементу (вызывается только один раз)
        const scrollToHash = function() {
            if (!hash) {
                hashProcessing = false;
                return;
            }
            
            let targetElement = document.getElementById(hash);
            
            // Если элемент не найден, возможно это id подписи - ищем связанное изображение
            if (!targetElement && hash.startsWith('caption-')) {
                const caption = document.getElementById(hash);
                if (caption) {
                    const figure = caption.closest('figure');
                    const img = figure ? figure.querySelector('img') : caption.previousElementSibling;
                    if (img) {
                        targetElement = img; // Прокручиваем к изображению, а не к подписи
                    }
                }
            }
            
            // Если элемент не найден, возможно это id изображения
            if (!targetElement && hash.startsWith('image-')) {
                targetElement = document.getElementById(hash);
            }
            
            // Если элемент все еще не найден, попробуем найти заголовок по id
            if (!targetElement) {
                const headings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6');
                headings.forEach(function(heading) {
                    if (heading.id === hash) {
                        targetElement = heading;
                    }
                });
            }
            
            if (targetElement) {
                // Проверяем, не прокручиваем ли мы уже к этому элементу
                const rect = targetElement.getBoundingClientRect();
                const currentScroll = window.pageYOffset || window.scrollY;
                const elementPosition = rect.top + currentScroll;
                const offsetPosition = elementPosition - 80;
                const targetScroll = Math.max(0, offsetPosition);
                
                // Прокручиваем только если мы не находимся уже близко к целевому элементу
                // (разница больше 10px, чтобы избежать постоянных микропрокруток)
                if (Math.abs(currentScroll - targetScroll) > 10) {
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                    
                    // Обновляем активный элемент в правом меню после прокрутки
                    setTimeout(function() {
                        if (window.updateActiveHeading) {
                            window.updateActiveHeading();
                        }
                    }, 600);
                } else {
                    // Даже если не прокручиваем, обновляем активный элемент
                    setTimeout(function() {
                        if (window.updateActiveHeading) {
                            window.updateActiveHeading();
                        }
                    }, 100);
                }
            }
            
            hashProcessing = false;
        };
        
        // Однократная попытка с задержкой для полной загрузки DOM
        hashScrollTimeout = setTimeout(scrollToHash, 300);
    }
    
    // Инициализация
    function initClickableElements() {
        makeHeadingsClickable();
        setupHeadingClickHandlers();
        makeCaptionsClickable();
        // Не обрабатываем хэш здесь - это будет сделано в handleHashOnLoad при необходимости
    }
    
    // Инициализация при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initClickableElements();
            setTimeout(initClickableElements, 100);
            setTimeout(initClickableElements, 300);
        });
    } else {
        initClickableElements();
        setTimeout(initClickableElements, 100);
        setTimeout(initClickableElements, 300);
    }
    
    // Инициализация после полной загрузки
    window.addEventListener('load', function() {
        initClickableElements();
        setTimeout(initClickableElements, 100);
        setTimeout(initClickableElements, 500);
    });
    
    // Обработка изменений в DOM
    const observer = new MutationObserver(function() {
        makeHeadingsClickable();
        setupHeadingClickHandlers();
        makeCaptionsClickable();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Обработка изменения хэша
    window.addEventListener('hashchange', function() {
        // Сбрасываем флаги обработки при изменении хэша
        hashProcessed = null;
        hashProcessing = false;
        hashLoadProcessed = false;
        // Отменяем предыдущий таймаут
        if (hashScrollTimeout) {
            clearTimeout(hashScrollTimeout);
            hashScrollTimeout = null;
        }
        // Убеждаемся, что заголовки получили свои id перед обработкой хэша
        makeHeadingsClickable();
        makeCaptionsClickable();
        handleHashOnLoad();
        
        // Обновляем активный элемент в правом меню после изменения хэша
        setTimeout(function() {
            const floatingTocPage = document.getElementById('floatingTocPage');
            if (floatingTocPage && window.updateActiveHeading) {
                window.updateActiveHeading();
            }
        }, 500);
    });
    
    // Обработка хэша при полной загрузке страницы (только один раз)
    let hashLoadProcessed = false;
    window.addEventListener('load', function() {
        if (window.location.hash && window.location.hash !== '' && !hashLoadProcessed) {
            hashLoadProcessed = true;
            makeHeadingsClickable();
            makeCaptionsClickable();
            // Однократная обработка хэша после полной загрузки
            handleHashOnLoad();
        }
    });
    
    // Обработка хэша при первой загрузке страницы (если load уже произошел)
    if (document.readyState === 'complete' && window.location.hash && window.location.hash !== '' && !hashLoadProcessed) {
        hashLoadProcessed = true;
        makeHeadingsClickable();
        makeCaptionsClickable();
        handleHashOnLoad();
    }
})();
