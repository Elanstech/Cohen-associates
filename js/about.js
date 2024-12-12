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
    initTeamHover();
});

// Loader
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

// Enhanced Video Player with Error Handling
function initVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('video');
    const playButton = videoWrapper.querySelector('.play-button');
    const overlay = videoWrapper.querySelector('.video-overlay');

    if (!video || !playButton || !overlay) return;

    let isPlaying = false;

    function togglePlay(event) {
        if (event) {
            event.stopPropagation();
        }
        
        try {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                        updatePlayState();
                    }).catch(error => {
                        console.error("Video playback error:", error);
                        isPlaying = false;
                        updatePlayState();
                    });
                }
            } else {
                video.pause();
                isPlaying = false;
                updatePlayState();
            }
        } catch (error) {
            console.error("Video control error:", error);
        }
    }

    function updatePlayState() {
        const icon = playButton.querySelector('i');
        icon.classList.remove('fa-play', 'fa-pause');
        icon.classList.add(isPlaying ? 'fa-pause' : 'fa-play');
        overlay.style.opacity = isPlaying ? '0' : '1';
        overlay.style.pointerEvents = isPlaying ? 'none' : 'auto';
    }

    // Event Listeners
    playButton.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    video.addEventListener('play', () => {
        isPlaying = true;
        updatePlayState();
    });

    video.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayState();
    });

    video.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayState();
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

// AOS (Animate on Scroll) Initialization
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
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
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

// Parallax Effects
function initParallaxEffects() {
    const heroImages = document.querySelector('.hero-images');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroImages || !heroContent) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const speed = 0.15;

        requestAnimationFrame(() => {
            heroImages.style.transform = `translateY(${scrolled * speed}px)`;
            heroContent.style.transform = `translateY(${scrolled * speed * 0.5}px)`;
        });
    });
}

// Team Hover Effects
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
