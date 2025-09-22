/**
 * Component Loader for Sanwariya Mitra Mandal Website
 * This script loads reusable HTML components into pages
 */

(function() {
    'use strict';

    // Component loader function
    function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID '${elementId}' not found`);
            return;
        }

        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                
                // Set active navigation item
                if (elementId === 'header-component') {
                    setActiveNavigation();
                }
                
                // Initialize mobile navigation after mobile nav component is loaded
                if (elementId === 'mobile-nav-component') {
                    // Delay initialization to ensure all DOM elements are ready
                    //setTimeout(() => {
                        initializeMobileNav();
                    //}, 100);
                }
                
                // Trigger custom event for component loaded
                const event = new CustomEvent('componentLoaded', { 
                    detail: { elementId, componentPath } 
                });
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error(`Error loading component ${componentPath}:`, error);
                element.innerHTML = `<!-- Component ${componentPath} failed to load -->`;
            });
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
        // Copy main navigation to mobile navigation
        const mainNav = document.querySelector('.main-menu__list');
        const mobileNavContainer = document.querySelector('.mobile-nav__container');
        
        if (mainNav && mobileNavContainer && !mobileNavContainer.hasChildNodes()) {
            const mobileNav = mainNav.cloneNode(true);
            mobileNav.className = 'mobile-nav__list list-unstyled';
            mobileNavContainer.appendChild(mobileNav);
        }
        
        // Initialize mobile navigation event handlers
        initializeMobileNavEvents();
    }
    
    // Initialize mobile navigation event handlers
    function initializeMobileNavEvents() {
        // Check if events are already initialized
        if (window.mobileNavEventsInitialized) {
            console.log('Mobile navigation events already initialized');
            return;
        }
        
        // Remove existing event listeners to prevent duplicates
        const togglers = document.querySelectorAll('.mobile-nav__toggler');
        
        togglers.forEach(toggler => {
            // Remove any existing event listeners
            const newToggler = toggler.cloneNode(true);
            toggler.parentNode.replaceChild(newToggler, toggler);
        });
        
        // Add fresh event listeners with animation prevention
        const newTogglers = document.querySelectorAll('.mobile-nav__toggler');
        newTogglers.forEach(toggler => {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const mobileNavWrapper = document.querySelector('.mobile-nav__wrapper');
                //const mobileNavOverlay = document.querySelector('.mobile-nav__overlay');
                const body = document.body;
                
                if (mobileNavWrapper && !mobileNavWrapper.classList.contains('animating')) {
                    // Prevent double animation
                    //mobileNavWrapper.classList.add('animating');
                    
                    // Toggle classes
                    mobileNavWrapper.classList.toggle('expanded');
                    // if (mobileNavOverlay) {
                    //     mobileNavOverlay.classList.toggle('active');
                    // }
                    body.classList.toggle('locked');
                    
                    // Remove animating class after animation completes
                    // setTimeout(() => {
                    //     mobileNavWrapper.classList.remove('animating');
                    // }, 400);
                }
            });
        });
        
        // Add overlay click to close
        const overlay = document.querySelector('.mobile-nav__overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                const mobileNavWrapper = document.querySelector('.mobile-nav__wrapper');
                const body = document.body;
                
                if (mobileNavWrapper && mobileNavWrapper.classList.contains('expanded')) {
                    mobileNavWrapper.classList.remove('expanded');
                    overlay.classList.remove('active');
                    body.classList.remove('locked');
                }
            });
        }
        
        // Mark as initialized
        window.mobileNavEventsInitialized = true;
        console.log('Mobile navigation events initialized');
    }

    // Initialize components when DOM is ready
    function initializeComponents() {
        // Load all components
        loadComponent('header-component', 'components/header.html');
        loadComponent('footer-component', 'components/footer.html');
        loadComponent('mobile-nav-component', 'components/mobile-nav.html');
        loadComponent('sidebar-component', 'components/sidebar.html');
        loadComponent('common-elements-component', 'components/common-elements.html');
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }

    // Update dynamic year in footer
    document.addEventListener('componentLoaded', function(e) {
        if (e.detail.elementId === 'footer-component') {
            const yearElement = document.querySelector('.dynamic-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        }
    });

})();
