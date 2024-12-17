// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initTeamCards();
    initParallaxEffects();
    initTeamShowcase();
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

// Initialize AOS (Animate on Scroll)
function initAOS() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        delay: 50
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

        // Handle mobile menu links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    toggleMenu();
                }
            });
        });
    }
    
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        header.classList.toggle('scrolled', currentScroll > scrollThreshold);
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// Team Cards Interaction
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Add hover effect
        const image = card.querySelector('.member-image img');
        const overlay = card.querySelector('.image-overlay');
        const socialLinks = card.querySelector('.member-social');
        
        card.addEventListener('mouseenter', () => {
            if (image) image.style.transform = 'scale(1.1)';
            if (overlay) overlay.style.opacity = '1';
            if (socialLinks) socialLinks.style.opacity = '1';
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) image.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
            if (socialLinks) socialLinks.style.opacity = '0';
            card.style.transform = 'translateY(0)';
        });
        
        // Add focus states for accessibility
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('focus', () => {
            card.style.transform = 'translateY(-10px)';
            if (overlay) overlay.style.opacity = '1';
            if (socialLinks) socialLinks.style.opacity = '1';
        });
        
        card.addEventListener('blur', () => {
            card.style.transform = 'translateY(0)';
            if (overlay) overlay.style.opacity = '0';
            if (socialLinks) socialLinks.style.opacity = '0';
        });
    });
}

// Team Showcase Carousel
function initTeamShowcase() {
    const showcase = document.querySelector('.team-showcase');
    if (!showcase) return;

    const cards = document.querySelectorAll('.showcase-card');
    const dots = document.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let interval;

    // Initialize dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setActiveCard(index);
            resetInterval();
        });
    });

    // Initialize carousel
    function setActiveCard(index) {
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Auto-play functionality
    function startInterval() {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            setActiveCard(currentIndex);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(interval);
        startInterval();
    }

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    showcase.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    showcase.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                currentIndex = (currentIndex + 1) % cards.length;
            } else {
                // Swipe right
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            setActiveCard(currentIndex);
            resetInterval();
        }
    }

    // Start carousel
    setActiveCard(0);
    startInterval();
}

// Parallax Effects for Background Circles
function initParallaxEffects() {
    const circles = document.querySelectorAll('.circle');
    if (!circles.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Update window dimensions on resize
    window.addEventListener('resize', debounce(() => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    }, 250));

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        requestAnimationFrame(() => {
            circles.forEach((circle, index) => {
                const speed = 0.02 + (index * 0.01);
                const x = (mouseX - windowWidth / 2) * speed;
                const y = (mouseY - windowHeight / 2) * speed;
                
                circle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    });
}

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
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
