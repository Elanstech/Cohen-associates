// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initVideoPlayer();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStatsCounter();
    initHeroParallax();
});

// Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });
}

// Video Player
function initVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('video');
    const playButton = videoWrapper.querySelector('.play-button');
    const overlay = videoWrapper.querySelector('.video-overlay');

    playButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    video.addEventListener('ended', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    });
}

// AOS Initialization
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
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

// Hero Parallax Effect
function initHeroParallax() {
    const heroImage = document.querySelector('.hero-image');
    const accentBox = document.querySelector('.accent-box');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroImage && accentBox) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            accentBox.style.transform = `translate(${scrolled * 0.05}px, ${scrolled * 0.05}px)`;
        }
    });
}

// Smooth Scroll
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

// Handle floating animations for milestone items
document.querySelectorAll('.milestone').forEach((milestone, index) => {
    milestone.style.animationDelay = `${index * 0.2}s`;
});

// Handle team member hover effects
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.member-image img').style.transform = 'scale(1.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.member-image img').style.transform = 'scale(1)';
    });
});
