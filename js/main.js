// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initParallaxSlider();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
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

    // Handle scroll events for navbar
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
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

// Parallax Slider
function initParallaxSlider() {
    const slides = document.querySelectorAll('.parallax-slide');
    const dotsContainer = document.querySelector('.slide-dots');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let isAnimating = false;
    let autoSlideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => !isAnimating && goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Initialize first slide
    slides[0].classList.add('active');

    function updateSlides() {
        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        currentSlide = index;
        updateSlides();
        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    }

    function nextSlide() {
        if (isAnimating) return;
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        if (isAnimating) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    const heroSection = document.querySelector('.hero-parallax');
    
    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) { // Minimum swipe distance
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    }, { passive: true });

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Pause auto slide on hover
    heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    heroSection.addEventListener('mouseleave', startAutoSlide);
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const closeMenuBtn = document.querySelector('.mobile-close-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Handle mobile menu links
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}
// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    // General animations for sections
    const fadeElements = document.querySelectorAll('.fade-in, .service-card, .team-showcase, .about-content');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Stagger animation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceCards.forEach(card => serviceObserver.observe(card));
}

// Counter Animations
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth counting
            const easeOutQuad = progress => 1 - (1 - progress) * (1 - progress);
            const easedProgress = easeOutQuad(progress);

            const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
            counter.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));
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

// About Section Tabs
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

// Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200); // Stagger animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => observer.observe(item));
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            // Validate form
            if (!validateForm(form)) return;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();

            // Reset floating labels
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
