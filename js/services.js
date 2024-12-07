// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initHeroAnimations();
    initServiceAnimations();
    initServiceDescriptions();
});

// Page Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        document.body.classList.remove('loading');
        
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });
}

// Initialize AOS (Animate on Scroll)
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

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Hero Animations
function initHeroAnimations() {
    // Parallax effect for floating icons
    const icons = document.querySelectorAll('.floating-icons i');
    
    window.addEventListener('mousemove', (e) => {
        icons.forEach(icon => {
            const speed = icon.getAttribute('data-speed');
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            
            icon.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });

    // Hero card animations
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Service Animations
function initServiceAnimations() {
    const serviceCategories = document.querySelectorAll('.service-category');
    
    serviceCategories.forEach(category => {
        const listItems = category.querySelectorAll('.category-content li');
        
        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                listItems.forEach(li => li.classList.remove('active'));
                item.classList.add('active');
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    document.querySelectorAll('.service-category li').forEach(item => {
        observer.observe(item);
    });
}

// Service Descriptions
function initServiceDescriptions() {
    const serviceItems = document.querySelectorAll('.category-content li');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
            
            const description = item.querySelector('p');
            const originalHeight = description.scrollHeight;
            
            if (item.classList.contains('expanded')) {
                description.style.maxHeight = originalHeight + 'px';
            } else {
                description.style.maxHeight = null;
            }
        });
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
    if (href === "#" || !href) return;

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

// Handle window resize
function handleResize() {
    const width = window.innerWidth;
    const heroCards = document.querySelector('.hero-cards');
    
    if (width < 768) {
        heroCards.setAttribute('data-aos-delay', '0');
    } else {
        const cards = heroCards.querySelectorAll('.hero-card');
        cards.forEach((card, index) => {
            card.setAttribute('data-aos-delay', (index + 1) * 100);
        });
    }
}

// Add scroll-based parallax effect to hero section
let parallaxAnimationFrame;
function handleParallax() {
    if (parallaxAnimationFrame) {
        return;
    }

    parallaxAnimationFrame = requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.services-hero');
        
        if (heroSection && scrolled < window.innerHeight) {
            const circles = heroSection.querySelectorAll('.circle');
            const icons = heroSection.querySelectorAll('.floating-icons i');
            
            circles.forEach((circle, index) => {
                const speed = index + 1;
                circle.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
            });
            
            icons.forEach((icon, index) => {
                const speed = (index + 1) * 0.05;
                icon.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        
        parallaxAnimationFrame = null;
    });
}

// Window event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleParallax);
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    handleResize();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Handle service category interactions
document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.service-category');
    
    categories.forEach(category => {
        const header = category.querySelector('.category-header');
        const content = category.querySelector('.category-content');
        
        header.addEventListener('mouseenter', () => {
            const icon = header.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(15deg)';
        });
        
        header.addEventListener('mouseleave', () => {
            const icon = header.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Add hover effects to list items
        const items = content.querySelectorAll('li');
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const siblings = [...items].filter(sibling => sibling !== item);
                siblings.forEach(sibling => {
                    sibling.style.opacity = '0.7';
                });
            });
            
            item.addEventListener('mouseleave', () => {
                items.forEach(sibling => {
                    sibling.style.opacity = '1';
                });
            });
        });
    });
});
