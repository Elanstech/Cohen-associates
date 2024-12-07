// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initServiceAnimations();
    initServiceDescriptions();
});

// Initialize AOS (Animate on Scroll)
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
    // Check if href is just "#" or empty
    if (href === "#" || !href) return;

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

// Service Category Hover Effects
function initServiceAnimations() {
    const serviceCategories = document.querySelectorAll('.service-category');
    
    serviceCategories.forEach(category => {
        // Add hover effect to list items
        const listItems = category.querySelectorAll('.category-content li');
        
        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Remove active class from all items in this category
                listItems.forEach(li => li.classList.remove('active'));
                // Add active class to hovered item
                item.classList.add('active');
            });
        });
    });

    // Initialize intersection observer for scroll animations
    const options = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe all service items
    const serviceItems = document.querySelectorAll('.service-category li');
    serviceItems.forEach(item => {
        observer.observe(item);
    });
}

// Service Descriptions
function initServiceDescriptions() {
    const serviceItems = document.querySelectorAll('.category-content li');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle expanded state
            item.classList.toggle('expanded');
            
            // Find description element
            const description = item.querySelector('p');
            const originalHeight = description.scrollHeight;
            
            // Animate description height
            if (item.classList.contains('expanded')) {
                description.style.maxHeight = originalHeight + 'px';
            } else {
                description.style.maxHeight = null;
            }
        });
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    // Reset mobile menu state
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
