document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMobileMenu() {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle menu visibility
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icons
        document.getElementById('menu-closed-icon').classList.toggle('hidden');
        document.getElementById('menu-open-icon').classList.toggle('block');
        document.getElementById('menu-open-icon').classList.toggle('hidden');
        document.getElementById('menu-closed-icon').classList.toggle('block');
        
        // Prevent body scroll but allow menu scroll
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
            // Enable touch scrolling on iOS
            mobileMenu.style.webkitOverflowScrolling = 'touch';
            // Ensure menu is scrollable
            mobileMenu.style.overflow = 'auto';
            mobileMenu.style.height = `calc(100vh - 4rem)`;
        } else {
            document.body.style.overflow = '';
            mobileMenu.style.overflow = '';
            mobileMenu.style.webkitOverflowScrolling = '';
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!mobileMenu.classList.contains('hidden') && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuButton.contains(event.target)) {
            toggleMobileMenu();
        }
    });

    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });

    // Page Navigation functionality
    const pageNavs = document.querySelectorAll('[aria-label="Page Navigation"], [aria-label="FAQ Navigation"]');

    pageNavs.forEach(nav => {
        const navToggle = nav.querySelector('button');
        const navContent = nav.querySelector('div[id$="-nav-content"]');
        const navLinks = nav.querySelectorAll('a');
        const headings = document.querySelectorAll('h2[id]');
        const headerOffset = 100;

        // Toggle navigation
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Show navigation
                navContent.classList.remove('hidden');
                // Use setTimeout to ensure the display:block has taken effect
                setTimeout(() => {
                    navContent.classList.remove('opacity-0', 'translate-y-4');
                }, 10);
            } else {
                // Hide navigation
                navContent.classList.add('opacity-0', 'translate-y-4');
                // Wait for transition to complete before hiding
                setTimeout(() => {
                    navContent.classList.add('hidden');
                }, 200);
            }

            // Rotate arrow icon
            const arrow = navToggle.querySelector('svg');
            arrow.style.transform = isExpanded ? '' : 'rotate(180deg)';
        });

        // Close navigation when clicking outside
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target) && 
                !navContent.classList.contains('hidden')) {
                navToggle.click();
            }
        });

        // Close navigation when clicking a link
        // navLinks.forEach(link => {
        //     link.addEventListener('click', () => {
        //         navToggle.click();
        //     });
        // });

        // Helper function to determine if an element is in viewport
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            const nextElement = element.nextElementSibling?.tagName === 'H2' ? 
                element.nextElementSibling : null;
            
            // If there's a next heading, use it as the bottom boundary
            const bottomBoundary = nextElement ? 
                nextElement.getBoundingClientRect().top : 
                document.documentElement.clientHeight;

            return (
                (rect.top <= headerOffset && rect.bottom > headerOffset) || // Element spans the offset line
                (rect.top > headerOffset && rect.top < bottomBoundary) // Element is below offset but before next heading
            );
        };

        // Update active section
        const updateActiveSection = () => {
            let currentHeading = null;
            
            // Find the current heading
            for (const heading of headings) {
                if (isInViewport(heading)) {
                    currentHeading = heading;
                    break;
                }
            }

            // If no heading is in viewport, find the last heading above viewport
            if (!currentHeading) {
                for (let i = headings.length - 1; i >= 0; i--) {
                    const rect = headings[i].getBoundingClientRect();
                    if (rect.top <= headerOffset) {
                        currentHeading = headings[i];
                        break;
                    }
                }
            }

            navLinks.forEach(link => {
                const href = link.getAttribute('href').substring(1);
                if (currentHeading && href === currentHeading.id) {
                    link.classList.add('text-aurelia', 'border-aurelia', 'font-medium');
                    link.classList.remove('text-gray-600', 'border-transparent');
                    
                    // Scroll the active link into view if nav is open
                    if (!navContent.classList.contains('hidden')) {
                        // Calculate the link's position relative to the nav container
                        const linkRect = link.getBoundingClientRect();
                        const navRect = navContent.getBoundingClientRect();
                        const isVisible = (
                            linkRect.top >= navRect.top &&
                            linkRect.bottom <= navRect.bottom
                        );
                        
                        if (!isVisible) {
                            // Scroll with a small offset for better visibility
                            const scrollOffset = 60;
                            const targetScroll = link.offsetTop - scrollOffset;
                            navContent.scrollTo({
                                top: targetScroll,
                                behavior: 'smooth'
                            });
                        }
                    }
                } else {
                    link.classList.remove('text-aurelia', 'border-aurelia', 'font-medium');
                    link.classList.add('text-gray-600', 'border-transparent');
                }
            });
        };

        // Smooth scroll to section on click
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href').substring(1);
                const heading = document.getElementById(id);
                if (heading) {
                    const elementPosition = heading.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Force update active section after scroll
                    setTimeout(updateActiveSection, 100);
                }
            });
        });

        // Update active section on scroll with debounce
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                updateActiveSection();
            });
        }, { passive: true });

        // Initial check for active section
        updateActiveSection();
    });
});
