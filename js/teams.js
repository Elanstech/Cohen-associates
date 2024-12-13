// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initTeamCards();
});

// Loader Animation
function initLoader() {
    const loader = document.querySelector('.loader');
    
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading');
            }, 500);
        });
    }
}

// Initialize AOS
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out'
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-links a');

    if (!menuBtn || !mobileMenu) return;

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    menuBtn.addEventListener('click', toggleMenu);

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
    if (!header) return;

    const scrollThreshold = 50;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        header.classList.toggle('scrolled', currentScroll > scrollThreshold);

        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Team Cards Animation
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Add hover effect to image
        const image = card.querySelector('.member-image img');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
        
        // Add tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = -(x - centerX) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Smooth Scroll
function scrollToSection(href) {
    if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (!target) return;

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    // Hero Section Interactive Features
function initHeroShowcase() {
    const cards = document.querySelectorAll('.showcase-card');
    const dots = document.querySelectorAll('.nav-dot');
    
    function setActiveCard(index) {
        // Remove active class from all cards and dots
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to selected card and dot
        cards[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    // Add click events to cards
    cards.forEach((card, index) => {
        card.addEventListener('click', () => setActiveCard(index));
    });
    
    // Add click events to navigation dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => setActiveCard(index));
    });
    
    // Auto-rotate cards
    let currentIndex = 0;
    const autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        setActiveCard(currentIndex);
    }, 5000);
    
    // Stop auto-rotation when user interacts
    function stopAutoRotate() {
        clearInterval(autoRotate);
    }
    
    cards.forEach(card => card.addEventListener('mouseenter', stopAutoRotate));
    dots.forEach(dot => dot.addEventListener('mouseenter', stopAutoRotate));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroShowcase();
});
}
