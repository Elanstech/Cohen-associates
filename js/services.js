// Import necessary dependencies
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initServiceInteractions();
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

// Service Interactions
function initServiceInteractions() {
    const serviceItems = document.querySelectorAll('.service-item');
    const featuredServices = document.querySelectorAll('.featured-service');

    // Add hover interactions for service items
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('h3');
            if (icon) {
                icon.style.color = 'var(--secondary-dark)';
            }
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('h3');
            if (icon) {
                icon.style.color = 'var(--secondary)';
            }
        });
    });

    // Add hover interactions for featured services
    featuredServices.forEach(service => {
        service.addEventListener('mouseenter', () => {
            const icon = service.querySelector('.service-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            service.style.transform = 'translateY(-10px) scale(1.02)';
        });

        service.addEventListener('mouseleave', () => {
            const icon = service.querySelector('.service-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            service.style.transform = 'translateY(0) scale(1)';
        });

        // Add click handler for smooth scrolling
        service.addEventListener('click', () => {
            const serviceType = service.getAttribute('data-service');
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

// Handle window events
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

window.addEventListener('resize', () => {
    AOS.refresh();
});

// Prevent form submission if present
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form handling logic here
    });
});

// Initialize any tooltips or popovers
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        // Add your tooltip logic here
    });
});

// Handle service card learn more buttons
document.querySelectorAll('.learn-more').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering parent card click
        const service = e.target.closest('.featured-service').getAttribute('data-service');
        const section = document.querySelector(`#${service}-section`);
        if (section) {
            scrollToSection(section);
        }
    });
});
