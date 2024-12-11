// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initVideoPlayer();
    initFloatingElements();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStatsCounter();
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
        } else {
            video.pause();
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        }
    });

    video.addEventListener('ended', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });
}

// Floating Elements
function initFloatingElements() {
    const elements = document.querySelectorAll('.floating-circle, .floating-square, .floating-diamond');
    
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });
}

// AOS Initialization
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-links a');

    menuBtn.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Stats Counter
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
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
