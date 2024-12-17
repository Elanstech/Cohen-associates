// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
        easing: 'ease-out'
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-links a');
    const overlay = document.createElement('div');
    overlay.classList.add('mobile-menu-overlay');
    document.body.appendChild(overlay);

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        overlay.classList.toggle('active');
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
    overlay.addEventListener('click', toggleMenu);
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
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
    });
}

// Stats Counter Animation
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
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

// Handle floating cards animation
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize parallax effect for hero image
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });
}

// Form validation
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
                // Submit form
                submitForm(data);
                form.reset();
                showSuccessMessage();
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
        const error = document.createElement('div');
        error.classList.add('form-error');
        error.textContent = message;
        input.parentNode.appendChild(error);
    });
}

// Form submission
async function submitForm(data) {
    try {
        const response = await fetch('your-api-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Handle success
        showSuccessMessage();
    } catch (error) {
        console.error('Error:', error);
        // Handle error
        showErrors({
            general: 'There was an error sending your message. Please try again later.'
        });
    }
}

// Initialize everything on load
window.addEventListener('load', () => {
    // Remove loader
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Show page content
    document.body.classList.remove('loading');
});
