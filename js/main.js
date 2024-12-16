// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStats();
    initFormValidation();
    initSmoothScroll();
    initFloatingCards();
});

// Page Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('loading');
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
    
    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
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

// Form Validation
function initFormValidation() {
    const form = document.querySelector('#contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            let isValid = true;
            const errors = {};
            
            // Validate name
            if (!data.name || data.name.trim() === '') {
                errors.name = 'Name is required';
                isValid = false;
            }
            
            // Validate email
            if (!data.email || !isValidEmail(data.email)) {
                errors.email = 'Valid email is required';
                isValid = false;
            }
            
            // Validate message
            if (!data.message || data.message.trim() === '') {
                errors.message = 'Message is required';
                isValid = false;
            }
            
            if (isValid) {
                // Submit form
                showSuccessMessage();
                form.reset();
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
    
    const form = document.querySelector('#contactForm');
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
