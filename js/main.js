// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading sequence
    initLoader();
    
    // Initialize all features
    initNavigation();
    initParallax();
    initAnimations();
    initScrollProgress();
    initCounters();
    initContactForm();
    initScrollTop();
});

// Loading Sequence
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 500);
    });
}

// Navigation
function initNavigation() {
    const nav = document.querySelector('.nav-wrapper');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    // Mobile menu toggle
    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Scroll event for navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.classList.remove('no-scroll');

            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const offset = window.scrollY * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    });
}

// Animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-scroll]');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => observer.observe(element));
}

// Scroll Progress
function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progress.style.width = `${scrolled}%`;
    });
}

// Number Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    entry.target.textContent = Math.round(current);

                    if (current < target) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                // Form validation
                if (!validateForm(data)) return;
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showFormMessage('Message sent successfully!', 'success');
                form.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
            } catch (error) {
                showFormMessage('An error occurred. Please try again.', 'error');
            }
        });
    }
}

// Form Validation
function validateForm(data) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!data.name?.trim()) {
        showInputError('name', 'Name is required');
        isValid = false;
    }

    if (!emailRegex.test(data.email?.trim())) {
        showInputError('email', 'Please enter a valid email');
        isValid = false;
    }

    if (data.phone && !phoneRegex.test(data.phone.trim())) {
        showInputError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    if (!data.message?.trim()) {
        showInputError('message', 'Message is required');
        isValid = false;
    }

    return isValid;
}

// Show Input Error
function showInputError(inputName, message) {
    const input = document.querySelector(`[name="${inputName}"]`);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    input.parentElement.appendChild(errorDiv);
    input.classList.add('error');

    // Remove error on input
    input.addEventListener('input', function() {
        this.classList.remove('error');
        errorDiv.remove();
    }, { once: true });
}

// Show Form Message
function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

// Scroll to Top
function initScrollTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, 100));

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
