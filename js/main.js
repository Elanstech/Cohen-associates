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
    initParallax();
    initDynamicText();
    initFloatingCards();
    initServiceCards();
    initFormValidation();
});

// Enhanced Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            document.body.classList.remove('loading');
            // Trigger entrance animations
            document.querySelectorAll('[data-aos]').forEach(element => {
                element.classList.add('aos-animate');
            });
        }, 500);
    });
}

// Initialize AOS with enhanced settings
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        mirror: true,
        anchorPlacement: 'top-bottom'
    });
}

// Enhanced Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-links a');
    const body = document.body;

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('no-scroll');

        if (mobileMenu.classList.contains('active')) {
            // Animate menu items sequentially
            menuLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateX(0)';
                    link.style.opacity = '1';
                }, 100 * index);
            });
        } else {
            menuLinks.forEach(link => {
                link.style.transform = 'translateX(-20px)';
                link.style.opacity = '0';
            });
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            scrollToSection(link.getAttribute('href'));
        });
    });

    // Enhanced click outside detection
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });
}

// Enhanced Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
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
                ticking = false;
            });

            ticking = true;
        }
    });
}

// Enhanced Stats Counter Animation
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
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
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeOutQuad for smoother animation
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(easeProgress * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}

// Enhanced FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all FAQ items with smooth animation
            faqItems.forEach(faqItem => {
                const faqAnswer = faqItem.querySelector('.faq-answer');
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                    faqAnswer.style.height = '0px';
                }
            });

            // Toggle clicked item
            if (!isOpen) {
                item.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                answer.style.height = '0px';
            }
        });
    });
}

// Enhanced Form Labels Animation
function initFormLabels() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        if (!input || !label) return;

        input.addEventListener('focus', () => {
            group.classList.add('focused');
            label.style.color = 'var(--secondary)';
        });

        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            if (input.value.trim()) {
                group.classList.add('has-value');
                label.style.color = 'var(--primary)';
            } else {
                group.classList.remove('has-value');
                label.style.color = 'var(--gray-500)';
            }
        });

        // Set initial state
        if (input.value.trim()) {
            group.classList.add('has-value');
        }
    });
}

// Enhanced Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (!target) return;

            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Enhanced Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Dynamic Text Animation
function initDynamicText() {
    const dynamicTexts = document.querySelectorAll('.dynamic-text');
    
    dynamicTexts.forEach(text => {
        const words = text.getAttribute('data-text').split(',');
        let currentIndex = 0;
        
        setInterval(() => {
            text.style.opacity = '0';
            setTimeout(() => {
                text.textContent = words[currentIndex];
                text.style.opacity = '1';
                currentIndex = (currentIndex + 1) % words.length;
            }, 500);
        }, 3000);
    });
}

// Enhanced Floating Cards
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
        
        // Add mouse movement effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            card.style.transform = `translate3d(${deltaX * 10}px, ${deltaY * 10}px, 0) rotate3d(${-deltaY}, ${deltaX}, 0, 12deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg)';
        });
    });
}

// Enhanced Service Cards
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            card.style.transform = `perspective(1000px) rotateX(${deltaY * 10}deg) rotateY(${deltaX * 10}deg)`;
            
            const glare = card.querySelector('.card-glare');
            if (glare) {
                glare.style.opacity = '1';
                glare.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            const glare = card.querySelector('.card-glare');
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });
}

// Enhanced Form Validation
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset previous errors
            clearErrors();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate fields
            const errors = validateForm(data);
            
            if (Object.keys(errors).length === 0) {
                // Show success animation
                showSuccessMessage();
                form.reset();
                resetFormLabels();
            } else {
                // Show errors
                showErrors(errors);
            }
        });
    }
}

function validateForm(data) {
    const errors = {};
    
    // Name validation
    if (!data.name || data.name.trim() === '') {
        errors.name = 'Name is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'Valid email is required';
    }
    
    // Message validation
    if (!data.message || data.message.trim() === '') {
        errors.message = 'Message is required';
    }
    
    return errors;
}

function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    const successMessage = document.createElement('div');
    successMessage.classList.add('form-success');
    successMessage.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Thank You!</h3>
        <p>Your message has been sent successfully. We'll get back to you soon.</p>
    `;
    
    form.appendChild(successMessage);
    
    // Animate success message
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    
    // Remove success message after delay
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 5000);
}

function showErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
        const input = document.querySelector(`[name="${field}"]`);
        const formGroup = input.closest('.form-group');
        
        formGroup.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        
        formGroup.appendChild(errorMessage);
        
        // Shake animation
        input.classList.add('shake');
        setTimeout(() => {
            input.classList.remove('shake');
        }, 600);
    });
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

function resetFormLabels() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-value');
        const label = group.querySelector('label');
        if (label) {
            label.style.color = 'var(--gray-500)';
        }
    });
}

// Initialize particles background
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#1a237e'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#1a237e',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}
