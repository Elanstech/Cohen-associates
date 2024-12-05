// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initLocomotiveScroll();
    initNavigation();
    initMobileMenu();
    initParallaxEffects();
    initRevealAnimations();
    initCounterAnimation();
    initFormInteractions();
    initSmoothAnchors();
});

// Loader Animation
function initLoader() {
    const loader = document.querySelector('.loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            document.body.classList.remove('loading');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 1000);
    });
}

// Locomotive Scroll Configuration
function initLocomotiveScroll() {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 0.8,
        lerp: 0.1,
        getDirection: true,
        mobile: {
            smooth: false
        },
        tablet: {
            smooth: false,
            breakpoint: 992
        }
    });

    // Update locomotive scroll on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            scroll.update();
        }, 250);
    });

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                scroll.scrollTo(target);
            }
        });
    });

    return scroll;
}

// Navigation Functionality
function initNavigation() {
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo-mark');
    let lastScroll = 0;

    function updateNavigation() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            header.classList.add('scrolled');
            if (logo) logo.style.transform = 'scale(0.8)';
        } else {
            header.classList.remove('scrolled');
            if (logo) logo.style.transform = 'scale(1)';
        }

        // Hide/show header on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    }

    // Active link updating
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const currentPos = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentPos >= sectionTop && currentPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavigation();
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const menuTrigger = document.querySelector('.menu-trigger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');

    function toggleMenu() {
        menuTrigger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    menuTrigger.addEventListener('click', toggleMenu);
    closeButton.addEventListener('click', toggleMenu);

    // Close menu on link click and smooth scroll
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
            
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuTrigger.contains(e.target)) {
            toggleMenu();
        }
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-scroll-speed]');
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-scroll-speed');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const yPos = -(scrolled * speed) / 10;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// Reveal Animations
function initRevealAnimations() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.reveal-text, .fade-in, .slide-up').forEach(element => {
        observer.observe(element);
    });
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.round(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// Form Interactions
function initFormInteractions() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const formGroups = form.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');

        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            if (input.value) {
                group.classList.add('filled');
            } else {
                group.classList.remove('filled');
            }
        });

        if (input.value) {
            group.classList.add('filled');
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(form)) return;

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showNotification('Message sent successfully!', 'success');
            form.reset();
            formGroups.forEach(group => group.classList.remove('filled'));
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        removeError(group);

        if (!field.value.trim()) {
            isValid = false;
            showError(group, 'This field is required');
        } else if (field.type === 'email' && !emailRegex.test(field.value)) {
            isValid = false;
            showError(group, 'Please enter a valid email address');
        }
    });

    return isValid;
}

// Helper Functions
function showError(group, message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    group.appendChild(error);
}

function removeError(group) {
    const existingError = group.querySelector('.error-message');
    if (existingError) existingError.remove();
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Smooth Scroll for Anchor Links
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
