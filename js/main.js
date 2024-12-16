// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStats();
    initHeroSlider();
    initFAQ();
    initFormValidation();
    initSmoothScroll();
    initFloatingCards();
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

// Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds between slides
    let slideTimer;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideTimer() {
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    function resetSlideTimer() {
        clearInterval(slideTimer);
        startSlideTimer();
    }

    if (slides.length > 0) {
        // Event listeners for buttons
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlideTimer();
            });

            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlideTimer();
            });
        }

        // Start automatic slideshow
        startSlideTimer();
    }
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

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                // If it's a contact form with mailto
                if (form.action.includes('mailto')) {
                    const formData = new FormData(form);
                    const mailtoLink = constructMailtoLink(formData);
                    window.location.href = mailtoLink;
                }
                
                showSuccessMessage(form);
                form.reset();
            }
        });

        // Initialize floating labels
        initFloatingLabels(form);
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    removeErrors(form);

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = document.createElement('div');
    error.classList.add('form-error');
    error.textContent = message;
    formGroup.appendChild(error);
}

function removeErrors(form) {
    form.querySelectorAll('.form-error').forEach(error => error.remove());
}

function constructMailtoLink(formData) {
    const email = 'info@cohen-associates.com';
    const subject = encodeURIComponent('Contact Form Submission');
    const body = encodeURIComponent(
        `Name: ${formData.get('name')}\n` +
        `Email: ${formData.get('email')}\n` +
        `Phone: ${formData.get('phone') || 'Not provided'}\n\n` +
        `Message:\n${formData.get('message')}`
    );

    return `mailto:${email}?subject=${subject}&body=${body}`;
}

// Floating Labels
function initFloatingLabels(form) {
    const formGroups = form.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (!input) return;
        
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
}

// Success Message
function showSuccessMessage(form) {
    const message = document.createElement('div');
    message.classList.add('form-success');
    message.textContent = 'Thank you for your message. We\'ll be in touch soon!';
    
    form.parentNode.insertBefore(message, form.nextSibling);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}
