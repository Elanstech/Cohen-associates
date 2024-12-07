// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initHeroAnimations();
    initServiceAnimations();
    initTypingEffect();
    init3DCards();
    initParticleEffect();
});

// Page Loader with Progress
function initLoader() {
    const loader = document.querySelector('.loader');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            clearInterval(interval);
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }
    }, 200);
}

// Initialize AOS with custom settings
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

// Mobile Menu with Animation
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-links a');

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');

        if (mobileMenu.classList.contains('active')) {
            // Animate menu items sequentially
            menuLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateX(0)';
                    link.style.opacity = '1';
                }, 100 * index);
            });
        } else {
            menuLinks.forEach(link => {
                link.style.transform = 'translateX(-20px)';
                link.style.opacity = '0';
            });
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
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

// Enhanced Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    let lastScroll = 0;
    let headerHidden = false;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const scrollDelta = currentScroll - lastScroll;

        // Add/remove scrolled class with smooth transition
        if (currentScroll > scrollThreshold) {
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
        }

        // Auto-hide header on scroll down, show on scroll up
        if (currentScroll > 500) {
            if (scrollDelta > 0 && !headerHidden) {
                header.style.transform = 'translateY(-100%)';
                headerHidden = true;
            } else if (scrollDelta < 0 && headerHidden) {
                header.style.transform = 'translateY(0)';
                headerHidden = false;
            }
        }

        lastScroll = currentScroll;
    });
}

// Typing Effect Animation
function initTypingEffect() {
    const text = "Expert Financial Solutions for Your Success";
    const typingText = document.querySelector('.typing-text');
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typingText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, Math.random() * 100 + 50);
        } else {
            setTimeout(backspace, 2000);
        }
    }

    function backspace() {
        if (charIndex > 0) {
            typingText.textContent = text.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(backspace, 50);
        } else {
            setTimeout(type, 1000);
        }
    }

    type();
}

// 3D Cards Animation
function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        VanillaTilt.init(card, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.icon-wrapper i');
            icon.style.transform = 'scale(1.2) rotate(360deg)';
            icon.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.icon-wrapper i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Particle Effect
function initParticleEffect() {
    const particleGrid = document.querySelector('.particles');
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particleGrid.appendChild(particle);
        particles.push(particle);
    }

    // Animate particles on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.05;
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Service Category Animations
function initServiceAnimations() {
    const categories = document.querySelectorAll('.service-category');
    
    categories.forEach(category => {
        const header = category.querySelector('.category-header');
        const items = category.querySelectorAll('.category-content li');
        
        // Header hover effect
        header.addEventListener('mouseenter', () => {
            const icon = header.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(15deg)';
        });
        
        header.addEventListener('mouseleave', () => {
            const icon = header.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // List items hover effect
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.opacity = '0.5';
                        otherItem.style.transform = 'scale(0.95)';
                    }
                });
                item.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                items.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                    otherItem.style.transform = 'scale(1)';
                });
            });
        });
    });
}

// Smooth Scroll with Progress Indicator
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Handle window events
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

window.addEventListener('resize', () => {
    AOS.refresh();
});

// Initialize parallax effect
let parallaxAnimationFrame;
function handleParallax() {
    if (parallaxAnimationFrame) return;

    parallaxAnimationFrame = requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.services-hero');
        
        if (heroSection && scrolled < window.innerHeight) {
            const shapes = heroSection.querySelectorAll('.shape');
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.2;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        
        parallaxAnimationFrame = null;
    });
}

window.addEventListener('scroll', handleParallax);
