// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initServiceInteractions();
    initSmoothScroll();
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


// Initialize AOS with custom settings
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

// Service Cards Interactions
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.featured-service');

    serviceCards.forEach(card => {
        // Add hover effect for service icons
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon i');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });

        // Add click handler for service cards
        card.addEventListener('click', () => {
            const serviceType = card.getAttribute('data-service');
            const targetSection = document.querySelector(`#${serviceType}-section`);
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
    });

    // Handle learn more buttons separately
    document.querySelectorAll('.learn-more').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent card click
            const serviceType = e.target.closest('.featured-service').getAttribute('data-service');
            const targetSection = document.querySelector(`#${serviceType}-section`);
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
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

// Helper function for smooth scrolling
function scrollToSection(target) {
    if (target === '#') return;
    
    const targetElement = typeof target === 'string' 
        ? document.querySelector(target) 
        : target;

    if (!targetElement) return;

    const headerHeight = document.querySelector('.header').offsetHeight;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Particle Animation (optional enhancement)
function initParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Random initial position
        const x = Math.random() * 20 - 10;
        const y = Math.random() * 20 - 10;
        
        // Apply random transform
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Refresh AOS on window resize
window.addEventListener('resize', () => {
    AOS.refresh();
});

// Initialize particle animation if present
if (document.querySelector('.particle')) {
    initParticleAnimation();
}

// Handle form submission if contact form exists
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
    });
}
