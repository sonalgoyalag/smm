/**
 * Optimized Component Loader for Sanwariya Mitra Mandal Website
 * Performance improvements: Parallel loading, caching, error handling
 */

(function() {
    'use strict';

    // Cache for loaded components
    const componentCache = new Map();
    
    // Component configurations
    const components = [
        { id: 'header-component', path: 'components/header.html', priority: 1 },
        { id: 'footer-component', path: 'components/footer.html', priority: 2 },
        { id: 'mobile-nav-component', path: 'components/mobile-nav.html', priority: 3 },
        { id: 'sidebar-component', path: 'components/sidebar.html', priority: 4 },
        { id: 'common-elements-component', path: 'components/common-elements.html', priority: 5 }
    ];

    // Load component with caching and error handling
    async function loadComponentOptimized(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) {
            return Promise.resolve(); // Skip missing elements silently
        }

        try {
            // Check cache first
            if (componentCache.has(componentPath)) {
                const cachedHtml = componentCache.get(componentPath);
                element.innerHTML = cachedHtml;
                triggerComponentLoaded(elementId, componentPath);
                return Promise.resolve();
            }

            // Fetch with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(componentPath, {
                signal: controller.signal,
                cache: 'force-cache' // Use browser cache when possible
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            
            // Cache the component
            componentCache.set(componentPath, html);
            
            // Insert HTML
            element.innerHTML = html;
            
            // Handle post-load actions
            triggerComponentLoaded(elementId, componentPath);
            
            return Promise.resolve();

        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn(`Component ${componentPath} timed out`);
            } else {
                console.warn(`Failed to load component ${componentPath}:`, error.message);
            }
            
            // Set fallback content
            element.innerHTML = `<!-- Component ${componentPath} failed to load -->`;
            return Promise.resolve(); // Don't reject to avoid breaking other components
        }
    }

    // Trigger component loaded events and handle specific component actions
    function triggerComponentLoaded(elementId, componentPath) {
        // Set active navigation item
        if (elementId === 'header-component') {
            // Use requestAnimationFrame to defer DOM manipulation
            requestAnimationFrame(() => {
                setActiveNavigation();
            });
        }
        
        // Initialize mobile navigation
        if (elementId === 'mobile-nav-component') {
            requestAnimationFrame(() => {
                initializeMobileNav();
            });
        }
        
        // Update dynamic year
        if (elementId === 'footer-component') {
            requestAnimationFrame(() => {
                updateDynamicYear();
            });
        }
        
        // Dispatch custom event
        const event = new CustomEvent('componentLoaded', { 
            detail: { elementId, componentPath } 
        });
        document.dispatchEvent(event);
    }

    // Set active navigation item based on current page
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.main-menu__list .nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('current');
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === currentPage) {
                item.classList.add('current');
            }
        });
    }

    // Initialize mobile navigation
    function initializeMobileNav() {
        const mainNav = document.querySelector('.main-menu__list');
        const mobileNavContainer = document.querySelector('.mobile-nav__container');
        
        if (mainNav && mobileNavContainer && !mobileNavContainer.hasChildNodes()) {
            const mobileNav = mainNav.cloneNode(true);
            mobileNav.className = 'mobile-nav__list list-unstyled';
            mobileNavContainer.appendChild(mobileNav);
        }
    }

    // Update dynamic year in footer
    function updateDynamicYear() {
        const yearElement = document.querySelector('.dynamic-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Load all components in parallel with priority order
    async function initializeComponents() {
        // Sort by priority
        const sortedComponents = [...components].sort((a, b) => a.priority - b.priority);
        
        // Load high priority components first (header, footer)
        const highPriorityPromises = sortedComponents
            .filter(comp => comp.priority <= 2)
            .map(comp => loadComponentOptimized(comp.id, comp.path));
        
        // Load low priority components after high priority ones start
        const lowPriorityPromises = sortedComponents
            .filter(comp => comp.priority > 2)
            .map(comp => loadComponentOptimized(comp.id, comp.path));

        try {
            // Wait for high priority components
            await Promise.all(highPriorityPromises);
            
            // Load low priority components in parallel (don't wait)
            Promise.all(lowPriorityPromises).catch(console.warn);
            
        } catch (error) {
            console.warn('Some high-priority components failed to load:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        // Use setTimeout to avoid blocking the main thread
        setTimeout(initializeComponents, 0);
    }

    // Preload components on hover (for better perceived performance)
    document.addEventListener('mouseenter', function(e) {
        if (e.target.matches('a[href$=".html"]')) {
            const href = e.target.getAttribute('href');
            // Preload the page in the background
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        }
    }, true);

})();
