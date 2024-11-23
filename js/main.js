// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu toggle button
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.display = 'none';

    // Insert button before nav menu
    header.insertBefore(mobileMenuBtn, navMenu);

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
});

// Form validation for contact forms
function validateForm(event) {
    const form = event.target;
    const email = form.querySelector('input[type="email"]');
    const phone = form.querySelector('input[type="tel"]');
    
    let isValid = true;
    
    // Email validation
    if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        email.classList.add('error');
    } else if (email) {
        email.classList.remove('error');
    }
    
    // Phone validation
    if (phone && !phone.value.match(/^\+?[\d\s-]{10,}$/)) {
        isValid = false;
        phone.classList.add('error');
    } else if (phone) {
        phone.classList.remove('error');
    }
    
    return isValid;
}
