document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMobileMenu() {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        
        // Use transform for better performance
        if (!isExpanded) {
            mobileMenu.classList.remove('hidden');
            // Use RAF to ensure the display change has taken effect
            requestAnimationFrame(() => {
                mobileMenu.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden';
                // Enable smooth scrolling on iOS
                mobileMenu.style.webkitOverflowScrolling = 'touch';
            });
        } else {
            mobileMenu.classList.add('translate-x-full');
            // Wait for transition to complete before hiding
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Toggle icons with transition
        const closedIcon = document.getElementById('menu-closed-icon');
        const openIcon = document.getElementById('menu-open-icon');
        
        if (!isExpanded) {
            closedIcon.style.transform = 'scale(0)';
            openIcon.style.transform = 'scale(1)';
        } else {
            closedIcon.style.transform = 'scale(1)';
            openIcon.style.transform = 'scale(0)';
        }
        
        closedIcon.classList.toggle('hidden');
        openIcon.classList.toggle('hidden');
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

    // Desktop dropdown menu functionality
    const dropdownButtons = document.querySelectorAll('.dropdown-button');
    let currentlyOpenDropdown = null;

    function closeDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const button = document.querySelector(`[data-dropdown-button="${dropdownId}"]`);
        const container = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);

        if (dropdown && button && container) {
            dropdown.classList.remove('dropdown-open');
            button.setAttribute('aria-expanded', 'false');
            container.classList.remove('dropdown-active');
        }
    }

    function openDropdown(dropdownId) {
        // Close any currently open dropdown
        if (currentlyOpenDropdown && currentlyOpenDropdown !== dropdownId) {
            closeDropdown(currentlyOpenDropdown);
        }

        const dropdown = document.getElementById(dropdownId);
        const button = document.querySelector(`[data-dropdown-button="${dropdownId}"]`);
        const container = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);

        if (dropdown && button && container) {
            dropdown.classList.add('dropdown-open');
            button.setAttribute('aria-expanded', 'true');
            container.classList.add('dropdown-active');
            currentlyOpenDropdown = dropdownId;
        }
    }

    function toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown && dropdown.classList.contains('dropdown-open')) {
            closeDropdown(dropdownId);
            currentlyOpenDropdown = null;
        } else {
            openDropdown(dropdownId);
        }
    }

    // Add click handlers to dropdown buttons
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const dropdownId = button.getAttribute('data-dropdown-button');
            toggleDropdown(dropdownId);
        });
    });

    // Close dropdown when mouse leaves the container
    document.querySelectorAll('.dropdown-container').forEach(container => {
        container.addEventListener('mouseleave', () => {
            const dropdownId = container.getAttribute('data-dropdown-id');
            if (currentlyOpenDropdown === dropdownId) {
                closeDropdown(dropdownId);
                currentlyOpenDropdown = null;
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (currentlyOpenDropdown) {
            const container = document.querySelector(`[data-dropdown-id="${currentlyOpenDropdown}"]`);
            if (container && !container.contains(event.target)) {
                closeDropdown(currentlyOpenDropdown);
                currentlyOpenDropdown = null;
            }
        }
    });

    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && currentlyOpenDropdown) {
            closeDropdown(currentlyOpenDropdown);
            currentlyOpenDropdown = null;
        }
    });

    // Keyboard navigation for dropdown menus
    dropdownButtons.forEach(button => {
        button.addEventListener('keydown', (event) => {
            const dropdownId = button.getAttribute('data-dropdown-button');
            const dropdown = document.getElementById(dropdownId);

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                openDropdown(dropdownId);
                // Focus first link in dropdown
                const firstLink = dropdown?.querySelector('a');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        });
    });

    // Allow arrow key navigation within dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        const links = dropdown.querySelectorAll('a');
        links.forEach((link, index) => {
            link.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    const nextLink = links[index + 1];
                    if (nextLink) {
                        nextLink.focus();
                    }
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    if (index === 0) {
                        // Focus back on the button
                        const dropdownId = dropdown.id;
                        const button = document.querySelector(`[data-dropdown-button="${dropdownId}"]`);
                        if (button) {
                            button.focus();
                        }
                    } else {
                        const prevLink = links[index - 1];
                        if (prevLink) {
                            prevLink.focus();
                        }
                    }
                }
            });
        });
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

    // Add touch event handling for iOS
    let touchStartY = 0;
    mobileMenu.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mobileMenu.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const scrollTop = mobileMenu.scrollTop;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + mobileMenu.offsetHeight >= mobileMenu.scrollHeight;
        
        // Prevent overscroll only when at the boundaries
        if ((isAtTop && touchY > touchStartY) || (isAtBottom && touchY < touchStartY)) {
            e.preventDefault();
        }
    }, { passive: false });
});
