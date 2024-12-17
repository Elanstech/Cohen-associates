// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStats();
    initFAQ();
    initFormLabels();
    initSmoothScroll();
    initFloatingCards();
    initParallax();
    initFormValidation();
    initIntersectionObserver();
});

// Page Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        document.body.classList.remove('loading');
        
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });
}

// Initialize AOS (Animate on Scroll)
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out',
        disable: window.innerWidth < 768
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-links a');
    const body = document.body;

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            scrollToSection(link.getAttribute('href'));
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    const scrollTrigger = 100;
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > scrollTrigger) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }, 50);
    });
}

// Stats Counter Animation
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.round(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                faqAnswer.style.height = '0px';
            });

            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';
            }
        });
    });
}

// Form Labels Animation
function initFormLabels() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        if (!input || !label) return;

        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            if (input.value.trim()) {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });

        // Set initial state
        if (input.value.trim()) {
            group.classList.add('has-value');
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(anchor.getAttribute('href'));
        });
    });
}

function scrollToSection(href) {
    const target = document.querySelector(href);
    if (!target) return;

    const headerHeight = document.querySelector('.header').offsetHeight;
    const elementPosition = target.offsetTop;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Floating Cards Animation
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });

    // Add hover effect pause
    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.animationPlayState = 'paused';
        });

        card.addEventListener('mouseout', () => {
            card.style.animationPlayState = 'running';
        });
    });
}

// Parallax Effect
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    
    if (window.innerWidth > 768) { // Only on desktop
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        });
    }
}

// Form Validation
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            const errors = {};
            
            if (!data.name || data.name.trim() === '') {
                errors.name = 'Name is required';
                isValid = false;
            }
            
            if (!data.email || !isValidEmail(data.email)) {
                errors.email = 'Valid email is required';
                isValid = false;
            }
            
            if (!data.message || data.message.trim() === '') {
                errors.message = 'Message is required';
                isValid = false;
            }
            
            if (isValid) {
                // Success handling
                showSuccessMessage();
                form.reset();
                resetFormStyles();
            } else {
                showErrors(errors);
            }
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showSuccessMessage() {
    const existingSuccess = document.querySelector('.form-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successMessage = document.createElement('div');
    successMessage.classList.add('form-success');
    successMessage.textContent = 'Thank you for your message. We\'ll be in touch soon!';
    
    const form = document.querySelector('.contact-form form');
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

function showErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    
    // Add new error messages
    Object.entries(errors).forEach(([field, message]) => {
        const input = document.querySelector(`[name="${field}"]`);
        const formGroup = input.closest('.form-group');
        
        const error = document.createElement('div');
        error.classList.add('form-error');
        error.textContent = message;
        
        formGroup.appendChild(error);
        formGroup.classList.add('has-error');
    });
}

function resetFormStyles() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error', 'has-value', 'focused');
    });
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up, .fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    elements.forEach(element => observer.observe(element));
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
});

// Prevent form submission on Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Handle form submission errors gracefully
window.addEventListener('unhandledrejection', event => {
    console.error('Form submission error:', event.reason);
    showErrors({ general: 'An error occurred. Please try again later.' });
});
