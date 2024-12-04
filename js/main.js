// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initCircleStats();
    initScrollTop();
    initContactForm();
    initAboutTabs();
    initTimelineAnimation();
});

// Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 500);
    });
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
                
                const offset = navbar.offsetHeight;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const closeMenuBtn = document.querySelector('.mobile-close-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            toggleMenu();
        }
    });
}

// Circle Stats Animation
function initCircleStats() {
    const circles = document.querySelectorAll('.progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const value = circle.getAttribute('data-value');
                const circumference = 2 * Math.PI * 54; // radius = 54
                const offset = circumference - (value / 100 * circumference);
                
                // Animate the circle
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference;
                
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 100);
                
                observer.unobserve(circle);
            }
        });
    }, {
        threshold: 0.5
    });

    circles.forEach(circle => observer.observe(circle));
}

// Scroll Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .team-member, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));
}

// Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => observer.observe(item));
}

// About Tabs
function initAboutTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);

        activeButton.classList.add('active');
        activeContent.style.display = 'block';
        
        // Trigger reflow to ensure animation plays
        void activeContent.offsetWidth;
        activeContent.classList.add('active');
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize first tab
    if (tabButtons.length > 0) {
        const firstTabId = tabButtons[0].getAttribute('data-tab');
        switchTab(firstTabId);
    }
}

// Scroll to Top
function initScrollTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            if (!validateForm(form)) return;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();

            form.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                input.classList.remove('has-value');
            });
        } catch (error) {
            showFormMessage('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    // Handle floating labels
    form.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.toggle('has-value', input.value.trim() !== '');
        });
    });
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showInputError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            showInputError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });

    return isValid;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorDiv = formGroup.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    input.classList.add('error');

    input.addEventListener('input', function removeError() {
        input.classList.remove('error');
        errorDiv.remove();
        input.removeEventListener('input', removeError);
    });
}

function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Initialize everything when page loads
window.addEventListener('load', () => {
    document.body.classList.remove('no-scroll');
});
