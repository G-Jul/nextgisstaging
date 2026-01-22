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
                        
                        if (target === arrowIcon || 
                            target.classList.contains('nav-arrow-icon') || 
                            target.classList.contains('nav-arrow-icon-img') ||
                            target.classList.contains('toctree-expand') ||
                            target.closest('.nav-arrow-icon') ||
                            target.closest('.toctree-expand')) {
                            return;
                        }
                        
                        const href = finalLink.getAttribute('href');
                        
                        if (!isExpanded) {
                            e.preventDefault();
                            e.stopPropagation();
                            item.classList.add('expanded');
                            
                            if (href && !href.startsWith('#')) {
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                item.classList.add('current');
                                
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                        }
                                    }, 2000);
                                }
                            }
                        } else {
                            if (href && href.startsWith('#')) {
                                e.preventDefault();
                                const targetElement = document.querySelector(href);
                                if (targetElement) {
                                    targetElement.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }
                                
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                item.classList.add('current');
                                
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                        }
                                    }, 2000);
                                }
                            } else if (href && !href.startsWith('#')) {
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                item.classList.add('current');
                                
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
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
                        
                        if (href && href.startsWith('#')) {
                            e.preventDefault();
                            const targetElement = document.querySelector(href);
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
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
                            leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                item.classList.add('current');
                                
                                if (leftNav) {
                            leftNav.dataset.userClicked = 'true';
                            setTimeout(() => {
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'false';
                                }
                            }, 2000);
                        }
                    });
                }
            });
        }
        
        processMenuItems(leftNav);
        
        function removeCurrentFromParents() {
            const leftNav = document.getElementById('leftNav');
            if (!leftNav) return;
            
            const currentItems = leftNav.querySelectorAll('[class*="toctree-l"].current');
            
            currentItems.forEach(currentItem => {
                const classList = Array.from(currentItem.classList);
                const levelClass = classList.find(cls => cls.startsWith('toctree-l'));
                if (!levelClass) return;
                
                const currentLevel = parseInt(levelClass.replace('toctree-l', ''));
                
                if (currentLevel > 1) {
                    let parent = currentItem.parentElement;
                    while (parent && parent !== leftNav) {
                        const parentItem = parent.closest('[class*="toctree-l"]');
                        if (parentItem && parentItem !== currentItem) {
                            parentItem.classList.remove('current');
                            if (!parentItem.classList.contains('expanded')) {
                                parentItem.classList.add('expanded');
                            }
                        }
                        parent = parent.parentElement;
                    }
                }
            });
        }
        
        setTimeout(removeCurrentFromParents, 100);
        setTimeout(removeCurrentFromParents, 500);
        setTimeout(removeCurrentFromParents, 1000);
        
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
                if (headingId) {
                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                        menuItem.classList.remove('current');
                    });
                    
                    const menuLink = leftNav.querySelector(`a[href="#${headingId}"], a[href*="#${headingId}"]`);
                    if (menuLink) {
                        const menuItem = menuLink.closest('[class*="toctree-l"]');
                        if (menuItem) {
                            menuItem.classList.add('current');
                            let parent = menuItem.parentElement;
                            while (parent && parent !== leftNav) {
                                const parentItem = parent.closest('[class*="toctree-l"]');
                                if (parentItem) {
                                    parentItem.classList.add('expanded');
                                }
                                parent = parent.parentElement;
                            }
                        }
                    }
                }
            }
            
            removeCurrentFromParents();
        }
        
        let scrollTimeout = null;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateCurrentFromScroll, 100);
        });
        
        setTimeout(updateCurrentFromScroll, 500);
    }
    
    function initFloatingToc() {
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
            
            function updateActiveHeading() {
                if (userClickedLink) {
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
                const scrollPosition = window.pageYOffset;
                const viewportTop = scrollPosition + headerHeight + 100;
                
                let activeHeading = null;
                let activeHeadingTop = -Infinity;
                
                const allHeadings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6, .rst-content h1, .rst-content h2, .rst-content h3, .rst-content h4, .rst-content h5, .rst-content h6');
                const currentHeadings = Array.from(allHeadings).filter(h => {
                    return !h.closest('.custom-footer') && !h.closest('footer');
                });
                
                if (scrollPosition < 150 && currentHeadings.length > 0) {
                    activeHeading = currentHeadings[0];
                    activeHeadingTop = currentHeadings[0].offsetTop;
                } else {
                    currentHeadings.forEach(heading => {
                        const headingTop = heading.offsetTop;
                        const headingHeight = heading.offsetHeight;
                        const headingBottom = headingTop + headingHeight;
                        
                        if (viewportTop >= headingTop && viewportTop < headingBottom) {
                            if (headingTop >= activeHeadingTop) {
                                activeHeading = heading;
                                activeHeadingTop = headingTop;
                            }
                        } else if (headingTop <= viewportTop && headingTop > activeHeadingTop) {
                            activeHeading = heading;
                            activeHeadingTop = headingTop;
                        }
                    });
                    
                    if (!activeHeading) {
                        currentHeadings.forEach(heading => {
                            const headingTop = heading.offsetTop;
                            if (headingTop <= viewportTop && headingTop > activeHeadingTop) {
                                activeHeading = heading;
                                activeHeadingTop = headingTop;
                            }
                        });
                    }
                    
                    if (!activeHeading && scrollPosition < 250 && currentHeadings.length > 0) {
                        activeHeading = currentHeadings[0];
                        activeHeadingTop = currentHeadings[0].offsetTop;
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
                    
                    tocLinks.forEach(l => l.classList.remove('active'));
                    
                    let foundLink = false;
                    
                    // Ищем соответствующую ссылку в TOC
                    tocLinks.forEach(link => {
                        const linkHref = link.getAttribute('href');
                        const linkText = link.textContent.trim();
                        
                        if (!linkHref) return;
                        
                        // Нормализуем href - извлекаем только якорь
                        let anchorId = null;
                        if (linkHref.startsWith('#')) {
                            anchorId = linkHref.substring(1).trim();
                        } else if (linkHref.includes('#')) {
                            anchorId = linkHref.split('#').pop().trim();
                        }
                        
                        if (headingId && (anchorId === headingId || linkHref === '#' + headingId || linkHref === headingId)) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        else if (!foundLink && linkText === headingText) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        else if (!foundLink && linkHref.includes(headingText)) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        else if (!foundLink && linkHref === '#' && currentHeadings.indexOf(activeHeading) === 0 && tocLinks.indexOf(link) === 0) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        else if (!foundLink && (linkHref === '#' || !linkHref || linkHref.trim() === '') && currentHeadings.indexOf(activeHeading) === 0) {
                            if (linkText === headingText || linkText.includes(headingText) || headingText.includes(linkText)) {
                                link.classList.add('active');
                                foundLink = true;
                            }
                        }
                    });
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
        }
    }

    // Адаптивность: скрытие плавающего меню на планшете
    
    function handleResize() {
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
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 500);
                }
                
                if (window.location.hash) {
                    setTimeout(function() {
                        const targetElement = document.querySelector(window.location.hash);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
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
})();
