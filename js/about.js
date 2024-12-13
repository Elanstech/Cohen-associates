// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initVideoModal();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStatsCounter();
    initSmoothScroll();
    initTeamHover();
});

// Video Modal Functions
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('storyVideo');
    
    window.openVideoModal = function() {
        modal.classList.add('active');
        video.play();
        document.body.style.overflow = 'hidden';
    };
    
    window.closeVideoModal = function() {
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        document.body.style.overflow = '';
    };
    
    // Close modal when clicking outside video
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}

// Enhanced Stats Counter with Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
                // Animate the progress ring
                const progressRing = entry.target.closest('.stat-item')
                    .querySelector('.progress-ring');
                if (progressRing) {
                    progressRing.style.opacity = '1';
                }
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-value'));
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
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
    if (href === '#') return;
    
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

// Team Card Hover Effects
function initTeamHover() {
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        const image = card.querySelector('.member-image img');
        
        if (!image) return;

        card.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    });
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
