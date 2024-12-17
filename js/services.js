document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initScrollEffects();
    initMobileMenu();
    initServiceCards();
    initParallaxEffects();
});

// Initialize Loader
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

// Initialize AOS
function initAOS() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-out-cubic'
    });
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
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
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    let isMenuOpen = false;
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', toggleMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Close menu when pressing escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
            }
        });
    }
    
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
}

// Service Cards Interaction
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add focus states for accessibility
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('focus', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const particles = document.querySelectorAll('.particle');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        particles.forEach((particle, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = (mouseX - window.innerWidth / 2) * speed;
            const y = (mouseY - window.innerHeight / 2) * speed;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}, 250));

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const menuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    menuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Category Cards Interaction
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetSection = document.querySelector(`.service-block:nth-child(${Array.from(categoryCards).indexOf(this) + 1})`);
            if (targetSection) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hover Effect for Feature Cards
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('i').style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('i').style.transform = 'scale(1) rotate(0)';
        });
    });
}

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

// Add scroll-based animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => observer.observe(element));
}

// Initialize Background Particles
function initBackgroundParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const randomDelay = Math.random() * 2;
        
        particle.style.animation = `float ${15 + index * 2}s ${randomDelay}s infinite`;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initScrollEffects();
    initMobileMenu();
    initServiceCards();
    initParallaxEffects();
    initSmoothScroll();
    initCategoryCards();
    initFeatureCards();
    initScrollAnimations();
    initBackgroundParticles();
});
