// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initParallaxEffects();
    initHeroVideo();
    initStatsCounter();
});

// Hero Video Initialization
function initHeroVideo() {
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Ensure video plays when it's ready
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.play().catch(error => {
                console.log("Auto-play was prevented:", error);
            });
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                heroVideo.play().catch(error => {
                    console.log("Play on visibility change was prevented:", error);
                });
            }
        });

        // Optimize performance by reducing quality when not in viewport
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        heroVideo.pause();
                    } else {
                        heroVideo.play().catch(error => {
                            console.log("Play on intersection was prevented:", error);
                        });
                    }
                });
            }, {
                threshold: 0.1
            });

            observer.observe(heroVideo);
        }
    }
}

// Loader
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
        disable: window.innerWidth < 768
    });
}

// Improved Mobile Menu Implementation
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    // Create overlay div if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', toggleMenu);
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
        
        // Close menu when clicking links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }
    
    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        overlay.classList.toggle('active');
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
    }, 50));
}

// Stats Counter Animation with Improved Performance
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const stat = entry.target;
                    const targetValue = parseInt(stat.getAttribute('data-value'));
                    const progressCircle = stat.closest('.stat-card').querySelector('.progress-ring-circle');
                    
                    animateCounter(stat, targetValue);
                    animateProgress(progressCircle, targetValue);
                    stat.classList.add('counted');
                }
            });
        }, {
            threshold: 0.5
        });
        
        stats.forEach(stat => observer.observe(stat));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        stats.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-value'));
            animateCounter(stat, targetValue);
            
            const progressCircle = stat.closest('.stat-card').querySelector('.progress-ring-circle');
            if (progressCircle) {
                animateProgress(progressCircle, targetValue);
            }
        });
    }
}

function animateCounter(element, target) {
    if (!element) return;
    
    const duration = 2000;
    const start = performance.now();
    
    // Check if we should use reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Skip animation for users who prefer reduced motion
        element.textContent = target + (target === 95 ? '%' : '');
        return;
    }
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(easeOutQuart * target);
        
        element.textContent = current + (target === 95 ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateProgress(circle, percentage) {
    if (!circle) return;
    
    // Check if we should use reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const circumference = 2 * Math.PI * 54; // circle radius = 54
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    if (prefersReducedMotion) {
        // Skip animation for users who prefer reduced motion
        circle.style.strokeDashoffset = offset;
        circle.style.opacity = '1';
        return;
    }
    
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 2s ease, opacity 0.5s ease';
        circle.style.strokeDashoffset = offset;
        circle.style.opacity = '1';
    }, 100);
}

// Parallax Effects
function initParallaxEffects() {
    const particles = document.querySelectorAll('.particle');
    
    // Only enable on desktop as it can cause performance issues on mobile
    if (window.innerWidth > 992 && particles.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        
        // Check if we should use reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            document.addEventListener('mousemove', throttle((e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                particles.forEach((particle, index) => {
                    const speed = 0.02 + (index * 0.01);
                    const x = (mouseX - window.innerWidth / 2) * speed;
                    const y = (mouseY - window.innerHeight / 2) * speed;
                    
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                });
            }, 50));
        }
    }
}

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const overlay = document.querySelector('.menu-overlay');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
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

// Smooth Scroll Implementation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll to hash links that point to elements on the page
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = document.querySelector('.header').offsetHeight;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Run smooth scroll init if not already done
if (!window.smoothScrollInitialized) {
    initSmoothScroll();
    window.smoothScrollInitialized = true;
}
