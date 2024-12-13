// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initVideoPlayer();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStatsCounter();
    initSmoothScroll();
    initTeamHover();
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

// Video Player Controls
function initVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('video');
    const playButton = videoWrapper.querySelector('.play-button');
    const overlay = videoWrapper.querySelector('.video-overlay');

    if (!video || !playButton || !overlay) return;

    function togglePlay(event) {
        if (event) event.stopPropagation();
        
        if (video.paused) {
            video.play();
            playButton.querySelector('i').classList.replace('fa-play', 'fa-pause');
            overlay.style.opacity = '0';
        } else {
            video.pause();
            playButton.querySelector('i').classList.replace('fa-pause', 'fa-play');
            overlay.style.opacity = '1';
        }
    }

    playButton.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
}

// AOS Animation Initialization
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

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-value'));
    const duration = 2000;
    const start = Date.now();

    function update() {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(progress * target);
        
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Smooth Scroll Implementation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(anchor.getAttribute('href'));
        });
    });
}

function scrollToSection(href) {
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

// Sticky Header Implementation
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const scrollThreshold = 50;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        header.classList.toggle('scrolled', currentScroll > scrollThreshold);

        // Hide/show header based on scroll direction
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
