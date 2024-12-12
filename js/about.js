// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initVideoPlayer();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initStatsCounter();
    initSmoothScroll();
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

    // Update UI based on video state
    function updatePlayState(playing) {
        isPlaying = playing;
        playButton.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        overlay.style.opacity = playing ? '0' : '1';
        overlay.style.pointerEvents = playing ? 'none' : 'auto';
    }

    // Play button click handler
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    });

    // Video event listeners
    video.addEventListener('play', () => {
        updatePlayState(true);
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

// Stats Counter
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

// Hero Parallax Effect
function initHeroParallax() {
    const heroImage = document.querySelector('.hero-visual');
    const shapes = document.querySelectorAll('.floating-shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        shapes.forEach((shape, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            shape.style.transform = `translate(${scrolled * 0.05 * direction}px, ${scrolled * 0.05}px) rotate(${15 * direction}deg)`;
        });
    });
}

// Initialize any additional animations
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
