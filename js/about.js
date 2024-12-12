// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initVideoPlayer();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStatsCounter();
    initSmoothScroll();
    initParallaxEffects();
});

// Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('loading');
        }, 500);
    });
}

// Enhanced Video Player
function initVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('video');
    const playButton = videoWrapper.querySelector('.play-button');
    const overlay = videoWrapper.querySelector('.video-overlay');

    if (!video || !playButton || !overlay) return;

    // Initial state
    video.controls = false;
    let isPlaying = false;

    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function updateButton() {
        const icon = playButton.querySelector('i');
        icon.classList.remove('fa-play', 'fa-pause');
        icon.classList.add(video.paused ? 'fa-play' : 'fa-pause');
    }

    function updateOverlay() {
        overlay.style.opacity = video.paused ? '1' : '0';
        overlay.style.pointerEvents = video.paused ? 'auto' : 'none';
    }

    // Event Listeners
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    video.addEventListener('click', () => {
        togglePlay();
    });

    video.addEventListener('play', () => {
        isPlaying = true;
        updateButton();
        updateOverlay();
    });

    video.addEventListener('pause', () => {
        isPlaying = false;
        updateButton();
        updateOverlay();
    });

    video.addEventListener('ended', () => {
        isPlaying = false;
        updateButton();
        updateOverlay();
    });

    // Keyboard Navigation
    videoWrapper.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
    });

    videoWrapper.setAttribute('tabindex', '0');
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

// Enhanced Stats Counter
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

// Parallax Effects
function initParallaxEffects() {
    const shapes = document.querySelectorAll('.hero-shape-1, .hero-shape-2, .hero-shape-3');
    const heroImages = document.querySelector('.hero-images');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (heroImages) {
            heroImages.style.transform = `translateY(${scrolled * 0.1}px)`;
        }

        shapes.forEach((shape, index) => {
            const speed = 0.1 * (index + 1);
            const direction = index % 2 === 0 ? 1 : -1;
            shape.style.transform = `translate(${scrolled * speed * direction}px, ${scrolled * speed}px)`;
        });
    });
}

// Team Member Hover Effects
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const image = card.querySelector('.member-image img');
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const image = card.querySelector('.member-image img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

// Initialize Timeline Animation
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => observer.observe(item));
});
