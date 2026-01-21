// JavaScript для кастомной темы внутренних страниц
// Добавляем элементы через JS, если их нет

(function() {
    'use strict';
    
    // Получаем путь к статическим файлам более надежным способом
    function getStaticPath() {
        // Пробуем разные способы
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
        
        // По умолчанию
        return '_static';
    }
    
    // Добавление кастомного header
    
    function addCustomHeader() {
        // Удаляем старый header если есть
        const oldHeader = document.querySelector('.custom-header');
        if (oldHeader) {
            oldHeader.remove();
        }
        
        if (!document.body) {
            return;
        }
        
        const body = document.body;
        const staticPath = getStaticPath();
        
        // Определяем путь к index.html
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
        
        // Вставляем в самое начало body
        if (body.firstChild) {
            body.insertBefore(customHeader, body.firstChild);
        } else {
            body.appendChild(customHeader);
        }
    }
    
    // Добавление левого навигационного меню
    
    function addLeftNav() {
        // Удаляем старое меню если есть
        const oldNav = document.getElementById('leftNav');
        if (oldNav && oldNav.parentElement) {
            oldNav.parentElement.remove();
        }
        
        if (!document.body) {
            return;
        }
        
        // Ищем стандартное меню RTD
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
        
        // Клонируем меню RTD
        const menuClone = wyMenu.cloneNode(true);
        // Удаляем классы RTD и добавляем наши
        menuClone.classList.remove('wy-menu', 'wy-menu-vertical');
        menuClone.classList.add('toctree-wrapper');
        
        leftNavContent.appendChild(menuClone);
        leftNavWrapper.appendChild(leftNav);
        body.appendChild(leftNavWrapper);
    }
    
    // Инициализация навигации
    
    function initNavigation() {
        const leftNav = document.getElementById('leftNav');
        const navToggle = document.querySelector('.nav-toggle');
        const leftNavClose = document.getElementById('leftNavClose');
        const logoLink = document.querySelector('.logo-link');
        const dropdownArrow = document.getElementById('dropdownArrow');

        // Открытие/закрытие левого меню при клике на "Документация" или стрелку
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

        // Также обрабатываем клик на стрелку отдельно
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

        // Открытие/закрытие левого меню при клике на бургер
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

        // Закрытие левого меню при клике вне его
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
    
    // Раскрывающееся левое меню с анимированными стрелками
    
    function initCollapsibleMenu() {
        const leftNav = document.getElementById('leftNav');
        if (!leftNav) {
            return;
        }
        
        // Получаем путь к статическим файлам
        const staticPath = getStaticPath();
        
        // Функция для обработки всех элементов меню (любого уровня)
        function processMenuItems(container) {
            // Находим все элементы меню с классами toctree-l* (любой уровень)
            const items = container.querySelectorAll('[class*="toctree-l"]');
            
            items.forEach(item => {
                const link = item.querySelector('a');
                const submenu = item.querySelector('ul');
                
                if (!link) return;
                
                // Проверяем, не обработан ли уже этот элемент
                if (link.dataset.menuProcessed === 'true') {
                    return;
                }
                link.dataset.menuProcessed = 'true';
                
                const finalLink = link;
                
                // Если есть подменю, делаем элемент раскрывающимся
                if (submenu && submenu.children.length > 0) {
                    // Добавляем иконку стрелки, если её ещё нет
                    let arrowIcon = finalLink.querySelector('.nav-arrow-icon');
                    if (!arrowIcon) {
                        arrowIcon = document.createElement('img');
                        arrowIcon.src = staticPath + '/icons/arrow_down_for_nav.svg';
                        arrowIcon.className = 'nav-arrow-icon';
                        arrowIcon.alt = '';
                        arrowIcon.style.cursor = 'pointer';
                        finalLink.appendChild(arrowIcon);
                    }
                    
                    // Обработчик клика по стрелке (изображению) - используем capture для приоритета
                    // Проверяем, не добавлен ли уже обработчик
                    if (!arrowIcon.dataset.clickHandlerAdded) {
                        arrowIcon.dataset.clickHandlerAdded = 'true';
                        
                        arrowIcon.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            // Переключаем состояние независимо от класса current
                            const isExpanded = item.classList.contains('expanded');
                            if (isExpanded) {
                                item.classList.remove('expanded');
                            } else {
                                item.classList.add('expanded');
                            }
                            return false;
                        }, true); // Используем capture phase
                        
                        // Дополнительно: обработчик на mousedown для надежности
                        arrowIcon.addEventListener('mousedown', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }, true);
                    }
                    
                    // Обработчик клика по кнопке toctree-expand (если есть)
                    const expandButton = finalLink.querySelector('.toctree-expand');
                    if (expandButton) {
                        expandButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            const isExpanded = item.classList.contains('expanded');
                            if (isExpanded) {
                                item.classList.remove('expanded');
                            } else {
                                item.classList.add('expanded');
                            }
                            return false;
                        }, true);
                    }
                    
                    // Обработчик клика по ссылке
                    finalLink.addEventListener('click', function(e) {
                        const target = e.target;
                        const isExpanded = item.classList.contains('expanded');
                        
                        // Если клик по стрелке или кнопке expand - не обрабатываем здесь
                        // Проверяем все возможные варианты
                        if (target === arrowIcon || 
                            target.classList.contains('nav-arrow-icon') || 
                            target.classList.contains('toctree-expand') ||
                            target.closest('.nav-arrow-icon') ||
                            target.closest('.toctree-expand') ||
                            (target.tagName === 'IMG' && target.classList.contains('nav-arrow-icon'))) {
                            // Не обрабатываем - стрелка уже обработана выше
                            return;
                        }
                        
                        // Если клик по тексту ссылки
                        const href = finalLink.getAttribute('href');
                        
                        if (!isExpanded) {
                            // Если меню закрыто - раскрываем его
                            e.preventDefault();
                            e.stopPropagation();
                            item.classList.add('expanded');
                            
                            // Если это переход на другую страницу (не якорная ссылка), добавляем current
                            if (href && !href.startsWith('#')) {
                                // Убираем current со всех элементов меню
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                // Добавляем current к кликнутому элементу
                                item.classList.add('current');
                                
                                // Устанавливаем флаг, что пользователь кликнул
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
                            // Если меню уже раскрыто
                            if (href && href.startsWith('#')) {
                                // Якорная ссылка - добавляем плавную прокрутку
                                e.preventDefault();
                                const targetElement = document.querySelector(href);
                                if (targetElement) {
                                    // Используем scrollIntoView с учетом scroll-margin-top из CSS
                                    targetElement.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }
                                
                                // Убираем current со всех элементов меню
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                // Добавляем current к кликнутому элементу
                                item.classList.add('current');
                                
                                // Устанавливаем флаг, что пользователь кликнул
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                        }
                                    }, 2000);
                                }
                            } else if (href && !href.startsWith('#')) {
                                // Переход на другую страницу - добавляем current
                                // Убираем current со всех элементов меню
                                const leftNav = document.getElementById('leftNav');
                                if (leftNav) {
                                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                        menuItem.classList.remove('current');
                                    });
                                }
                                // Добавляем current к кликнутому элементу
                                item.classList.add('current');
                                
                                // Устанавливаем флаг, что пользователь кликнул
                                if (leftNav) {
                                    leftNav.dataset.userClicked = 'true';
                                    setTimeout(() => {
                                        if (leftNav) {
                                            leftNav.dataset.userClicked = 'false';
                                        }
                                    }, 2000);
                                }
                                // Разрешаем стандартный переход на другую страницу
                            }
                        }
                    }, false); // Используем bubble phase, чтобы стрелка обработалась раньше
                    
                    // Если элемент текущий (current), раскрываем его
                    if (item.classList.contains('current')) {
                        item.classList.add('expanded');
                    }
                } else {
                    // Если нет подменю - добавляем класс current при клике и плавную прокрутку
                    finalLink.addEventListener('click', function(e) {
                        const href = finalLink.getAttribute('href');
                        
                        // Если это якорная ссылка (начинается с #), добавляем плавную прокрутку
                        if (href && href.startsWith('#')) {
                            e.preventDefault();
                            const targetElement = document.querySelector(href);
                            if (targetElement) {
                                // Используем scrollIntoView с учетом scroll-margin-top из CSS
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            } else {
                                // Если элемент не найден, скроллим в начало страницы
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }
                        } else if (href && href.includes('#')) {
                            // Если ссылка на другую страницу с якорем (например, usage.html#section)
                            // Разрешаем стандартный переход, но после загрузки страницы делаем плавную прокрутку
                            const [pagePath, anchor] = href.split('#');
                            if (anchor) {
                                // Сохраняем якорь для прокрутки после загрузки
                                sessionStorage.setItem('scrollToAnchor', '#' + anchor);
                            }
                            // Разрешаем стандартный переход
                        }
                        
                        // Убираем current со ВСЕХ элементов меню (любого уровня)
                        const leftNav = document.getElementById('leftNav');
                        if (leftNav) {
                            leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                                menuItem.classList.remove('current');
                            });
                        }
                        // Добавляем current только к кликнутому элементу
                        item.classList.add('current');
                        
                        // Устанавливаем флаг, что пользователь кликнул (чтобы не перезаписывать при прокрутке)
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
        
        // Обрабатываем все уровни меню
        processMenuItems(leftNav);
        
        // Функция для удаления current с родительских элементов, если активен дочерний
        function removeCurrentFromParents() {
            const leftNav = document.getElementById('leftNav');
            if (!leftNav) return;
            
            // Находим все элементы с классом current
            const currentItems = leftNav.querySelectorAll('[class*="toctree-l"].current');
            
            currentItems.forEach(currentItem => {
                // Определяем уровень текущего элемента
                const classList = Array.from(currentItem.classList);
                const levelClass = classList.find(cls => cls.startsWith('toctree-l'));
                if (!levelClass) return;
                
                const currentLevel = parseInt(levelClass.replace('toctree-l', ''));
                
                // Если это не первый уровень (l2, l3, l4 и т.д.)
                if (currentLevel > 1) {
                    // Находим все родительские элементы и убираем у них current
                    let parent = currentItem.parentElement;
                    while (parent && parent !== leftNav) {
                        const parentItem = parent.closest('[class*="toctree-l"]');
                        if (parentItem && parentItem !== currentItem) {
                            parentItem.classList.remove('current');
                            // Оставляем expanded, чтобы меню оставалось раскрытым
                            if (!parentItem.classList.contains('expanded')) {
                                parentItem.classList.add('expanded');
                            }
                        }
                        parent = parent.parentElement;
                    }
                }
            });
        }
        
        // Вызываем после обработки меню (несколько раз с задержками, чтобы учесть классы от Sphinx)
        setTimeout(removeCurrentFromParents, 100);
        setTimeout(removeCurrentFromParents, 500);
        setTimeout(removeCurrentFromParents, 1000);
        
        // Функция для обновления current на основе видимых заголовков при прокрутке
        function updateCurrentFromScroll() {
            const leftNav = document.getElementById('leftNav');
            if (!leftNav) return;
            
            // Если пользователь недавно кликнул, не обновляем
            if (leftNav.dataset.userClicked === 'true') {
                return;
            }
            
            // Находим все заголовки на странице
            const headings = document.querySelectorAll('.document h1[id], .document h2[id], .document h3[id], .document h4[id], .rst-content h1[id], .rst-content h2[id], .rst-content h3[id], .rst-content h4[id]');
            
            if (headings.length === 0) return;
            
            const headerHeight = document.querySelector('.custom-header')?.offsetHeight || 64;
            const scrollPosition = window.pageYOffset + headerHeight + 100;
            
            let activeHeading = null;
            let activeHeadingTop = 0;
            
            // Находим заголовок, который сейчас виден
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
            
            // Если не нашли активный заголовок, берем последний видимый
            if (!activeHeading) {
                headings.forEach(heading => {
                    const headingTop = heading.offsetTop;
                    if (headingTop <= scrollPosition && headingTop >= activeHeadingTop) {
                        activeHeading = heading;
                        activeHeadingTop = headingTop;
                    }
                });
            }
            
            // Обновляем current в меню
            if (activeHeading) {
                const headingId = activeHeading.id;
                if (headingId) {
                    // Убираем current со всех элементов
                    leftNav.querySelectorAll('[class*="toctree-l"]').forEach(menuItem => {
                        menuItem.classList.remove('current');
                    });
                    
                    // Находим соответствующий элемент меню
                    const menuLink = leftNav.querySelector(`a[href="#${headingId}"], a[href*="#${headingId}"]`);
                    if (menuLink) {
                        const menuItem = menuLink.closest('[class*="toctree-l"]');
                        if (menuItem) {
                            menuItem.classList.add('current');
                            // Раскрываем родительские элементы
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
            
            // Убираем current с родительских элементов после обновления
            removeCurrentFromParents();
        }
        
        // Отслеживаем прокрутку для обновления current
        let scrollTimeout = null;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateCurrentFromScroll, 100);
        });
        
        // Вызываем при загрузке
        setTimeout(updateCurrentFromScroll, 500);
    }
    
    // Плавающее меню содержания страницы
    
    function initFloatingToc() {
        const floatingTocPage = document.getElementById('floatingTocPage');
        
        if (floatingTocPage) {
            // Используем делегирование событий для обработки кликов по ссылкам
            // Это работает даже если ссылки добавляются динамически
            let userClickedLink = null; // Флаг для отслеживания клика пользователя
            let clickTimeout = null; // Таймер для сброса флага
            
            // Удаляем старый обработчик, если он есть (и в capture, и в bubble фазе)
            if (floatingTocPage._tocClickHandler) {
                floatingTocPage.removeEventListener('click', floatingTocPage._tocClickHandler, true);
                floatingTocPage.removeEventListener('click', floatingTocPage._tocClickHandler, false);
            }
            
            // Создаем новый обработчик с делегированием событий
            // Используем capture фазу, чтобы сработать ДО обработчика document
            floatingTocPage._tocClickHandler = function(e) {
                // Проверяем, что клик был по ссылке или внутри ссылки
                const clickedLink = e.target.closest('a');
                if (!clickedLink || !floatingTocPage.contains(clickedLink)) {
                    return;
                }
                
                const targetHref = clickedLink.getAttribute('href');
                
                // Устанавливаем флаг, что клик был по ссылке в меню
                if (window._rightMenuLinkClickFlag) {
                    window._rightMenuLinkClickFlag();
                }
                
                // Устанавливаем флаг, чтобы предотвратить закрытие меню
                // Это должно произойти ДО того, как обработчик document проверит флаг
                if (window._setPreventMenuClose) {
                    window._setPreventMenuClose(true);
                }
                
                // Останавливаем распространение события, чтобы другие обработчики не закрыли меню
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Проверяем, является ли это якорной ссылкой (начинается с # или содержит #)
                const isAnchorLink = targetHref && (targetHref.startsWith('#') || targetHref.includes('#'));
                
                // Если это якорная ссылка на текущей странице, обрабатываем через JavaScript
                if (isAnchorLink) {
                    e.preventDefault();
                    
                    // Устанавливаем флаг, что пользователь кликнул
                    userClickedLink = clickedLink;
                    
                    // Сбрасываем таймер если он был
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                    }
                    
                    // Сначала убираем active со всех ссылок
                    const allTocLinks = Array.from(floatingTocPage.querySelectorAll('a'));
                    allTocLinks.forEach(l => l.classList.remove('active'));
                    
                    // Добавляем active к кликнутой ссылке
                    clickedLink.classList.add('active');
                    
                    // Устанавливаем флаг, что это пользовательский выбор (для планшетов и мобильных)
                    clickedLink.dataset.userSelected = 'true';
                    clickedLink.dataset.selectionTime = Date.now().toString();
                    
                    // Убираем флаг с других ссылок
                    allTocLinks.forEach(l => {
                        if (l !== clickedLink) {
                            l.dataset.userSelected = 'false';
                        }
                    });
                    
                    // Блокируем обновление активного элемента на время прокрутки + дополнительное время
                    // Увеличиваем время блокировки, чтобы updateActiveHeading не переключал обратно
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                    }
                    clickTimeout = setTimeout(() => {
                        userClickedLink = null;
                        // Снимаем флаг пользовательского выбора через 3 секунды (для планшетов)
                        if (clickedLink) {
                            clickedLink.dataset.userSelected = 'false';
                        }
                    }, 3000); // Увеличиваем до 3 секунд для планшетов и мобильных
                    
                    // Обрабатываем разные форматы ссылок
                    let targetId = null;
                    
                    // Проверяем, является ли ссылка просто "#" или пустой
                    if (!targetHref || targetHref === '#' || targetHref.trim() === '#' || targetHref.trim() === '') {
                        // Если ссылка просто "#" или пустая, скроллим в начало страницы
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
                        }, 3000); // Увеличиваем до 3 секунд для планшетов
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
                            // Получаем высоту header
                            const header = document.querySelector('.custom-header');
                            const headerHeight = header ? header.offsetHeight : 64;
                            
                            // Получаем абсолютную позицию элемента на странице
                            const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            
                            // Прокручиваем так, чтобы заголовок был виден сразу под header
                            // Добавляем небольшой отступ (10px) для лучшей видимости
                            const scrollPosition = elementTop - headerHeight - 10;
                            
                            window.scrollTo({
                                top: Math.max(0, scrollPosition), // Не даем уйти в отрицательные значения
                                behavior: 'smooth'
                            });
                            
                            // НЕ закрываем меню - оно должно оставаться открытым
                            // Меню закрывается только при клике на бургер (крестик)
                            
                            // Сбрасываем флаг через 3 секунды после завершения скролла
                            // Увеличиваем время для планшетов и мобильных, чтобы updateActiveHeading не переключал обратно
                            if (clickTimeout) {
                                clearTimeout(clickTimeout);
                            }
                            clickTimeout = setTimeout(() => {
                                userClickedLink = null;
                                // Снимаем флаг пользовательского выбора
                                if (clickedLink) {
                                    clickedLink.dataset.userSelected = 'false';
                                }
                                // Сбрасываем флаг предотвращения закрытия меню
                                if (window._setPreventMenuClose) {
                                    window._setPreventMenuClose(false);
                                }
                            }, 3000); // Увеличиваем до 3 секунд для планшетов и мобильных
                        } else {
                            // Если элемент не найден, скроллим в начало
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
                            }, 3000); // Увеличиваем до 3 секунд для планшетов
                        }
                    } else {
                        // Если targetId не определен, скроллим в начало
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
                        }, 3000); // Увеличиваем до 3 секунд для планшетов
                    }
                }
                // Если это не якорная ссылка (например, ссылка на другую страницу), 
                // не предотвращаем стандартное поведение - пусть браузер обработает переход
            };
            
            // Добавляем обработчик на контейнер меню с capture фазой для раннего перехвата
            // Используем capture фазу, чтобы сработать ДО overlay и document
            floatingTocPage.addEventListener('click', floatingTocPage._tocClickHandler, true);
            
            // Также добавляем обработчик mousedown для еще более раннего перехвата
            floatingTocPage.addEventListener('mousedown', function(e) {
                const clickedLink = e.target.closest('a');
                if (clickedLink && floatingTocPage.contains(clickedLink)) {
                    // Устанавливаем флаг сразу при mousedown
                    if (window._setPreventMenuClose) {
                        window._setPreventMenuClose(true);
                    }
                }
            }, true);

            // Получаем список ссылок для подсветки активного заголовка
            const tocLinks = Array.from(floatingTocPage.querySelectorAll('a'));

            // Подсветка активного заголовка при прокрутке
            // Выбираем все заголовки с id (Sphinx автоматически добавляет id ко всем заголовкам)
            // Пробуем разные селекторы, так как структура может отличаться
            let headings = document.querySelectorAll('.document h1[id], .document h2[id], .document h3[id], .document h4[id], .document h5[id], .document h6[id], .rst-content h1[id], .rst-content h2[id], .rst-content h3[id], .rst-content h4[id], .rst-content h5[id], .rst-content h6[id]');
            
            // Если не нашли, пробуем более широкий поиск
            if (headings.length === 0) {
                headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
            }
            
            // Если все еще не нашли, пробуем найти заголовки без обязательного id
            if (headings.length === 0) {
                headings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6, .rst-content h1, .rst-content h2, .rst-content h3, .rst-content h4, .rst-content h5, .rst-content h6');
                // Фильтруем только те, у которых есть id
                headings = Array.from(headings).filter(h => h.id);
            }
            
            // Если все еще не нашли, пробуем найти все заголовки на странице
            if (headings.length === 0) {
                const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headings = Array.from(allHeadings).filter(h => h.id);
            }
            
            function updateActiveHeading() {
                // Если пользователь недавно кликнул, не обновляем активный элемент (но только на короткое время)
                // Проверяем, не истек ли таймаут
                if (userClickedLink) {
                    return;
                }
                
                // Дополнительная проверка: если есть активная ссылка, которую пользователь выбрал,
                // не переключаем её обратно (для планшетов и мобильных)
                const activeLink = floatingTocPage.querySelector('a.active');
                if (activeLink && activeLink.dataset.userSelected === 'true') {
                    // Проверяем, не истек ли таймаут для пользовательского выбора
                    const selectionTime = parseInt(activeLink.dataset.selectionTime || '0');
                    const currentTime = Date.now();
                    if (currentTime - selectionTime < 3000) { // 3 секунды для планшетов
                        return;
                    } else {
                        // Таймаут истек, снимаем флаг
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
                
                // Получаем все заголовки на странице (исключая footer)
                const allHeadings = document.querySelectorAll('.document h1, .document h2, .document h3, .document h4, .document h5, .document h6, .rst-content h1, .rst-content h2, .rst-content h3, .rst-content h4, .rst-content h5, .rst-content h6');
                // Фильтруем, исключая заголовки из footer
                const currentHeadings = Array.from(allHeadings).filter(h => {
                    return !h.closest('.custom-footer') && !h.closest('footer');
                });
                
                // Если пользователь находится в начале страницы, выбираем первый заголовок
                if (scrollPosition < 150 && currentHeadings.length > 0) {
                    activeHeading = currentHeadings[0];
                    activeHeadingTop = currentHeadings[0].offsetTop;
                } else {
                    // Находим заголовок, который сейчас виден или был последним видимым
                    currentHeadings.forEach(heading => {
                        const headingTop = heading.offsetTop;
                        const headingHeight = heading.offsetHeight;
                        const headingBottom = headingTop + headingHeight;
                        
                        // Проверяем, виден ли заголовок в области просмотра
                        if (viewportTop >= headingTop && viewportTop < headingBottom) {
                            // Если заголовок виден и находится выше текущего активного
                            if (headingTop >= activeHeadingTop) {
                                activeHeading = heading;
                                activeHeadingTop = headingTop;
                            }
                        } else if (headingTop <= viewportTop && headingTop > activeHeadingTop) {
                            // Если заголовок уже прошел, но был последним видимым
                            activeHeading = heading;
                            activeHeadingTop = headingTop;
                        }
                    });
                    
                    // Если не нашли активный заголовок, берем последний видимый
                    if (!activeHeading) {
                        currentHeadings.forEach(heading => {
                            const headingTop = heading.offsetTop;
                            if (headingTop <= viewportTop && headingTop > activeHeadingTop) {
                                activeHeading = heading;
                                activeHeadingTop = headingTop;
                            }
                        });
                    }
                    
                    // Если все еще не нашли и мы в начале страницы, выбираем первый заголовок
                    if (!activeHeading && scrollPosition < 250 && currentHeadings.length > 0) {
                        activeHeading = currentHeadings[0];
                        activeHeadingTop = currentHeadings[0].offsetTop;
                    }
                }
                
                if (activeHeading) {
                    // Проверяем, есть ли у заголовка id (может быть в дочернем элементе или обертке)
                    let headingId = activeHeading.getAttribute('id') || activeHeading.id;
                    
                    // Если id нет у самого заголовка, проверяем дочерние элементы (Sphinx может добавлять id к span внутри)
                    if (!headingId) {
                        const idElement = activeHeading.querySelector('[id]');
                        if (idElement) {
                            headingId = idElement.getAttribute('id') || idElement.id;
                        }
                    }
                    
                    // Если id все еще нет, проверяем родительский элемент
                    if (!headingId) {
                        const parentWithId = activeHeading.closest('[id]');
                        if (parentWithId && parentWithId !== activeHeading) {
                            headingId = parentWithId.getAttribute('id') || parentWithId.id;
                        }
                    }
                    
                    const headingText = activeHeading.textContent.trim();
                    
                    // Убираем active со всех ссылок
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
                        
                        // Проверяем совпадение по id
                        if (headingId && (anchorId === headingId || linkHref === '#' + headingId || linkHref === headingId)) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        // Если не нашли по id, пробуем по тексту (основной способ, так как id может не быть)
                        else if (!foundLink && linkText === headingText) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        // Также проверяем, если href содержит текст заголовка (для случаев типа "# Использование")
                        else if (!foundLink && linkHref.includes(headingText)) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        // Специальная обработка для первого элемента с href="#"
                        // Если это первый заголовок и первая ссылка с href="#", сопоставляем их
                        else if (!foundLink && linkHref === '#' && currentHeadings.indexOf(activeHeading) === 0 && tocLinks.indexOf(link) === 0) {
                            link.classList.add('active');
                            foundLink = true;
                        }
                        // Также проверяем, если это первый заголовок и ссылка с href="#" или пустым href
                        else if (!foundLink && (linkHref === '#' || !linkHref || linkHref.trim() === '') && currentHeadings.indexOf(activeHeading) === 0) {
                            // Проверяем, что текст совпадает
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
            
            // Также обновляем после небольшой задержки для корректной работы
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
        // Проверяем, что body существует
        if (!document.body) {
            setTimeout(init, 50);
            return;
        }
        
        // Проверяем, что мы не на главной странице
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        // Добавляем элементы сразу
        addCustomHeader();
        
        // Левое меню добавляем с небольшой задержкой, чтобы дождаться загрузки .wy-menu
        setTimeout(function() {
            addLeftNav();
            
            // Инициализируем навигацию после добавления элементов
            setTimeout(function() {
                initNavigation();
                initCollapsibleMenu();
                initFloatingToc();
                handleResize();
                
                // Проверяем, нужно ли прокрутить к якорю после перехода со страницы
                const scrollToAnchor = sessionStorage.getItem('scrollToAnchor');
                if (scrollToAnchor) {
                    sessionStorage.removeItem('scrollToAnchor');
                    setTimeout(function() {
                        const targetElement = document.querySelector(scrollToAnchor);
                        if (targetElement) {
                            // Используем scrollIntoView с учетом scroll-margin-top из CSS
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 500);
                }
                
                // Также проверяем hash в URL при загрузке страницы
                if (window.location.hash) {
                    setTimeout(function() {
                        const targetElement = document.querySelector(window.location.hash);
                        if (targetElement) {
                            // Используем scrollIntoView с учетом scroll-margin-top из CSS
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
            // Пропускаем, если уже обработана
            if (table.dataset.columnsEqualized) return;
            
            // Находим первую строку (header или первую data row)
            const firstRow = table.querySelector('thead tr') || 
                           table.querySelector('tbody tr') || 
                           table.querySelector('tr');
            
            if (!firstRow) return;
            
            const cells = firstRow.querySelectorAll('th, td');
            const columnCount = cells.length;
            
            if (columnCount === 0) return;
            
            const columnWidth = (100 / columnCount).toFixed(4) + '%';
            
            // Устанавливаем ширину для всех ячеек в таблице
            const allCells = table.querySelectorAll('th, td');
            allCells.forEach(cell => {
                cell.style.width = columnWidth;
                cell.style.minWidth = '0';
                cell.style.maxWidth = columnWidth;
                cell.style.boxSizing = 'border-box';
            });
            
            // Также устанавливаем для colgroup, если он есть
            let colgroup = table.querySelector('colgroup');
            if (!colgroup) {
                // Создаем colgroup, если его нет
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
    
    // Вызываем после загрузки DOM
    function initTableColumns() {
        equalizeTableColumns();
        // Повторяем через небольшую задержку для надежности
        setTimeout(equalizeTableColumns, 50);
        setTimeout(equalizeTableColumns, 200);
        setTimeout(equalizeTableColumns, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableColumns);
    } else {
        initTableColumns();
    }
    
    // Также вызываем при изменении размера окна
    window.addEventListener('resize', function() {
        // Сбрасываем флаги при изменении размера
        document.querySelectorAll('.document table').forEach(table => {
            delete table.dataset.columnsEqualized;
        });
        equalizeTableColumns();
    });

    // ============================================
    // Обертка таблиц для горизонтальной прокрутки на мобильных
    // ============================================
    
    function wrapTablesForMobile() {
        const tables = document.querySelectorAll('.document table');
        tables.forEach(table => {
            // Пропускаем, если уже обернута
            if (table.parentElement.classList.contains('table-wrapper')) {
                return;
            }
            
            // Пропускаем, если таблица уже внутри обертки
            if (table.closest('.table-wrapper')) {
                return;
            }
            
            // Создаем обертку
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            
            // Вставляем обертку перед таблицей
            table.parentNode.insertBefore(wrapper, table);
            
            // Перемещаем таблицу в обертку
            wrapper.appendChild(table);
        });
    }
    
    // Вызываем после загрузки DOM
    function initTableWrappers() {
        wrapTablesForMobile();
        // Повторяем через небольшую задержку для надежности
        setTimeout(wrapTablesForMobile, 50);
        setTimeout(wrapTablesForMobile, 200);
        setTimeout(wrapTablesForMobile, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableWrappers);
    } else {
        initTableWrappers();
    }
    
    // Также вызываем при изменении размера окна
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
    
    // Также пробуем еще раз через небольшую задержку на случай, если элементы загружаются позже
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
            // Если меню уже есть, инициализируем раскрывающееся меню
            initCollapsibleMenu();
        }
    }, 500);
    
    window.addEventListener('resize', handleResize);

    // Бургер-меню для внутренних страниц
    
    // Принудительное добавление бургер-меню
    function forceAddBurger() {
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        const headerRight = document.querySelector('.custom-header .header-right');
        if (!headerRight) {
            return;
        }
        
        // Проверяем, есть ли уже бургер
        let burgerToggle = document.getElementById('burgerToggle');
        
        // Если бургера нет, создаем его
        if (!burgerToggle) {
            burgerToggle = document.createElement('button');
            burgerToggle.className = 'burger-menu-toggle';
            burgerToggle.id = 'burgerToggle';
            burgerToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            
            // Вставляем бургер в header-right перед кнопкой "Войти" или в конец
            const btnLogin = headerRight.querySelector('.btn-login');
            if (btnLogin) {
                headerRight.insertBefore(burgerToggle, btnLogin.nextSibling);
            } else {
                headerRight.appendChild(burgerToggle);
            }
        }
        
        // Применяем стили для отображения бургер-меню
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
            
            // Убеждаемся, что span видны
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
        
        // Добавляем/показываем бургер-меню
        const burgerToggle = forceAddBurger();
        
        if (!burgerToggle) {
            return;
        }
        
        const floatingTocPage = document.getElementById('floatingTocPage');
        const logoLink = document.querySelector('.custom-header .logo-link');
        const leftNav = document.getElementById('leftNav');
        
        // Функция для показа/скрытия бургера
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
        
        // Принудительно показываем бургер
        updateBurgerVisibility();
        
        // Обновляем при изменении размера окна
        window.addEventListener('resize', updateBurgerVisibility);

        // Создаем overlay для меню
        function createOverlay() {
            let overlay = document.querySelector('.left-nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'left-nav-overlay';
                document.body.appendChild(overlay);
            }
            return overlay;
        }

        // Бургер открывает правое меню (floating-toc-page)
        if (burgerToggle && floatingTocPage) {
            const overlay = createOverlay();
            
            // Флаг для предотвращения закрытия меню при клике на ссылку
            let preventMenuClose = false;
            
            // Инициализируем обработчики для правого меню при открытии
            function initRightMenuHandlers() {
                // Убеждаемся, что initFloatingToc вызывается для обработки ссылок
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
                    // Инициализируем обработчики при открытии меню
                    setTimeout(initRightMenuHandlers, 50);
                }
            });

            overlay.addEventListener('click', function(e) {
                // Не закрываем меню, если клик был по ссылке внутри меню или внутри самого меню
                const clickedLink = e.target.closest('a');
                const isClickOnLinkInMenu = clickedLink && floatingTocPage.contains(clickedLink);
                const isClickInsideMenu = floatingTocPage.contains(e.target);
                
                if (isClickInsideMenu || isClickOnLinkInMenu) {
                    // Если клик внутри меню, не закрываем
                    e.stopPropagation();
                    return;
                }
                
                if (preventMenuClose) {
                    return;
                }
                
                // Закрываем меню только если клик был по overlay, а не по меню
                floatingTocPage.classList.remove('active');
                overlay.classList.remove('active');
                burgerToggle.classList.remove('active');
            });

            // Используем обработчик document с проверкой флага
            // Используем capture фазу, чтобы проверить флаг ДО того, как событие дойдет до других обработчиков
            document.addEventListener('click', function(e) {
                // Сначала проверяем, является ли клик по ссылке внутри меню
                const clickedLink = e.target.closest('a');
                const isClickOnLinkInMenu = clickedLink && floatingTocPage.contains(clickedLink);
                
                // Если клик по ссылке в меню, устанавливаем флаг сразу
                if (isClickOnLinkInMenu) {
                    preventMenuClose = true;
                    // Сбрасываем флаг через некоторое время
                    setTimeout(function() {
                        preventMenuClose = false;
                    }, 500);
                    return; // Не закрываем меню
                }
                
                // Проверяем флаг сразу
                if (preventMenuClose) {
                    return;
                }
                
                // Небольшая задержка, чтобы обработчик ссылки успел обработать клик
                setTimeout(function() {
                    // Проверяем флаг еще раз после задержки
                    if (preventMenuClose) {
                        preventMenuClose = false; // Сбрасываем флаг
                        return;
                    }
                    
                    if (floatingTocPage && floatingTocPage.classList.contains('active')) {
                        // Проверяем, что клик не внутри меню и не по ссылке внутри меню
                        const isClickInsideMenu = floatingTocPage.contains(e.target);
                        const isClickOnBurger = burgerToggle.contains(e.target);
                        const isClickOnOverlay = e.target === overlay;
                        const clickedLink2 = e.target.closest('a');
                        const isClickOnLink = clickedLink2 && floatingTocPage.contains(clickedLink2);
                        const isClickOnLinkParent = e.target.closest('li') && floatingTocPage.contains(e.target.closest('li'));
                        
                        // Не закрываем меню, если клик внутри меню, по ссылке или по родителю ссылки
                        if (!isClickInsideMenu && !isClickOnBurger && !isClickOnOverlay && !isClickOnLink && !isClickOnLinkParent) {
                            floatingTocPage.classList.remove('active');
                            overlay.classList.remove('active');
                            burgerToggle.classList.remove('active');
                        }
                    }
                }, 100); // Увеличиваем задержку до 100ms
            }, true); // Используем capture фазу
            
            // Сохраняем функцию для установки флага
            window._setPreventMenuClose = function(value) {
                preventMenuClose = value;
            };
        }

        // Dropdown "Документация" открывает левое меню
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

        // Функция закрытия левого меню при клике на ссылку отключена
        // Левое меню больше не закрывается при клике на элемент
        
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
        
        // Проверяем сразу и при изменении размера
        ensureBurgerVisible();
        setTimeout(ensureBurgerVisible, 100);
        setTimeout(ensureBurgerVisible, 300);
        setTimeout(ensureBurgerVisible, 500);
        setTimeout(ensureBurgerVisible, 1000);
        window.addEventListener('resize', ensureBurgerVisible);
    }

    // Инициализируем бургер-меню после загрузки DOM
    function initBurgerMenuWrapper() {
        // Проверяем, что это не главная страница
        if (document.body.classList.contains('homepage')) {
            return;
        }
        
        initBurgerMenu();
        
        // Обновление бургер-меню с задержками для надежности
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
        
        // Также при изменении размера окна
        window.addEventListener('resize', function() {
            setTimeout(forceAddBurger, 50);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBurgerMenuWrapper);
    } else {
        initBurgerMenuWrapper();
    }
    
    // Также пробуем еще раз через задержку
    setTimeout(initBurgerMenuWrapper, 500);
    setTimeout(initBurgerMenuWrapper, 1000);
})();
