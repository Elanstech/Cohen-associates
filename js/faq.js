// Initialize all functionalities when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollEffects();
    initMobileMenu();
    initStickyHeader();
    initFAQAccordion();
    initAnimations();
    initSmoothScroll();
    initAOS();
});

// Page Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.add('page-loaded');
        }, 500);
    });
}

// Scroll Effects
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        // Header shadow on scroll
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
    }, 50));
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Close menu on link click
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
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
    
    const sentinel = document.createElement('div');
    document.body.prepend(sentinel);
    stickyHeader.observe(sentinel);
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Set initial height to 0
        answer.style.height = '0px';
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.height = '0px';
                }
            });
            
            // Toggle current item
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

// Animations
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

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
            if (target) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function: Throttle
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
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Recalculate FAQ answer heights if they're open
    const openFAQs = document.querySelectorAll('.faq-item.active');
    openFAQs.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        answer.style.height = answer.scrollHeight + 'px';
    });
}, 250));

// Utility function: Debounce
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
