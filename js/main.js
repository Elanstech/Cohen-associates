// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollEffects();
    initMobileMenu();
    initStickyHeader();
    initAnimations();
    initFAQ();
    initFormValidation();
    initSmoothScroll();
    initCounters();
});

// Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            // Start page animations after loader is gone
            document.body.classList.add('page-loaded');
            initAOS();
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

// Scroll Effects
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        // Header scroll effects
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
        
        // Parallax effects
        handleParallax();
    }, 50));
}

// Parallax Effect
function handleParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.2;
        const scroll = window.pageYOffset;
        element.style.transform = `translateY(${scroll * speed}px)`;
    });
}

/* Mobile Menu JS Fix */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    // Create overlay div if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', toggleMenu);
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
        
        // Close menu when clicking links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }
    
    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        overlay.classList.toggle('active');
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    const offset = header.offsetHeight;
    
    const stickyHeader = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        },
        { rootMargin: `-${offset}px 0px 0px 0px` }
    );
    
    // Observe a sentinel element at the top of the page
    const sentinel = document.createElement('div');
    document.body.prepend(sentinel);
    stickyHeader.observe(sentinel);
}

// Animate Elements
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    animatedElements.forEach(element => observer.observe(element));
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const faqAnswer = faq.querySelector('.faq-answer');
                faqAnswer.style.maxHeight = null;
            });
            
            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Form Validation for Mailto
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Check if it's a mailto form
        const isMailtoForm = form.action.indexOf('mailto:') !== -1;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                if (isMailtoForm) {
                    handleMailtoFormSubmit(form);
                } else {
                    handleFormSubmit(form);
                }
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    });
}

function handleMailtoFormSubmit(form) {
    // Get form values
    const name = form.querySelector('#name')?.value || '';
    const email = form.querySelector('#email')?.value || '';
    const phone = form.querySelector('#phone')?.value || '';
    const message = form.querySelector('#message')?.value || '';
    
    // Create email subject and body
    const subject = `Contact form submission from ${name}`;
    const body = `Name: ${name}%0D%0A%0D%0AEmail: ${email}%0D%0A%0D%0APhone: ${phone}%0D%0A%0D%0AMessage:%0D%0A${message.replace(/\n/g, '%0D%0A')}`;
    
    // Extract the email address from the form's action attribute
    const mailtoAddress = form.action.replace('mailto:', '').split('?')[0];
    
    // Create the mailto URL
    const mailtoUrl = `mailto:${mailtoAddress}?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // Show a success message
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening email client...';
    
    showFormMessage(form, 'success', 'Opening your email client...');
    
    // Open the email client after a short delay
    setTimeout(() => {
        window.location.href = mailtoUrl;
        
        // Reset the button after the window location changes
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }, 1000);
    }, 800);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(input) {
    const formGroup = input.closest('.form-group');
    let isValid = true;
    
    // Clear previous errors
    formGroup.classList.remove('error');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
        showError(input, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Phone validation
    if (input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(input.value)) {
            showError(input, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
}

async function handleFormSubmit(form) {
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showFormMessage(form, 'success', 'Thank you! Your message has been sent successfully.');
        form.reset();
        
    } catch (error) {
        showFormMessage(form, 'error', 'Sorry, something went wrong. Please try again later.');
        
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

function showFormMessage(form, type, message) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    form.appendChild(messageElement);
    
    setTimeout(() => {
        if (messageElement.parentNode === form) {
            messageElement.remove();
        }
    }, 5000);
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            // Only process if the href is a valid ID selector
            if (href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const headerOffset = document.querySelector('.header').offsetHeight;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.dataset.target);
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

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const overlay = document.querySelector('.menu-overlay');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
}, 250));

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
